import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Emily's Job Board",
  description: 'Daily curated roles for Emily — NYC startups, no coding tests.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
