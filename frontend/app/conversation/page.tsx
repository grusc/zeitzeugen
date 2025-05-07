"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
    id: string
    content: string
    sender: "user" | "ai"
    timestamp: Date
}

export default function ConversationPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            content:
                "Hallo! Ich bin Anneließe Spieß. Was möchtest du über meine Erfahrungen während der Französischen Belagerung wissen?",
            sender: "ai",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!input.trim()) return

        // Add user message to chat
        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // Send message to API endpoint
            // In a real implementation, you would replace this with your actual API endpoint
            const response = await fetch("http://127.0.0.1:80/agent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ session_id: "test", text: input }),
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const data = await response.json()

            console.log("API response:", data)
            // Add AI response to chat
            const aiMessage: Message = {
                id: Date.now().toString() + "-ai",
                content:
                    data || "Entschuldigung, ich konnte deine Frage nicht verstehen. Könntest du es anders formulieren?",
                sender: "ai",
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error("Error sending message:", error)

            // Add error message
            const errorMessage: Message = {
                id: Date.now().toString() + "-error",
                content: "Es tut mir leid, aber ich konnte keine Verbindung herstellen. Bitte versuche es später noch einmal.",
                sender: "ai",
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[url('/background-city.png')] bg-cover bg-center">
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Header */}
            <header className="relative z-10 p-4 border-b border-amber-800/30 bg-black/60">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center text-white hover:text-amber-200 transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        <span className="font-gothic-text">Zurück</span>
                    </Link>
                    <h1 className="text-2xl font-gothic-heading text-white">Gespräch mit Anneließe</h1>
                    <div className="w-24"></div> {/* Spacer for centering */}
                </div>
            </header>

            {/* Chat container */}
            <main className="relative z-10 flex-1 p-4 overflow-hidden">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto rounded-lg bg-black/30 p-4 mb-4 backdrop-blur-sm">
                        <div className="space-y-4">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-blue-900/80 text-white" : "bg-amber-800/80 text-white"
                                                }`}
                                        >
                                            <p className="font-gothic-text">{message.content}</p>
                                            <p className="text-xs opacity-70 mt-1 text-right font-gothic-text">
                                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-amber-800/80 text-white rounded-lg p-3">
                                        <div className="flex space-x-2">
                                            <div
                                                className="w-2 h-2 rounded-full bg-white animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 rounded-full bg-white animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 rounded-full bg-white animate-bounce"
                                                style={{ animationDelay: "300ms" }}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input area */}
                    <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex space-x-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Schreibe eine Nachricht..."
                                className="flex-1 bg-black/30 border-amber-800/50 text-white font-gothic-text"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="bg-black border-2 border-yellow-500 hover:bg-black/80"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Privacy information microtext */}
                        <div className="mt-3 text-[8px] text-gray-400 font-gothic-text leading-tight">
                            <p>
                                DATENSCHUTZHINWEIS: Diese Konversation wird zu Zwecken der historischen Forschung und Bildung
                                aufgezeichnet. Alle Daten werden gemäß der DSGVO verarbeitet. Bitte teilen Sie keine persönlichen oder
                                sensiblen Informationen mit. Für weitere Informationen kontaktieren Sie bitte den
                                Datenschutzbeauftragten unter datenschutz@beispiel.de. © 2025 Historisches Archiv Beispielstadt. Alle
                                Rechte vorbehalten.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
