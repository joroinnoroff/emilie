"use client"

import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useClient } from "sanity"
import { apiVersion } from "../env"
import { IncomeChart, type ChartPoint, type MonthBar } from "./IncomeChart"

type SaleRow = {
  _id: string
  soldAt?: string
  title?: string
  amountNok?: number
  amountEur?: number
  source?: string
  variant?: string
}

type DashboardStats = {
  total: number
  newCount: number
  inProgress: number
  sold: number
  closed: number
  recent: Array<{
    _id: string
    name?: string
    status?: string
    receivedAt?: string
    shippingLocation?: string
    lineTitles?: string[]
  }>
  sales: SaleRow[]
}

const empty: DashboardStats = {
  total: 0,
  newCount: 0,
  inProgress: 0,
  sold: 0,
  closed: 0,
  recent: [],
  sales: [],
}

function formatMoney(n: number, currency: "NOK" | "EUR") {
  if (!n) return currency === "NOK" ? "0 kr" : "€0"
  return new Intl.NumberFormat(currency === "NOK" ? "nb-NO" : "en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

function buildCumulative(
  sales: SaleRow[],
  currency: "NOK" | "EUR"
): { points: ChartPoint[]; total: number } {
  const sorted = [...sales]
    .filter((s) => s.soldAt)
    .sort(
      (a, b) =>
        new Date(a.soldAt || 0).getTime() - new Date(b.soldAt || 0).getTime()
    )

  let running = 0
  const points: ChartPoint[] = []
  for (const s of sorted) {
    const amount =
      currency === "NOK" ? Number(s.amountNok) || 0 : Number(s.amountEur) || 0
    if (!amount) continue
    running += amount
    const d = new Date(s.soldAt!)
    points.push({
      date: s.soldAt!,
      label: d.toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "short",
      }),
      total: running,
      amount,
      title: s.title || "Sale",
    })
  }
  return { points, total: running }
}

function buildMonthlyBars(
  sales: SaleRow[],
  currency: "NOK" | "EUR"
): MonthBar[] {
  const now = new Date()
  const months: MonthBar[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    months.push({
      key,
      label: d.toLocaleDateString("nb-NO", { month: "short" }),
      amount: 0,
    })
  }
  const byKey = new Map(months.map((m) => [m.key, m]))
  for (const s of sales) {
    if (!s.soldAt) continue
    const d = new Date(s.soldAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const bucket = byKey.get(key)
    if (!bucket) continue
    bucket.amount +=
      currency === "NOK" ? Number(s.amountNok) || 0 : Number(s.amountEur) || 0
  }
  return months
}

export function InquiriesDashboard() {
  const client = useClient({ apiVersion })
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currency, setCurrency] = useState<"NOK" | "EUR">("NOK")
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    setRefreshing(true)
    try {
      const data = await client.fetch<DashboardStats>(`{
        "total": count(*[_type == "inquiry"]),
        "newCount": count(*[_type == "inquiry" && status == "new"]),
        "inProgress": count(*[_type == "inquiry" && status == "in_progress"]),
        "sold": count(*[_type == "inquiry" && status == "sold"]),
        "closed": count(*[_type == "inquiry" && status == "closed"]),
        "recent": *[_type == "inquiry"] | order(receivedAt desc)[0...8]{
          _id,
          name,
          status,
          receivedAt,
          shippingLocation,
          "lineTitles": lines[].title
        },
        "sales": *[_type == "sale"] | order(soldAt asc) {
          _id,
          soldAt,
          title,
          amountNok,
          amountEur,
          source,
          variant
        }
      }`)
      setStats(data || empty)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
      setStats((prev) => prev || empty)
    } finally {
      setRefreshing(false)
    }
  }, [client])

  useEffect(() => {
    void load()
  }, [load])

  // Refresh when returning to the tool after marking sold
  useEffect(() => {
    const onFocus = () => {
      void load()
    }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [load])

  const { points, total } = useMemo(
    () => buildCumulative(stats?.sales || [], currency),
    [stats?.sales, currency]
  )
  const months = useMemo(
    () => buildMonthlyBars(stats?.sales || [], currency),
    [stats?.sales, currency]
  )

  if (!stats) {
    return (
      <Flex align="center" justify="center" padding={6}>
        <Spinner muted />
      </Flex>
    )
  }

  return (
    <Box padding={4} paddingX={[3, 4, 5]} style={{ maxWidth: 960, margin: "0 auto" }}>
      <Stack space={5}>
        <Flex align="flex-start" justify="space-between" gap={3} wrap="wrap">
          <Stack space={2} style={{ flex: 1, minWidth: 200 }}>
            <Heading as="h1" size={3}>
              Sales & inquiries
            </Heading>
            <Text muted size={1}>
              Total income grows when you mark an inquiry or a work as sold.
              Hover points on the graph for each sale. Personvern: erase or
              delete inquiry documents to remove customer data.
            </Text>
          </Stack>
          <Button
            text={refreshing ? "Refreshing…" : "Refresh"}
            mode="ghost"
            disabled={refreshing}
            onClick={() => void load()}
          />
        </Flex>

        {error ? (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        ) : null}

        <Card padding={4} radius={2} shadow={1} tone="positive">
          <Stack space={4}>
            <Flex align="center" justify="space-between" gap={3} wrap="wrap">
              <Stack space={2}>
                <Text size={1} muted>
                  Total income
                </Text>
                <Text size={4} weight="semibold">
                  {formatMoney(total, currency)}
                </Text>
                <Text size={1} muted>
                  {(stats.sales || []).length} sale
                  {(stats.sales || []).length === 1 ? "" : "s"} recorded
                </Text>
              </Stack>
              <Flex gap={2}>
                <Button
                  text="NOK"
                  mode={currency === "NOK" ? "default" : "ghost"}
                  tone={currency === "NOK" ? "positive" : "default"}
                  onClick={() => setCurrency("NOK")}
                />
                <Button
                  text="EUR"
                  mode={currency === "EUR" ? "default" : "ghost"}
                  tone={currency === "EUR" ? "positive" : "default"}
                  onClick={() => setCurrency("EUR")}
                />
              </Flex>
            </Flex>
            <IncomeChart
              points={points}
              months={months}
              currency={currency}
              formatMoney={formatMoney}
            />
          </Stack>
        </Card>

        <Grid columns={[1, 2, 4]} gap={3}>
          <StatCard label="Total inquiries" value={String(stats.total)} />
          <StatCard label="New" value={String(stats.newCount)} tone="caution" />
          <StatCard label="Sold inquiries" value={String(stats.sold)} tone="positive" />
          <StatCard
            label="In progress / closed"
            value={`${stats.inProgress} / ${stats.closed}`}
          />
        </Grid>

        <Stack space={3}>
          <Heading as="h2" size={1}>
            Recent sales
          </Heading>
          {(stats.sales || []).length === 0 ? (
            <Card padding={4} radius={2} border>
              <Text muted size={1}>
                No sales recorded yet. Use <strong>Mark as sold</strong> on an
                inquiry or a work.
              </Text>
            </Card>
          ) : (
            <Stack space={2}>
              {[...(stats.sales || [])]
                .reverse()
                .slice(0, 10)
                .map((sale) => {
                  const amount =
                    currency === "NOK"
                      ? Number(sale.amountNok) || 0
                      : Number(sale.amountEur) || 0
                  return (
                    <Card key={sale._id} padding={3} radius={2} border>
                      <Flex justify="space-between" gap={3} wrap="wrap">
                        <Stack space={2} style={{ minWidth: 0, flex: 1 }}>
                          <Text weight="semibold">{sale.title || "Sale"}</Text>
                          <Text size={1} muted>
                            {[sale.variant, sale.source]
                              .filter(Boolean)
                              .join(" · ")}
                          </Text>
                        </Stack>
                        <Stack space={2} style={{ textAlign: "right" }}>
                          <Text size={1} weight="medium">
                            {formatMoney(amount, currency)}
                          </Text>
                          <Text size={1} muted>
                            {sale.soldAt
                              ? new Date(sale.soldAt).toLocaleString("nb-NO")
                              : ""}
                          </Text>
                        </Stack>
                      </Flex>
                    </Card>
                  )
                })}
            </Stack>
          )}
        </Stack>

        <Stack space={3}>
          <Heading as="h2" size={1}>
            Recent inquiries
          </Heading>
          {stats.recent.length === 0 ? (
            <Card padding={4} radius={2} border>
              <Text muted size={1}>
                No inquiries yet.
              </Text>
            </Card>
          ) : (
            <Stack space={2}>
              {stats.recent.map((row) => (
                <Card key={row._id} padding={3} radius={2} border>
                  <Flex justify="space-between" gap={3} wrap="wrap">
                    <Stack space={2} style={{ minWidth: 0, flex: 1 }}>
                      <Text weight="semibold">{row.name || "—"}</Text>
                      <Text size={1} muted>
                        {(row.lineTitles || []).filter(Boolean).join(", ") ||
                          "No works listed"}
                      </Text>
                      {row.shippingLocation ? (
                        <Text size={1}>Shipping: {row.shippingLocation}</Text>
                      ) : null}
                    </Stack>
                    <Stack space={2} style={{ textAlign: "right" }}>
                      <Text size={1} weight="medium">
                        {row.status || "—"}
                      </Text>
                      <Text size={1} muted>
                        {row.receivedAt
                          ? new Date(row.receivedAt).toLocaleString("nb-NO")
                          : ""}
                      </Text>
                    </Stack>
                  </Flex>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "positive" | "caution" | "critical"
}) {
  return (
    <Card padding={4} radius={2} shadow={1} tone={tone}>
      <Stack space={2}>
        <Text size={1} muted>
          {label}
        </Text>
        <Text size={3} weight="semibold">
          {value}
        </Text>
      </Stack>
    </Card>
  )
}
