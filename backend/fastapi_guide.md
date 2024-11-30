## **Why Use FastAPI Instead of Flask?**

The **default Flask server** is  **single-threaded** . This means it can only  **process one request at a time.** This means that it is not suitable for our public engagement session. I have still saved the files in the backend folder just for trial and testing purposes only.

## **main.py: Basic Example**

```python
from fastapi import FastAPI, HTTPException, Request

# initialize
app = FastAPI()

# example function
def process_text(text: str) -> str:
    if "hello" in text.lower():
        return "Hi there! 👋"
    else:
        return "I don't recognize that."

# accept json without pydantic?  am checking whether this works
@app.post("/analyze/")
async def analyze_text(request: Request):
    try:
        body = await request.json()  # Parse the JSON body
        text = body.get("text", "")
        response = process_text(text)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# run server with uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 (where workers creates 4 parallel worker processes. Each worker can handle multiple requests)
```

---

## **How FastAPI Handles Multiple Requests**

- **Async and await -** FastAPI uses **non-blocking I/O**meaning it doesnt stop other requests while waiting (e.g., for an API response).
- **Multiple Workers -** Uvicorn (the server) can create multiple **worker processes which** allowis the server to handle more requests at once.

## **How to Run FastAPI on Windows**

1. **Navigate to your project folder:**

   ```bash
   cd path\to\your\project
   ```
2. **Run the server:**

   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4 --reload
   ```

   - **`--workers 4`**: Creates 4 worker processes to handle requests.
   - **`--reload`**: Automatically reloads the server when code changes.

## **How to Test the API** 

### **Using `curl` in Command Prompt or PowerShell:**

```bash
curl.exe -X POST http://127.0.0.1:8000/analyze/ -H "Content-Type: application/json" -d "{\"text\": \"Hello FastAPI!\"}"
```

### **Using PowerShell:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/analyze/" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"text": "Hello FastAPI!"}'
```

---
