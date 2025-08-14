from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model once when server starts
model_best = load_model('face_model.h5')
class_names = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Sad', 'Surprised', 'Neutral']

# Load face cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    try:
        # Get image data from request
        data = request.json
        if 'image' not in data:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
            
        image_data = data['image']  # Base64 encoded image
        
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(image_data)
            pil_image = Image.open(io.BytesIO(image_bytes))
            frame = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'Invalid image data: {str(e)}'
            }), 400

        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))
        
        results = []
        
        for (x, y, w, h) in faces:
            # Extract face region
            face_roi = frame[y:y + h, x:x + w]
            
            # Preprocess for emotion detection
            face_image = cv2.resize(face_roi, (48, 48))
            face_image = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
            face_image = image.img_to_array(face_image)
            face_image = np.expand_dims(face_image, axis=0)
            face_image = np.vstack([face_image])
            
            # Predict emotions
            predictions = model_best.predict(face_image, verbose=0)
            emotion_probabilities = predictions[0]
            
            # Get top 3 emotions
            top_3_indices = np.argsort(emotion_probabilities)[-3:][::-1]
            top_3_emotions = [
                {
                    'emotion': class_names[i],
                    'confidence': float(emotion_probabilities[i] * 100)
                }
                for i in top_3_indices
            ]
            
            results.append({
                'face_coordinates': {
                    'x': int(x),
                    'y': int(y),
                    'width': int(w),
                    'height': int(h)
                },
                'emotions': top_3_emotions
            })
        
        return jsonify({
            'success': True,
            'faces_detected': len(faces),
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'endpoints': {
            'POST /detect-emotion': 'Analyze emotions in an image',
            'GET /health': 'Check service status'
        }
    })

if __name__ == '__main__':
    print("🤖 Python Emotion Detection Microservice Starting...")
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5001)