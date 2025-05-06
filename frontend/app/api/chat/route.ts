import { type NextRequest, NextResponse } from "next/server"

// This is a mock API endpoint that simulates responses from Anneließe
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple response logic based on keywords in the message
    let response = ""
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("tagebuch") || lowerMessage.includes("diary")) {
      response =
        "Mein Tagebuch begann ich im Jahre 1918. Ich schrieb fast täglich über die Ereignisse in unserer Stadt während der Belagerung. Es war eine schwere Zeit für alle."
    } else if (lowerMessage.includes("krieg") || lowerMessage.includes("war")) {
      response =
        "Der Krieg hat unsere Stadt stark verändert. Viele Gebäude wurden zerstört, und wir hatten oft nicht genug zu essen. Die Menschen halfen einander, um zu überleben."
    } else if (lowerMessage.includes("familie") || lowerMessage.includes("family")) {
      response =
        "Meine Familie bestand aus meinen Eltern und zwei jüngeren Brüdern. Mein Vater arbeitete als Bäcker, was uns während der Belagerung half, da wir zumindest etwas Brot hatten."
    } else if (lowerMessage.includes("essen") || lowerMessage.includes("food")) {
      response =
        "Nahrung war sehr knapp während der Belagerung. Wir aßen oft nur eine Mahlzeit am Tag, hauptsächlich Brot und Suppe aus dem, was wir finden konnten. Manchmal tauschten wir mit Nachbarn."
    } else if (lowerMessage.includes("französisch") || lowerMessage.includes("french")) {
      response =
        "Die französischen Soldaten waren streng, aber nicht alle waren grausam. Einige zeigten Mitgefühl, besonders gegenüber Kindern. Ich erinnere mich an einen Offizier, der heimlich Schokolade an die Kinder verteilte."
    } else if (lowerMessage.includes("hallo") || lowerMessage.includes("hi") || lowerMessage.includes("guten tag")) {
      response =
        "Guten Tag! Es freut mich, mit dir zu sprechen. Was möchtest du über meine Erlebnisse während der Belagerung wissen?"
    } else {
      response =
        "Das ist eine interessante Frage. In meinem Tagebuch habe ich viel über das tägliche Leben während der Belagerung geschrieben. Die Menschen waren trotz der schwierigen Umstände sehr einfallsreich und hilfsbereit zueinander."
    }

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Error processing chat:", error)
    return NextResponse.json({ error: "Failed to process your message" }, { status: 500 })
  }
}
