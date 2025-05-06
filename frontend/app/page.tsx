"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import RiverAnimation from "@/components/river-animation"
import SilhouetteAnimation from "@/components/silhouette-animation"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [showTitle, setShowTitle] = useState(false)
  const [showName, setShowName] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showPossibilities, setShowPossibilities] = useState(false)

  useEffect(() => {
    // Start the animation sequence
    const titleTimer = setTimeout(() => setShowTitle(true), 1000)
    const nameTimer = setTimeout(() => setShowName(true), 2500)
    const aboutTimer = setTimeout(() => setShowAbout(true), 4500)
    const possibilitiesTimer = setTimeout(() => setShowPossibilities(true), 7000)

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(nameTimer)
      clearTimeout(aboutTimer)
      clearTimeout(possibilitiesTimer)
    }
  }, [])

  const startConversation = () => {
    router.push("/conversation")
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background with image, river and silhouette animations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/background-city.png')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-amber-900/10"></div>
        <RiverAnimation />
        <SilhouetteAnimation />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-12 px-4">
        <div className="space-y-4">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white font-gothic-heading drop-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: showTitle ? 1 : 0, y: showTitle ? 0 : -50 }}
            transition={{ duration: 2 }}
          >
            Hallo, ich bin
          </motion.h2>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white font-gothic-heading drop-shadow-lg"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: showName ? 1 : 0, y: showName ? 0 : -30 }}
            transition={{ duration: 2 }}
          >
            Anneließe Spieß
          </motion.h1>
        </div>

        {showAbout && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white font-gothic-heading drop-shadow-lg">Zu mir</h2>
            <p className="text-lg md:text-xl text-white font-gothic-text drop-shadow-md">
              Ich wurde 1902 geboren und habe die Französische Belagerung in meinem Tagebuch festgehalten
            </p>
          </motion.div>
        )}

        {showPossibilities && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
          >
            <p className="text-lg md:text-xl text-white font-gothic-text drop-shadow-md">
              Rede mit mir über meine Erfahrungen!
            </p>
          </motion.div>
        )}

        {showPossibilities && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1.2 }}
            className="mt-12"
          >
            <button
              onClick={startConversation}
              className="text-lg px-6 py-3 rounded-full text-white font-gothic-text inline-flex items-center bg-black border-2 border-yellow-500 shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <span>Conversation starten</span>
              <span className="ml-2 overflow-hidden w-0 group-hover:w-12 transition-all duration-300 flex">
                <ArrowRight className="h-5 w-5 animate-wiggle opacity-0 group-hover:opacity-100" />
                <ArrowRight className="h-5 w-5 animate-wiggle-delayed ml-1 opacity-0 group-hover:opacity-100" />
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
