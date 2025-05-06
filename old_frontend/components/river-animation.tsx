"use client"

import { useEffect, useRef } from "react"

const RiverAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // River parameters - positioned to match the image
    const riverY = canvas.height * 0.65
    const riverHeight = canvas.height * 0.2
    const riverWidth = canvas.width

    // River particles
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      baseSpeed: number
      color: string
    }[] = []

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: riverY + Math.random() * riverHeight,
        size: Math.random() * 2 + 0.5, // Smaller particles
        speed: Math.random() * 0.3 + 0.1, // Much slower base speed
        baseSpeed: Math.random() * 0.3 + 0.1,
        color: `rgba(255, 215, 140, ${0.1 + Math.random() * 0.2})`, // Golden color to match the image
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Calculate distance from mouse to particle
        const dx = mousePos.current.x - particle.x
        const dy = mousePos.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Increase speed if mouse is close, but keep it subtle
        if (distance < 150) {
          const speedIncrease = (1 - distance / 150) * 0.8
          particle.speed = particle.baseSpeed + speedIncrease
        } else {
          particle.speed = particle.baseSpeed
        }

        // Move particle
        particle.x += particle.speed

        // Reset particle if it goes off screen
        if (particle.x > canvas.width) {
          particle.x = 0
          particle.y = riverY + Math.random() * riverHeight
        }

        // Draw particle
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-1" style={{ pointerEvents: "none" }} />
}

export default RiverAnimation
