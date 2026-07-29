export const metadata = {
  title: "Emilie Admin",
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: "100vh", margin: 0, padding: 0, overflow: "auto" }}>
      {children}
    </div>
  )
}
