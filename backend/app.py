from fastapi import FastAPI
from google.cloud.dialogflowcx_v3.services.agents import AgentsClient
from google.cloud.dialogflowcx_v3.services.sessions import SessionsClient
from starlette.middleware.cors import CORSMiddleware
import uuid
from google.cloud.dialogflowcx_v3.types import session
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specific origins
    allow_credentials=True,  # Allows cookies and auth headers
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

PROJECT_ID = "ai-media25mun-309"
LOCATION_ID = "europe-west3"
AGENT_ID = "15a3a9f3-c264-448e-b39c-a97caec035ad"
AGENT = f"projects/{PROJECT_ID}/locations/{LOCATION_ID}/agents/{AGENT_ID}"
LANGUAGE_CODE = "de"


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
