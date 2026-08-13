"use client"

import { Box, Card, Flex, Grid, Stack, Text } from "@sanity/ui"

export type ChartPoint = {
  date: string
  label: string
  total: number
  amount: number
  title: string
}

export type MonthBar = {
  key: string
  label: string
  amount: number
}

type Props = {
  points: ChartPoint[]
  months: MonthBar[]
  currency: "NOK" | "EUR"
  formatMoney: (n: number, currency: "NOK" | "EUR") => string
}

export function IncomeChart({ points, months, currency, formatMoney }: Props) {
  if (points.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 200 }}>
        <Text muted size={1}>
          No sales yet — mark an inquiry or work as sold to start the graph.
        </Text>
      </Flex>
    )
  }

  return (
    <Stack space={5}>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          Cumulative income
        </Text>
        <Text size={1} muted>
          Total grows with each sale over time
        </Text>
        <CumulativeLine
          points={points}
          currency={currency}
          formatMoney={formatMoney}
        />
      </Stack>

      <Stack space={3}>
        <Text size={1} weight="semibold">
          Income by month
        </Text>
        <MonthlyBars
          months={months}
          currency={currency}
          formatMoney={formatMoney}
        />
      </Stack>
    </Stack>
  )
}

function CumulativeLine({
  points,
  currency,
  formatMoney,
}: {
  points: ChartPoint[]
  currency: "NOK" | "EUR"
  formatMoney: (n: number, currency: "NOK" | "EUR") => string
}) {
  const width = 720
  const height = 260
  const padL = 56
  const padR = 20
  const padT = 20
  const padB = 40
  const innerW = width - padL - padR
  const innerH = height - padT - padB
  const maxY = Math.max(...points.map((p) => p.total), 1)

  // Start at zero so the climb is visible
  const series = [
    {
      date: points[0].date,
      label: "",
      total: 0,
      amount: 0,
      title: "Start",
    },
    ...points,
  ]

  const xs = series.map((_, i) =>
    series.length === 1
      ? padL + innerW / 2
      : padL + (i / (series.length - 1)) * innerW
  )
  const ys = series.map((p) => padT + innerH - (p.total / maxY) * innerH)
  const lineD = series
    .map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`)
    .join(" ")
  const areaD = `${lineD} L ${xs[xs.length - 1]} ${padT + innerH} L ${xs[0]} ${padT + innerH} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: padT + innerH - t * innerH,
    value: maxY * t,
  }))

  const labelIdx =
    points.length <= 5
      ? points.map((_, i) => i + 1)
      : [
          1,
          Math.floor(points.length / 2) + 1,
          points.length,
        ]

  return (
    <Card padding={3} radius={2} border tone="transparent">
      <Box style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          style={{ display: "block", minWidth: 320 }}
          role="img"
          aria-label={`Cumulative income in ${currency}`}
        >
          {yTicks.map((tick) => (
            <g key={tick.y}>
              <line
                x1={padL}
                x2={width - padR}
                y1={tick.y}
                y2={tick.y}
                stroke="rgba(0,0,0,0.08)"
              />
              <text
                x={padL - 10}
                y={tick.y + 3}
                textAnchor="end"
                fontSize="11"
                fill="rgba(0,0,0,0.45)"
              >
                {formatAxis(tick.value)}
              </text>
            </g>
          ))}

          <path d={areaD} fill="rgba(34, 120, 80, 0.14)" />
          <path
            d={lineD}
            fill="none"
            stroke="rgb(34, 120, 80)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {series.map((p, i) =>
            i === 0 ? null : (
              <g key={`${p.date}-${i}`}>
                <circle
                  cx={xs[i]}
                  cy={ys[i]}
                  r="5.5"
                  fill="#fff"
                  stroke="rgb(34, 120, 80)"
                  strokeWidth="2.5"
                />
                <title>
                  {p.title}: +{formatMoney(p.amount, currency)} →{" "}
                  {formatMoney(p.total, currency)} ({p.label})
                </title>
              </g>
            )
          )}

          {labelIdx.map((i) => (
            <text
              key={`label-${i}`}
              x={xs[i]}
              y={height - 14}
              textAnchor="middle"
              fontSize="11"
              fill="rgba(0,0,0,0.5)"
            >
              {series[i].label}
            </text>
          ))}
        </svg>
      </Box>
    </Card>
  )
}

function MonthlyBars({
  months,
  currency,
  formatMoney,
}: {
  months: MonthBar[]
  currency: "NOK" | "EUR"
  formatMoney: (n: number, currency: "NOK" | "EUR") => string
}) {
  const max = Math.max(...months.map((m) => m.amount), 1)
  const height = 160

  if (months.length === 0) {
    return (
      <Text muted size={1}>
        No monthly data yet.
      </Text>
    )
  }

  return (
    <Card padding={3} radius={2} border tone="transparent">
      <Grid columns={months.length} gap={2} style={{ alignItems: "end", minHeight: height }}>
        {months.map((m) => {
          const h = Math.max(6, (m.amount / max) * (height - 36))
          return (
            <Stack key={m.key} space={2} style={{ alignItems: "center" }}>
              <Text size={0} muted style={{ textAlign: "center" }}>
                {m.amount ? formatAxis(m.amount) : "—"}
              </Text>
              <div
                title={`${m.label}: ${formatMoney(m.amount, currency)}`}
                style={{
                  width: "100%",
                  maxWidth: 48,
                  height: h,
                  borderRadius: 6,
                  background:
                    m.amount > 0
                      ? "linear-gradient(180deg, rgb(52, 150, 100), rgb(34, 120, 80))"
                      : "rgba(0,0,0,0.06)",
                  margin: "0 auto",
                }}
              />
              <Text size={0} style={{ textAlign: "center" }}>
                {m.label}
              </Text>
            </Stack>
          )
        })}
      </Grid>
    </Card>
  )
}

function formatAxis(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`
  return String(Math.round(value))
}
