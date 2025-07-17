import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DSA Visualizer Pro - Interactive Algorithm Learning Platform",
  description:
    "Master data structures and algorithms through interactive visualizations. Complete learning platform with sorting, searching, trees, graphs, and more.",
  keywords: "algorithms, data structures, visualization, learning, education, programming, computer science",
  authors: [{ name: "DSA Visualizer Pro" }],
  openGraph: {
    title: "DSA Visualizer Pro - Interactive Algorithm Learning",
    description: "Transform abstract algorithm logic into dynamic, real-time visual representations",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
