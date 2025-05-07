import ChatInterface from "@/components/chat-interface"

export default function ChatSection() {
  return (
    <section
      id="chat-section"
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#FF7D7D" }}
    >
      <div className="container mx-auto px-4 h-full flex items-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pb-8 h-[625px]">
          {/* Left side - Video */}
          <div className="flex items-end justify-start p-0 m-0">
            <div className="relative w-full max-w-md h-[500px] p-0 m-0">
              <video
                className="absolute bottom-0 left-0 w-full h-full object-cover rounded-lg scale-125 origin-bottom-left"
                style={{ margin: 0, padding: 0 }}
                autoPlay
                loop
                muted
                playsInline
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
