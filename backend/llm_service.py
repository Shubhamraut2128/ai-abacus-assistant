import requests

def get_llm_response(problem, steps):
    prompt = f"""
    Solve this abacus problem step by step:
    {problem}

    Steps:
    {steps}

    Explain in simple student-friendly way.
    """

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]