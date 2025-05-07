"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, RefreshCw, Star, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type AudioMessage = {
  src: string
  duration: number
}

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  options?: { id: number; text: string }[]
  audio?: AudioMessage
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hallo! Ich bin Anneliese und habe meine Erlebnisse in Tagebüchern während der französischen Belagerung festgehalten. Unterhalten wir uns!",
      sender: "assistant",
      audio: {
        src: "/audio/anneliese-intro.mp3",
        duration: 8,
      },
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({})
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const chatSection = document.getElementById("chat-section")
      if (chatSection) {
        const rect = chatSection.getBoundingClientRect()
        // Show header when chat section is in view
        setIsHeaderVisible(rect.top <= 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Play audio when a new message with audio is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.audio && !isMuted && lastMessage.sender === "assistant") {
      const audioElement = audioRefs.current[lastMessage.id]
      if (audioElement) {
        setCurrentlyPlaying(lastMessage.id)
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
    }
  }, [messages, isMuted])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)

    // If unmuting and there's a currently playing audio, restart it
    if (isMuted && currentlyPlaying) {
      const audioElement = audioRefs.current[currentlyPlaying]
      if (audioElement) {
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
    }

    // If muting, pause all audio
    if (!isMuted) {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) audio.pause()
      })
      setCurrentlyPlaying(null)
    }
  }

  const handleAudioEnded = (messageId: string) => {
    if (currentlyPlaying === messageId) {
      setCurrentlyPlaying(null)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:80/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add audio to specific responses
      let audio: AudioMessage | undefined

      if (
        inputValue.toLowerCase().includes("belagerung") ||
        inputValue.toLowerCase().includes("französisch") ||
        inputValue.toLowerCase().includes("erlebnisse") ||
        inputValue.toLowerCase().includes("tagebuch")
      ) {
        audio = {
          src: "/audio/french-siege.mp3",
          duration: 10,
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        sender: "assistant",
        options: data.options,
        audio,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es erneut.",
        sender: "assistant",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionClick = (optionText: string) => {
    setInputValue(optionText)
    handleSendMessage()
  }

  const handleRecommendedQuestionClick = (question: string) => {
    setInputValue(question)
    handleSendMessage()
  }

  // Recommended questions
  const recommendedQuestions = ["Wieviele Sprachen sprichst du?", "Was sind deine Hobbies?"]

  return (
    <div className="w-full h-full bg-[#FF7D7D] rounded-t-xl overflow-hidden flex flex-col">
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div
          className={`fixed top-0 left-0 right-0 bg-zinc-800 text-white p-4 flex items-center justify-between z-50 transition-transform duration-300 ${
            isHeaderVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 overflow-hidden border border-white/20">
                <AvatarImage
                  src="/images/anneliese-spiess.png"
                  alt="Anneliese Spieß"
                  className="object-cover object-center"
                  style={{ objectPosition: "center 30%" }}
                />
                <AvatarFallback className="bg-zinc-700">AS</AvatarFallback>
              </Avatar>
              <span className="font-medium">Anneliese Spieß</span>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isMuted ? "Ton einschalten" : "Ton ausschalten"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white"
                      onClick={() => {
                        setMessages([
                          {
                            id: "1",
                            content:
                              "Hallo! Ich bin Anneliese und habe meine Erlebnisse in Tagebüchern während der französischen Belagerung festgehalten. Unterhalten wir uns!",
                            sender: "assistant",
                            audio: {
                              src: "/audio/anneliese-intro.mp3",
                              duration: 8,
                            },
                          },
                        ])
                        setCurrentlyPlaying(null)
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Gespräch neu starten</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Regular header spacer when fixed header is visible */}
        <div
          className={`bg-zinc-800 text-white p-4 flex items-center justify-between ${isHeaderVisible ? "opacity-0" : ""}`}
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8"></div>
            <span className="font-medium invisible">Anneliese Spieß</span>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8"></div>
            <div className="h-8 w-8"></div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[500%] overflow-y-auto p-4 space-y-4 -mt-32 pt-24" id="chat-section">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} gap-2`}
            >
              {message.sender === "assistant" && (
                <div className="flex items-start mt-1">
                  <Avatar className="h-8 w-8 overflow-hidden border border-white/20">
                    <AvatarImage
                      src="/images/anneliese-spiess.png"
                      alt="Anneliese Spieß"
                      className="object-cover object-center"
                      style={{ objectPosition: "center 30%" }}
                    />
                    <AvatarFallback className="bg-white">
                      <span className="text-[#FF7D7D]">AS</span>
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}

              <div className={`max-w-[80%] ${message.sender === "user" ? "order-1" : "order-2"}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-zinc-800 text-white rounded-tr-none"
                      : "bg-white text-zinc-800 rounded-tl-none"
                  }`}
                >
                  {message.content}

                  {message.audio && (
                    <audio
                      ref={(el) => (audioRefs.current[message.id] = el)}
                      src={message.audio.src}
                      onEnded={() => handleAudioEnded(message.id)}
                      hidden
                    />
                  )}
                </div>

                {message.options && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="secondary"
                        className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-full text-sm"
                        onClick={() => handleOptionClick(option.text)}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-2">
              <div className="flex items-start mt-1">
                <Avatar className="h-8 w-8 overflow-hidden border border-white/20">
                  <AvatarImage
                    src="/images/anneliese-spiess.png"
                    alt="Anneliese Spieß"
                    className="object-cover object-center"
                    style={{ objectPosition: "center 30%" }}
                  />
                  <AvatarFallback className="bg-white">
                    <span className="text-[#FF7D7D]">AS</span>
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Rating */}
        <div className="px-4 py-2 flex justify-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 text-white opacity-50 hover:opacity-100 cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-[#FF7D7D]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              placeholder="Frag mich etwas..."
              className="w-full bg-white/90 rounded-full py-3 px-4 pr-20 focus:outline-none text-[#2E2E2E]"
              autoFocus
            />

            <div className="absolute right-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-600"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-600">
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Questions */}
        <div className="px-4 pt-1 pb-3 flex flex-wrap gap-2 justify-center">
          {recommendedQuestions.map((question, index) => (
            <button
              key={index}
              className="bg-white/30 hover:bg-white/40 text-zinc-800 px-3 py-1.5 rounded-full text-sm transition-colors"
              onClick={() => handleRecommendedQuestionClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
