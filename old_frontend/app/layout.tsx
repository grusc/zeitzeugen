import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import localFont from "next/font/local"

// Load custom fonts
const gothicHeadingFont = localFont({
  src: [
    {
      path: "../public/fonts/UnifrakturCook-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gothic-heading",
})

const gothicTextFont = localFont({
  src: [
    {
      path: "../public/fonts/Grenze-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-gothic-text",
})

export const metadata: Metadata = {
  title: "Anneließe Spieß - Interactive Experience",
  description: "An interactive AI experience with Anneließe Spieß from 1902",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${gothicHeadingFont.variable} ${gothicTextFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
