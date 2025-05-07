"use client"

import ChatInterface from "@/components/chat-interface"
import { useEffect, useRef } from 'react'

export default function ChatSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const options = {
      root: null, // use the viewport as the root
      rootMargin: '0px',
      threshold: 0.5, // trigger when 50% of the element is visible
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Play the video when it's in view
          videoRef.current?.play()
        } else {
          // Pause when out of view
          videoRef.current?.pause()
        }
      })
    }, options)

    // Start observing the video element
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    // Clean up observer on component unmount
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

  return (
    <section
      id="chat-section"
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#FF7D7D", border: "1px solid #000" }}
    >
      <div className="container mx-auto px-4 h-full flex items-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pb-8 h-[625px]">
          {/* Left side - Video */}
          <div className="flex items-end justify-start p-0 m-0">
            <div className="relative w-full max-w-md h-[500px] p-0 m-0">
              <video
                ref={videoRef}
                className="absolute bottom-0 left-0 w-full h-full object-cover rounded-lg scale-125 origin-bottom-left"
                style={{ margin: 0, padding: 0 }}
                loop
                muted
                playsInline
                // Remove autoPlay as we'll control this with the observer
              >
                <source src="https://storage.googleapis.com/zeitzeuge-bucket/video/chat_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right side - Chat Interface */}
          <div className="flex flex-col h-[500px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </section>
  )
}
