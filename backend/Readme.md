# Zeitzeugen Backend

This is the backend service for the Zeitzeugen project, built with FastAPI, Google Dialogflow, and Google AI services.

## Features

- Dialogflow integration for intent detection
- Vertex AI Search integration for knowledge base searches
- Text-to-speech functionality via Google Cloud TTS
- RESTful API endpoints for frontend integration

## Requirements

- Python 3.8+
- Google Cloud account with appropriate credentials
- Docker (for containerized deployment)

## API Endpoints

- `POST /detect_intent`: Detect user intent from text input
- `POST /agent`: Process a query through the Dialogflow agent
- `POST /agent-voice`: Generate speech output from agent responses

## Local Development

1. Install dependencies: