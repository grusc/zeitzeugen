"use client"

import { useEffect, useRef } from "react"

const SilhouetteAnimation = () => {
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

    // Silhouette position - right side of the screen
    const silhouetteX = canvas.width * 0.85
    const silhouetteY = canvas.height * 0.65

    // Cloth animation parameters
    const clothPoints: {
      x: number
      y: number
      baseX: number
      baseY: number
      noiseOffsetX: number
      noiseOffsetY: number
    }[] = []

    // Create cloth points along the silhouette's dress
    const clothWidth = canvas.width * 0.03
    const clothHeight = canvas.height * 0.15
    const pointsCount = 15

    for (let i = 0; i < pointsCount; i++) {
      const y = silhouetteY + (i / pointsCount) * clothHeight
      clothPoints.push({
        x: silhouetteX - clothWidth * 0.5,
        y,
        baseX: silhouetteX - clothWidth * 0.5,
        baseY: y,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      })
    }

    // Simple noise function
    const noise = (x: number, y: number) => {
      return Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update cloth points based on mouse position
      clothPoints.forEach((point, index) => {
        const dx = mousePos.current.x - point.x
        const dy = mousePos.current.y - point.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Only animate if mouse is close
        if (distance < 200) {
          // Calculate wave effect based on distance and time
          const time = Date.now() * 0.001
          const waveStrength = (1 - distance / 200) * 5

          // Add noise for more natural movement
          const noiseValue = noise(point.noiseOffsetX + time, point.noiseOffsetY + time)

          // Apply wave effect
          point.x = point.baseX + Math.sin(time * 2 + index * 0.2) * waveStrength + noiseValue * waveStrength * 0.5
        } else {
          // Gradually return to base position
          point.x = point.x * 0.95 + point.baseX * 0.05
        }
      })

      // Draw cloth
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.beginPath()
      ctx.moveTo(clothPoints[0].x, clothPoints[0].y)

      // Draw the left side of the dress with bezier curves for smoothness
      for (let i = 0; i < clothPoints.length - 1; i++) {
        const xc = (clothPoints[i].x + clothPoints[i + 1].x) / 2
        const yc = (clothPoints[i].y + clothPoints[i + 1].y) / 2
        ctx.quadraticCurveTo(clothPoints[i].x, clothPoints[i].y, xc, yc)
      }

      // Complete the path to the last point
      ctx.lineTo(clothPoints[clothPoints.length - 1].x, clothPoints[clothPoints.length - 1].y)

      // Draw the right side of the dress (static)
      ctx.lineTo(silhouetteX + clothWidth * 0.5, silhouetteY + clothHeight)
      ctx.lineTo(silhouetteX + clothWidth * 0.5, silhouetteY)

      ctx.closePath()
      ctx.fill()

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-2" style={{ pointerEvents: "none" }} />
}

export default SilhouetteAnimation
