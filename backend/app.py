from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

try:
    # Direct relative paths - files are in same directory as app.py
    with open('model.pkl', 'rb') as f: 
        model = pickle.load(f)

    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)

    with open('features.pkl', 'rb') as f:
        feature_names = pickle.load(f)

    print("Model loaded successfully!")
    print(f"Features expected: {feature_names}")

except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    scaler = None
    feature_names = []

# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------
@app.route('/')
def home():
    return jsonify({
        'message': 'Cardiovascular Disease Prediction API',
        'status': 'running',
        'endpoints': {
            '/predict': 'POST - Get prediction with patient data',
            '/health': 'GET - API health check',
            '/features': 'GET - Expected input features'
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None:
            return jsonify({'error': 'Model not loaded'}), 500  # FIXED: removed extra parenthesis

        data = request.get_json()

        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Extract features in correct order
        features = []
        for feature in feature_names:
            if feature in data:
                features.append(float(data[feature]))
            else:
                if feature == 'age_years':
                    if 'age' in data:
                        features.append(float(data['age']))
                    else:
                        features.append(50.0)
                elif feature == 'bmi':
                    if 'height' in data and 'weight' in data:
                        height_m = float(data['height']) / 100
                        features.append(float(data['weight']) / (height_m ** 2))
                    else:
                        features.append(25.0)
                else:
                    features.append(0.0)

        features_array = np.array(features).reshape(1, -1)
        features_scaled = scaler.transform(features_array)

        probability = model.predict_proba(features_scaled)[0][1]

        risk_category = get_risk_category(probability)
        recommendations = get_recommendations(data, probability)

        return jsonify({
            'success': True,
            'probability': round(probability * 100, 2),
            'risk_category': risk_category,
            'prediction': 'High Risk' if probability > 0.5 else 'Low Risk',
            'recommendations': recommendations,
            'features_used': feature_names,
            'features_values': dict(zip(feature_names, features))
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

# ------------------------------------------------------------------
# Helper functions (COMPLETE THESE)
# ------------------------------------------------------------------
def get_risk_category(probability):
    if probability < 0.3:
        return "Low Risk"
    elif probability < 0.6:
        return "Moderate Risk"
    elif probability < 0.8:
        return "High Risk"
    else:
        return "Very High Risk"

def get_recommendations(data, probability):
    recommendations = []

    if 'cholesterol' in data:
        if data['cholesterol'] > 2:
            recommendations.append(
                "High cholesterol detected. Consider dietary changes and exercise."
            )
        elif data['cholesterol'] == 2:
            recommendations.append(
                "Moderate cholesterol level. Regular monitoring recommended."
            )

    if 'ap_hi' in data and 'ap_lo' in data:
        if data['ap_hi'] > 140 or data['ap_lo'] > 90:
            recommendations.append(
                "Elevated blood pressure. Consult with a healthcare provider."
            )

    if data.get('smoke') == 1:
        recommendations.append(
            "Smoking increases cardiovascular risk. Consider quitting."
        )

    if data.get('alco') == 1:
        recommendations.append(
            "Limit alcohol consumption to reduce cardiovascular risk."
        )

    if data.get('active') == 0:
        recommendations.append(
            "Include regular physical activity (30 minutes daily)."
        )

    if 'bmi' in data or ('height' in data and 'weight' in data):
        if 'bmi' in data:
            bmi = data['bmi']
        else:
            height_m = data['height'] / 100
            bmi = data['weight'] / (height_m ** 2)

        if bmi > 25:
            recommendations.append(
                f"BMI is {bmi:.1f}. Aim for a healthy weight."
            )

    if probability > 0.6:
        recommendations.append(
            "High risk detected. Please consult a cardiologist."
        )
    elif probability > 0.3:
        recommendations.append(
            "Moderate risk. Regular health check-ups advised."
        )

    if not recommendations:
        recommendations.append(
            "Maintain a healthy lifestyle with balanced diet and exercise."
        )

    return recommendations

@app.route('/features', methods=['GET'])
def get_features():
    feature_descriptions = {
        'gender': '1: female, 2: male',
        'height': 'Height in cm',
        'weight': 'Weight in kg',
        'ap_hi': 'Systolic BP',
        'ap_lo': 'Diastolic BP',
        'cholesterol': '1 normal, 2 above normal, 3 high',
        'gluc': '1 normal, 2 above normal, 3 high',
        'smoke': '0 no, 1 yes',
        'alco': '0 no, 1 yes',
        'active': '0 no, 1 yes',
        'age': 'Age in years',
        'age_years': 'Age in years (auto)',
        'bmi': 'Body Mass Index'
    }

    return jsonify({
        'features': feature_names,
        'descriptions': feature_descriptions,
        'example_input': {
            'gender': 2,
            'height': 170,
            'weight': 70,
            'ap_hi': 120,
            'ap_lo': 80,
            'cholesterol': 1,
            'gluc': 1,
            'smoke': 0,
            'alco': 0,
            'active': 1,
            'age': 50
        }
    })

# ------------------------------------------------------------------
# Local run (Render uses Gunicorn, this is safe)
# ------------------------------------------------------------------
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
