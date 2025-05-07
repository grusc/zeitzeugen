import os
import uuid
from io import BytesIO

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools import VertexAiSearchTool
from google.cloud import texttospeech
from google.cloud.dialogflowcx_v3.services.agents import AgentsClient
from google.cloud.dialogflowcx_v3.services.sessions import SessionsClient
from google.cloud.dialogflowcx_v3.types import session
from google.genai import types
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

# Replace with your actual Vertex AI Search Datastore ID
# Format: projects/<PROJECT_ID>/locations/<LOCATION>/collections/default_collection/dataStores/<DATASTORE_ID>
# e.g., "projects/12345/locations/us-central1/collections/default_collection/dataStores/my-datastore-123"
PROJECT_ID = "ai-media25mun-309"
LOCATION_ID = "europe-west3"
AGENT_ID = "15a3a9f3-c264-448e-b39c-a97caec035ad"
AGENT = f"projects/{PROJECT_ID}/locations/{LOCATION_ID}/agents/{AGENT_ID}"
LANGUAGE_CODE = "de"
YOUR_DATASTORE_ID = f"projects/{PROJECT_ID}/locations/eu/collections/default_collection/dataStores/zeitzeuge-new-store_1746602941304"
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "TRUE"
os.environ["GOOGLE_CLOUD_PROJECT"] = PROJECT_ID
os.environ["GOOGLE_CLOUD_LOCATION"] = "europe-west1"
# Constants
APP_NAME_VSEARCH = "vertex_search_app"
USER_ID_VSEARCH = "user_vsearch_1"
SESSION_ID_VSEARCH = "session_vsearch_1"
AGENT_NAME_VSEARCH = "doc_qa_agent"
GEMINI_2_FLASH = "gemini-2.0-flash"

# Tool Instantiation
# You MUST provide your datastore ID here.
vertex_search_tool = VertexAiSearchTool(data_store_id=YOUR_DATASTORE_ID)

# Agent Definition
doc_qa_agent = LlmAgent(
    name=AGENT_NAME_VSEARCH,
    model=GEMINI_2_FLASH,  # Requires Gemini model
    tools=[vertex_search_tool],
    #    instruction=f"""You are a helpful assistant that answers questions based on information found in the document store: {YOUR_DATASTORE_ID}.
    #    Use the search tool to find relevant information before answering.
    #    If the answer isn't in the documents, say that you couldn't find the information.
    #    """,
    instruction=f"""Beantworte die Fragen des Nutzers basierend auf den Tagebucheinträgen, die im Datastore {YOUR_DATASTORE_ID} vorhanden sind. Sie haben immer ein Datum vor dem jeweiligen Eintrag. Du solltest in der Lage sein, wenn der Nutzer zu einem bestimmten Tag fragt dazu antworten zu können. Antworte aus der Ich-Perspektive der Autorin Spieß, Anneliese.
 
Hier sind einige Informationen zu ihr:
Die Autorin wurde während der Besetzung des Rheinlandes in den Jahren 1918/19 durch die Franzosen, als Dolmetscherin in ihrem Heimatdorf eingesetzt. Sie beschreibt in ihrem Tagebuch das Zusammenleben mit den Franzosen aus einem sehr kritischen Blickwinkel. Themen sind die Einquartierungen, die Beschlagnahmen und Umfunktion öffentlicher Gebäude sowie die Kontrolle der Postsendungen. Die Autorin und ihr Vater stören sich am überzogenen Selbstbewusstsein der Franzosen als Sieger, besonders an ihrem Benehmen und ihren Forderungen. Die Autorin lernt aber auch hilfsbereite und freundliche Franzosen kennen.

Bitte antworte so als wärst du in einem persönlichen intimen Gespräch! Stelle sicher, dass du dich mit altdeutschen Begriffen ausdrückst.
    """,
    description="Answers questions using a specific Vertex AI Search datastore.",
)

# Session and Runner Setup
session_service_vsearch = InMemorySessionService()
runner_vsearch = Runner(
    agent=doc_qa_agent,
    app_name=APP_NAME_VSEARCH,
    session_service=session_service_vsearch,
)
session_vsearch = session_service_vsearch.create_session(
    app_name=APP_NAME_VSEARCH, user_id=USER_ID_VSEARCH, session_id=SESSION_ID_VSEARCH
)


# Agent Interaction Function
async def call_vsearch_agent_async(query):
    print("\n--- Running Vertex AI Search Agent ---")
    print(f"Query: {query}")
    if "YOUR_DATASTORE_ID_HERE" in YOUR_DATASTORE_ID:
        print(
            "Skipping execution: Please replace YOUR_DATASTORE_ID_HERE with your actual datastore ID."
        )
        print("-" * 30)
        return

    content = types.Content(role="user", parts=[types.Part(text=query)])
    final_response_text = "No response received."
    try:
        async for event in runner_vsearch.run_async(
            user_id=USER_ID_VSEARCH, session_id=SESSION_ID_VSEARCH, new_message=content
        ):
            # Like Google Search, results are often embedded in the model's response.
            if event.is_final_response() and event.content and event.content.parts:
                final_response_text = event.content.parts[0].text.strip()
                print(f"Agent Response: {final_response_text}")
                # You can inspect event.grounding_metadata for source citations
                if event.grounding_metadata:
                    for source in event.grounding_metadata.grounding_chunks or []:
                        print(f"Source: {source}")
                        print(">>>")
                return final_response_text

    except Exception as e:
        print(f"An error occurred: {e}")
        print(
            "Ensure your datastore ID is correct and the service account has permissions."
        )
    print("-" * 30)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specific origins
    allow_credentials=True,  # Allows cookies and auth headers
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)


class IntentRequest(BaseModel):
    session_id: str
    text: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/detect_intent")
def detect_intent(intent_request: IntentRequest) -> str | None:
    return detect_intent_texts(
        AGENT, intent_request.session_id, [intent_request.text], LANGUAGE_CODE
    )


@app.post("/agent")
async def agent(intent_request: IntentRequest) -> str | None:
    return await call_vsearch_agent_async(intent_request.text)


@app.post("/agent-voice")
async def agent_voice(intent_request: IntentRequest) -> StreamingResponse:
    result = await call_vsearch_agent_async(intent_request.text)
    print(f"Result: {result}")

    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=result)

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.VoiceSelectionParams(
        language_code="de-DE",
        name="de-DE-Chirp3-HD-Leda",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    def file_iter():
        nonlocal response
        with BytesIO() as f:
            f.write(response.audio_content)
            f.seek(0)
            yield from f

    return StreamingResponse(file_iter(), media_type="audio/mpeg")


def run_sample():
    session_id = uuid.uuid4()
    texts = ["Hello"]
    # For more supported languages see https://cloud.google.com/dialogflow/es/docs/reference/language

    detect_intent_texts(AGENT, session_id, texts, LANGUAGE_CODE)


def detect_intent_texts(agent, session_id, texts, language_code) -> str | None:
    """Returns the result of detect intent with texts as inputs.

    Using the same `session_id` between requests allows continuation
    of the conversation."""
    session_path = f"{agent}/sessions/{session_id}"
    print(f"Session path: {session_path}\n")
    client_options = None
    agent_components = AgentsClient.parse_agent_path(agent)
    location_id = agent_components["location"]
    if location_id != "global":
        api_endpoint = f"{location_id}-dialogflow.googleapis.com:443"
        print(f"API Endpoint: {api_endpoint}\n")
        client_options = {"api_endpoint": api_endpoint}
    session_client = SessionsClient(client_options=client_options)

    response_messages = None

    for text in texts:
        text_input = session.TextInput(text=text)
        query_input = session.QueryInput(text=text_input, language_code=language_code)
        request = session.DetectIntentRequest(
            session=session_path, query_input=query_input
        )
        response = session_client.detect_intent(request=request)

        print("=" * 20)
        print(f"Query text: {response.query_result.text}")
        response_messages = [
            " ".join(msg.text.text) for msg in response.query_result.response_messages
        ]
        print(f"Response text: {' '.join(response_messages)}\n")
    return response_messages[0] if response_messages else None
