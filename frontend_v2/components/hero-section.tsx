"use client"

import { useEffect, useState, useRef } from "react"

export default function HeroSection() {
  const [videoStarted, setVideoStarted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Start playing the video when component mounts
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setVideoStarted(true)
          console.log("Video started playing with audio")
        })
        .catch((error) => {
          console.error("Error playing video:", error)
          // Mark as started even if there's an error to ensure scrolling still happens
          setVideoStarted(true)
        })
    }

    // Set a timeout to scroll to the chat section after 20 seconds
    const scrollTimeout = setTimeout(() => {
      const chatSection = document.getElementById("chat-section")
      if (chatSection) {
        console.log("Auto-scrolling to chat section after 20 seconds")
        chatSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 20000) // 20 seconds

    // Clean up the timeout when component unmounts
    return () => {
      clearTimeout(scrollTimeout)
    }
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
          <source src="https://storage.googleapis.com/zeitzeuge-bucket/video/background.mp4" type="video/mp4" />
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
