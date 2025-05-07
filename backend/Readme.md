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

```
pip install -r requirements.txt
```

2. Set up Google Cloud credentials:

```
gcloud auth application-default login
```


## Docker Deployment
1. Build the Docker image:

```
docker build -t zeitzeugen-fastapi:latest .
```

2. Run the application:
```
docker run -p 80:42069 -e GOOGLE_APPLICATION_CREDENTIALS="/app/.config/gcloud/application_default_credentials.json" --mount type=bind,source=${HOME}/.config/gcloud,target=/app/.config/gcloud zeitzeugen-fastapi:latest
```

This command:
- Maps host port 80 to container port 42069
- Sets the environment variable for Google credentials
- Mounts your local Google credentials to the container
- Uses the zeitzeugen-fastapi image

## Environment Variables

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud credentials
- `GOOGLE_CLOUD_PROJECT`: Google Cloud project ID
- `GOOGLE_CLOUD_LOCATION`: Google Cloud location

## Notes

- Make sure your Google Cloud account has the necessary permissions for Dialogflow CX, Vertex AI, and Text-to-Speech services
- For production deployments, consider setting up proper authentication and HTTPS