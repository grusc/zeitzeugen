import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simulate a delay to mimic API processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // German responses based on different message inputs
    let response = ""

    if (message.toLowerCase().includes("hallo") || message.toLowerCase().includes("hi")) {
      response = "Hallo! Schön, dass du dich für meine Geschichte interessierst. Wie kann ich dir helfen?"
    } else if (message.toLowerCase().includes("name")) {
      response =
        "Ich bin Anneliese Spieß. Ich habe während der französischen Belagerung gelebt und meine Erlebnisse in Tagebüchern festgehalten."
    } else if (message.toLowerCase().includes("zeug") || message.toLowerCase().includes("zeit")) {
      response =
        "ZEITZEUGEN sammelt Zeugnisse und Berichte von Menschen, die historische Ereignisse miterlebt haben. Ich bin eine dieser Zeitzeuginnen."
    } else if (message.toLowerCase().includes("hobbies") || message.toLowerCase().includes("hobby")) {
      response =
        "In meiner Zeit waren Hobbys, wie ihr sie heute kennt, etwas anders. Ich habe viel gelesen, Tagebuch geschrieben, und mich mit Handarbeiten beschäftigt. Das Schreiben war für mich besonders wichtig, um die Ereignisse zu verarbeiten."
    } else if (
      message.toLowerCase().includes("belagerung") ||
      message.toLowerCase().includes("französ") ||
      message.toLowerCase().includes("erlebnisse") ||
      message.toLowerCase().includes("tagebuch")
    ) {
      response =
        "Die französische Belagerung war eine sehr schwere Zeit. Wir hatten kaum Nahrung, und die Angst war allgegenwärtig. In meinen Tagebüchern habe ich festgehalten, wie wir uns gegenseitig geholfen haben, um zu überleben. Trotz der Not gab es auch Momente der Menschlichkeit und Solidarität."
    } else if (message.toLowerCase().includes("geschichte") || message.toLowerCase().includes("historisch")) {
      response =
        "Die Geschichte ist mehr als nur Daten und Fakten. Es sind die persönlichen Erlebnisse, die uns wirklich verstehen lassen, wie es damals war. Welche historische Periode interessiert dich besonders?"
      // Add buttons for different time periods
      return NextResponse.json({
        text: response,
        options: [
          { id: 1, text: "1800-1850" },
          { id: 2, text: "1850-1900" },
          { id: 3, text: "1900-1950" },
        ],
      })
    } else if (message.toLowerCase().includes("schule") || message.toLowerCase().includes("klasse")) {
      response =
        "Die Bildung war damals ganz anders als heute. Nicht alle Kinder konnten zur Schule gehen, besonders Mädchen hatten es schwer. Ich hatte das Glück, lesen und schreiben zu lernen, was mir später half, meine Tagebücher zu führen."
    } else if (message.toLowerCase().includes("upload") || message.toLowerCase().includes("hochladen")) {
      response = "Du möchtest historische Dokumente teilen? Das ist wunderbar! Was für Materialien hast du?"
      // Add buttons for different upload types
      return NextResponse.json({
        text: response,
        options: [
          { id: 1, text: "Fotos" },
          { id: 2, text: "Dokumente" },
          { id: 3, text: "Briefe" },
          { id: 4, text: "Tagebücher" },
        ],
      })
    } else if (message.toLowerCase().includes("danke") || message.toLowerCase().includes("dank")) {
      response =
        "Gerne! Es ist mir wichtig, dass diese Geschichten nicht vergessen werden. Wenn du weitere Fragen hast, bin ich hier."
    } else {
      response =
        "Danke für deine Nachricht. Als Zeitzeugin der französischen Belagerung kann ich dir von meinen persönlichen Erlebnissen berichten. Möchtest du etwas Bestimmtes über diese Zeit erfahren?"
    }

    return NextResponse.json({ text: response })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Es gab ein Problem bei der Verarbeitung deiner Anfrage." }, { status: 500 })
  }
}
