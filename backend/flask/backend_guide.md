Here’s a simple **README.md** file to help you and others understand how to use the Flask app you’ve created.

---

# Get Flask Running

1. - **Windows**: `venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`
2. **Run the Flask App**:
   In the terminal, navigate to the folder where `app.py` is located and run:

   ```bash
   python app.py
   ```

   You should see something like:

   ```
   Running on http://0.0.0.0:5000/
   ```

## **How to Use the API**

### **API Endpoint:**

- **URL:** `http://localhost:5000/api/predict`
- **Method:** `POST`
- **Request Body (JSON):**
  ```json
  { "input": "Hello World" }
  ```
- **Response (JSON):**
  ```json
  { "prediction": "Predicted output for input: Hello World" }
  ```

### **Testing the API:**

1. Use either **Postman** or **Curl** - Send a `POST` request to the `/api/predict` endpoint.
2. **Example using Curl (in Terminal):**

   ```bash
   curl -X POST http://localhost:5000/api/predict -H "Content-Type: application/json" -d '{"input": "Hello World"}'
   ```

   You will get this response as the output. (Remember to understand your input)

   ```json
   { "prediction": "Predicted output for input: Hello World" }
   ```

## **How to Add More Endpoints**

If you want to add more functionality (like new functions)

1. Open your `app.py` file.
2. Add a new route. Heres an example

   ```python
   @app.route('/api/echo', methods=['POST'])
   def echo():
       data = request.json
       message = data.get('message', None)
       return jsonify({'echo': message})
   ```

## **Stopping the Flask App**

- Press **Ctrl + C** in the terminal where the Flask app is running to stop it.
