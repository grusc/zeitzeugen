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
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/videos/your-background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Optional overlay to adjust video brightness/contrast */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 h-full">{/* Intentionally empty as requested */}</div>
    </section>
  )
}
