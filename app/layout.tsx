import { ClientAuthProvider } from "@/components/client-auth-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
export const revalidate = 3600;
export const metadata: Metadata = {
  title: "4SalesAI - AI-Powered Sales Assistant",
  description: "Transform your sales process with AI-powered conversations",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientAuthProvider>{children}</ClientAuthProvider>
      </body>
    </html>
  )
}
