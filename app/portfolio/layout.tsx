import type React from "react"
import "./portfolio.css"

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      {children}
    </>
  )
}
