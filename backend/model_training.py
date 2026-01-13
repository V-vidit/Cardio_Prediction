import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import pickle
import warnings
warnings.filterwarnings('ignore')

def load_and_preprocess_data(filepath='cardio_train.csv'):
    """Load and preprocess the dataset"""
    # Load data
    df = pd.read_csv(filepath, sep=';')
    print(f"Dataset shape: {df.shape}")
    print(f"First 5 rows:\n{df.head()}")
    
    # Basic info
    print(f"\nColumns: {df.columns.tolist()}")
    print(f"Missing values:\n{df.isnull().sum()}")
    
    # Handle outliers in blood pressure (common in medical data)
    # Normal systolic: 90-140, diastolic: 60-90
    print(f"\nOriginal dataset size: {len(df)}")
    
    # Remove extreme outliers
    df = df[(df['ap_hi'] >= 90) & (df['ap_hi'] <= 200)]
    df = df[(df['ap_lo'] >= 60) & (df['ap_lo'] <= 120)]
    
    # Remove weight outliers (30-200 kg)
    df = df[(df['weight'] >= 30) & (df['weight'] <= 200)]
    
    # Remove height outliers (100-250 cm)
    df = df[(df['height'] >= 100) & (df['height'] <= 250)]
    
    print(f"After cleaning dataset size: {len(df)}")
    print(f"Removed {70000 - len(df)} outliers")
    
    # Convert age from days to years for better scaling
    df['age_years'] = df['age'] / 365.25
    df['age_years'] = df['age_years'].round(1)  # Round to 1 decimal
    
    # Calculate BMI
    df['bmi'] = df['weight'] / ((df['height']/100) ** 2)
    df['bmi'] = df['bmi'].round(1)  # Round to 1 decimal
    
    # Drop original age column and id
    df = df.drop(['id', 'age'], axis=1)
    
    # Select features and target
    features = ['gender', 'height', 'weight', 'ap_hi', 'ap_lo', 
                'cholesterol', 'gluc', 'smoke', 'alco', 'active',
                'age_years', 'bmi']
    
    X = df[features]
    y = df['cardio']
    
    print(f"\nFeatures used: {features}")
    print(f"\nTarget distribution:")
    print(y.value_counts())
    print(f"\nTarget percentage:")
    print(y.value_counts(normalize=True).round(3) * 100)
    
    # Show summary statistics
    print("\n" + "="*50)
    print("FEATURE STATISTICS:")
    print("="*50)
    print(f"Age range: {X['age_years'].min():.1f} to {X['age_years'].max():.1f} years")
    print(f"BMI range: {X['bmi'].min():.1f} to {X['bmi'].max():.1f}")
    print(f"Height range: {X['height'].min()} to {X['height'].max()} cm")
    print(f"Weight range: {X['weight'].min()} to {X['weight'].max()} kg")
    print(f"Blood Pressure - Systolic: {X['ap_hi'].min()} to {X['ap_hi'].max()} mmHg")
    print(f"Blood Pressure - Diastolic: {X['ap_lo'].min()} to {X['ap_lo'].max()} mmHg")
    
    # Show categorical features distribution
    print("\nCategorical Features Distribution:")
    categorical_features = ['gender', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
    for feature in categorical_features:
        print(f"\n{feature}:")
        print(X[feature].value_counts().sort_index())
    
    return X, y, features

def train_model():
    """Train and save the model"""
    # Load and preprocess data
    X, y, feature_names = load_and_preprocess_data('cardio_train.csv')
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\n" + "="*50)
    print("DATA SPLIT:")
    print("="*50)
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train logistic regression
    model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight='balanced',
        solver='liblinear'
    )
    
    print("\nTraining model...")
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    print("\n" + "="*50)
    print("MODEL EVALUATION")
    print("="*50)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"ROC AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Disease', 'Disease']))
    
    # Check probability distribution
    print("\nProbability Statistics:")
    print(f"Min probability: {y_pred_proba.min():.4f}")
    print(f"Max probability: {y_pred_proba.max():.4f}")
    print(f"Mean probability: {y_pred_proba.mean():.4f}")
    
    # Show feature importance
    print("\n" + "="*50)
    print("FEATURE IMPORTANCE (Coefficients):")
    print("="*50)
    feature_importance = pd.DataFrame({
        'Feature': feature_names,
        'Coefficient': model.coef_[0]
    })
    feature_importance['Absolute'] = np.abs(feature_importance['Coefficient'])
    feature_importance = feature_importance.sort_values('Absolute', ascending=False)
    print(feature_importance.to_string(index=False))
    
    # Save model and scaler
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save feature names for reference
    with open('features.pkl', 'wb') as f:
        pickle.dump(feature_names, f)
    
    print("\n" + "="*50)
    print("MODEL SAVED SUCCESSFULLY!")
    print("="*50)
    print(f"Model saved as: model.pkl")
    print(f"Scaler saved as: scaler.pkl")
    print(f"Features saved as: features.pkl")
    print(f"\nTotal features: {len(feature_names)}")
    print(f"Features: {feature_names}")
    
    # Show example of prediction
    print("\n" + "="*50)
    print("EXAMPLE PREDICTION:")
    print("="*50)
    
    # Create example patient
    example_patient = {
        'gender': 2,  # Male
        'height': 175,
        'weight': 75,
        'ap_hi': 130,
        'ap_lo': 85,
        'cholesterol': 2,  # Above normal
        'gluc': 1,  # Normal
        'smoke': 0,
        'alco': 0,
        'active': 1,
        'age_years': 45.0,  # Age in years
        'bmi': 24.5  # BMI calculated
    }
    
    # Convert to array
    example_array = np.array([list(example_patient.values())])
    
    # Scale
    example_scaled = scaler.transform(example_array)
    
    # Predict
    example_prob = model.predict_proba(example_scaled)[0][1]
    
    print(f"\nExample patient (45-year-old male):")
    for key, value in example_patient.items():
        print(f"  {key}: {value}")
    
    print(f"\nPredicted risk: {example_prob*100:.2f}%")
    
    if example_prob > 0.5:
        print("Prediction: High risk of cardiovascular disease")
    else:
        print("Prediction: Low risk of cardiovascular disease")
    
    return model, scaler, feature_names

if __name__ == "__main__":
    train_model()