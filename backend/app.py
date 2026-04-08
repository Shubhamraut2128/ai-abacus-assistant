from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.abacus_solver import solve_abacus
from llm_service import get_llm_response
from voice import speech_to_text

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Request model
class ProblemRequest(BaseModel):
    question: str

@app.get("/")
def home():
    return {"message": "Abacus AI Assistant Running"}

# ✅ FIXED ENDPOINT
@app.post("/solve")
async def solve(req: ProblemRequest):
    problem = req.question

    steps = solve_abacus(problem)
    explanation = get_llm_response(problem, steps)

    return {
        "steps": steps,
        "explanation": explanation
    }

@app.post("/voice")
async def voice(file: UploadFile):
    text = speech_to_text(file)
    return {"text": text}
