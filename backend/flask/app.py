from flask import Flask, request, jsonify
from flask_cors import CORS  

app = Flask(__name__)
#When your Vite.js frontend (running on, say, http://localhost:3000) tries to call your Flask backend (running on http://localhost:5000) the browser blocks the request by default considering it a cross-origin request (because the frontend and backend are on different ports or domains).
#To fix this, you need to add the CORS middleware to your Flask app.
CORS(app)

#Define the API endpoint and the method to handle the request
@app.route('/api/predict', methods=['POST'])
def predict():
    #Sample function for prediction
    data = request.json  
    input_value = data.get('input', None)
    prediction = f"Predicted output for input: {input_value}"
    return jsonify({'prediction': prediction})

#Run the Flask app
#To run the backend simply write python app.py in the terminal
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
