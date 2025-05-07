import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import ChatSection from "@/components/chat-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ChatSection />
    </main>
  )
}
