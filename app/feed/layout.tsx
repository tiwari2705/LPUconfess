import { Navbar } from "@/components/navbar"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

