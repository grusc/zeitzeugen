"use client"

import { useEffect } from "react"

export default function HeroSection() {
  useEffect(() => {
    // Set a timeout to scroll to the chat section after 20 seconds
    const scrollTimeout = setTimeout(() => {
      const chatSection = document.getElementById("chat-section")
      if (chatSection) {
        chatSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 20000) // 20 seconds

    // Clean up the timeout when component unmounts
    return () => clearTimeout(scrollTimeout)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: "#FF7D7D" }}>
      {/* Empty container for potential future content */}
      <div className="relative z-10 container mx-auto px-4 h-full">{/* Intentionally empty as requested */}</div>
    </section>
  )
}
