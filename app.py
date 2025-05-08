<<<<<<< HEAD
from flask import Flask, request, jsonify
import numpy as np
import pickle
import joblib
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  
  # Enable CORS for all routes

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Path to model files
ADAPTIVE_MODEL_PATH = 'adaptive_study_plan/adaptive_study_plan_model.pkl'
EXAM_READINESS_MODEL_PATH = 'exam_readiness/exam_readiness_score_model.pkl'
LABEL_ENCODER_PATH = 'exam_readiness/label_encoder.pkl'
PROGRESS_MODEL_PATH = 'predictive_progress/predictive_progress_model.pkl'
WEAK_SUBJECT_MODEL_PATH = 'predictive_progress/weak_subject_model.pkl'
WEAK_SUBJECT_SCALER_PATH = 'predictive_progress/scaler.pkl'
STUDY_TIME_MODEL_PATH = 'Study_Time_Prediction/study_time_model.pkl'
STUDY_TIME_SCALER_PATH = 'Study_Time_Prediction/scaler.pkl'
TASK_PRIORITY_MODEL_PATH = 'Task_prioritization/task_prioritization_model.pkl'
TASK_TYPE_ENCODER_PATH = 'Task_prioritization/task_type_encoder.pkl'

# Load all models (if they exist)
def load_models():
    models = {}
    
    # Check and load Adaptive Study Plan Model
    if os.path.exists(ADAPTIVE_MODEL_PATH):
        with open(ADAPTIVE_MODEL_PATH, 'rb') as f:
            models['adaptive_study_plan'] = pickle.load(f)
    
    # Check and load Exam Readiness Model and its Label Encoder
    if os.path.exists(EXAM_READINESS_MODEL_PATH) and os.path.exists(LABEL_ENCODER_PATH):
        with open(EXAM_READINESS_MODEL_PATH, 'rb') as f:
            models['exam_readiness'] = pickle.load(f)
        with open(LABEL_ENCODER_PATH, 'rb') as f:
            models['label_encoder'] = pickle.load(f)
    
    # Check and load Progress Model
    if os.path.exists(PROGRESS_MODEL_PATH):
        models['progress'] = joblib.load(PROGRESS_MODEL_PATH)
    
    # # Check and load Weak Subject Model and its Scaler
    if os.path.exists(WEAK_SUBJECT_MODEL_PATH) and os.path.exists(WEAK_SUBJECT_SCALER_PATH):
        models['weak_subject'] = joblib.load(WEAK_SUBJECT_MODEL_PATH)
        models['weak_subject_scaler'] = joblib.load(WEAK_SUBJECT_SCALER_PATH)
    
    # Check and load Study Time Model and its Scaler
    if os.path.exists(STUDY_TIME_MODEL_PATH) and os.path.exists(STUDY_TIME_SCALER_PATH):
        models['study_time'] = joblib.load(STUDY_TIME_MODEL_PATH)
        models['study_time_scaler'] = joblib.load(STUDY_TIME_SCALER_PATH)
    
    # Check and load Task Prioritization Model and its Encoder
    if os.path.exists(TASK_PRIORITY_MODEL_PATH) and os.path.exists(TASK_TYPE_ENCODER_PATH):
        models['task_priority'] = joblib.load(TASK_PRIORITY_MODEL_PATH)
        models['task_type_encoder'] = joblib.load(TASK_TYPE_ENCODER_PATH)
    
    return models

# Try to load models (will be empty if models don't exist yet)
models = load_models()

# Home route
@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Study AI API is running",
        "available_endpoints": [
            "/api/adaptive-study-plan",
            "/api/exam-readiness",
            "/api/progress-prediction",
            "/api/weak-subject",
            "/api/study-time",
            "/api/task-priority",
            "/api/train-models"
        ]
    })

# Endpoint for Adaptive Study Plan
@app.route('/api/adaptive-study-plan', methods=['POST'])
def adaptive_study_plan():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'adaptive_study_plan' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_logs = data.get('study_logs', [])
        subject_difficulty = data.get('subject_difficulty', [])
        time_left = data.get('time_left', 30)
        
        # Ensure data is in correct format
        if len(study_logs) != len(subject_difficulty):
            return jsonify({
                "status": "error",
                "message": "study_logs and subject_difficulty must have the same length"
            }), 400
        
        # Prepare input for model
        X = np.array([study_logs, subject_difficulty, [time_left] * len(study_logs)]).T
        
        # Make prediction
        prediction = models['adaptive_study_plan'].predict(X)
        
        return jsonify({
            "status": "success",
            "prediction": prediction.tolist(),
            "message": "Adaptive study plan generated successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Exam Readiness Score
@app.route('/api/exam-readiness', methods=['POST'])
def exam_readiness():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'exam_readiness' not in models or 'label_encoder' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_consistency = data.get('study_consistency', [])
        past_test_scores = data.get('past_test_scores', [])
        recent_study_hours = data.get('recent_study_hours', [])
        
        # Ensure data is in correct format and has the same length
        if not (len(study_consistency) == len(past_test_scores) == len(recent_study_hours)):
            return jsonify({
                "status": "error",
                "message": "All input arrays must have the same length"
            }), 400
        
        # Prepare input for model
        X = np.array([study_consistency, past_test_scores, recent_study_hours]).T
        
        # Make prediction
        prediction_numeric = models['exam_readiness'].predict(X)
        prediction = models['label_encoder'].inverse_transform(prediction_numeric)
        
        return jsonify({
            "status": "success",
            "prediction": prediction.tolist(),
            "message": "Exam readiness predicted successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Progress Prediction
@app.route('/api/progress-prediction', methods=['POST'])
def progress_prediction():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'progress' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_hours = data.get('study_hours', 0)
        topics_covered = data.get('topics_covered', 0)
        quiz_scores = data.get('quiz_scores', 0)
        
        # Prepare input for model
        input_data = np.array([[study_hours, topics_covered, quiz_scores]])
        
        # Make prediction
        prediction = models['progress'].predict(input_data)
        
        return jsonify({
            "status": "success",
            "syllabus_completion_percentage": float(prediction[0]),
            "message": "Progress prediction completed successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Weak Subject Identification
@app.route('/api/weak-subject', methods=['POST'])
def weak_subject():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'weak_subject' not in models or 'weak_subject_scaler' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_hours = data.get('study_hours', 0)
        topics_covered = data.get('topics_covered', 0)
        quiz_scores = data.get('quiz_scores', 0)
        time_per_question = data.get('time_per_question', 0)
        
        # Validate inputs
        if study_hours < 0 or topics_covered < 0 or quiz_scores < 0 or time_per_question < 0:
            return jsonify({
                "status": "error",
                "message": "Invalid input. Please provide positive values for all parameters."
            }), 400
        
        # Prepare input for model
        input_data = np.array([[study_hours, topics_covered, quiz_scores, time_per_question]])
        input_scaled = models['weak_subject_scaler'].transform(input_data)
        
        # Make prediction
        prediction = models['weak_subject'].predict(input_scaled)
        
        result_message = "The student is weak in the subject." if prediction[0] == 1 else "The student is not weak in the subject."
        
        return jsonify({
            "status": "success",
            "is_weak_subject": bool(prediction[0]),
            "message": result_message
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Study Time Recommendation
@app.route('/api/study-time', methods=['POST'])
def study_time():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'study_time' not in models or 'study_time_scaler' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        past_study_hours = data.get('past_study_hours', 0)
        test_scores = data.get('test_scores', 0)
        subject_difficulty = data.get('subject_difficulty', 0)
        upcoming_deadlines = data.get('upcoming_deadlines', 0)
        focus_level = data.get('focus_level', 0)
        
        # Prepare input for model
        input_data = np.array([[past_study_hours, test_scores, subject_difficulty, upcoming_deadlines, focus_level]])
        input_scaled = models['study_time_scaler'].transform(input_data)
        
        # Make prediction
        prediction = models['study_time'].predict(input_scaled)
        
        return jsonify({
            "status": "success",
            "recommended_study_hours": float(prediction[0]),
            "message": "Study time recommendation completed successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Task Prioritization
@app.route('/api/task-priority', methods=['POST'])
def task_priority():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'task_priority' not in models or 'task_type_encoder' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        task_deadline = data.get('task_deadline', 0)
        task_type = data.get('task_type', "Homework")
        task_length = data.get('task_length', 0)
        user_priority = data.get('user_priority', 0)
        
        # Encode task type
        try:
            encoded_task_type = models['task_type_encoder'].transform([task_type])[0]
        except:
            return jsonify({
                "status": "error",
                "message": f"Invalid task type: {task_type}. Valid types are Exam, Homework, and Assignment."
            }), 400
        
        # Prepare input for model
        input_data = np.array([[task_deadline, encoded_task_type, task_length, user_priority]])
        
        # Make prediction
        prediction = models['task_priority'].predict(input_data)
        
        # Convert numeric priority back to label
        priority_label = ["Low", "Medium", "High"][prediction[0]]
        
        return jsonify({
            "status": "success",
            "priority": priority_label,
            "priority_numeric": int(prediction[0]),
            "message": "Task priority prediction completed successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Training Models (simplified for demonstration)
@app.route('/api/train-models', methods=['POST'])
def train_models():
    try:
        # In a real application, you would train models with actual data from your database
        # Here, we'll use the sample data from the code you provided
        
        # Train Adaptive Study Plan Model
        from sklearn.linear_model import LinearRegression
        
        # Sample data for Adaptive Study Plan Model
        study_logs = [5, 3, 6]
        subject_difficulty = [2, 3, 1]
        time_left = 30
        
        # Creating features
        X = np.array([study_logs, subject_difficulty, [time_left] * len(study_logs)]).T
        y = np.array([5, 3, 6])  # Target values
        
        # Train model
        adaptive_model = LinearRegression()
        adaptive_model.fit(X, y)
        
        # Save model
        with open(ADAPTIVE_MODEL_PATH, 'wb') as f:
            pickle.dump(adaptive_model, f)
        
        # Train Exam Readiness Model
        from sklearn.linear_model import LogisticRegression
        
        # Sample data for Exam Readiness Model
        study_consistency = [8, 6, 9]
        past_test_scores = [85, 65, 90]
        recent_study_hours = [10, 5, 15]
        readiness_score_labels = ['High', 'Medium', 'High']
        
        # Creating features
        X = np.array([study_consistency, past_test_scores, recent_study_hours]).T
        
        # Create and fit label encoder
        label_encoder = LabelEncoder()
        y = label_encoder.fit_transform(readiness_score_labels)
        
        # Train model
        exam_readiness_model = LogisticRegression()
        exam_readiness_model.fit(X, y)
        
        # Save model and encoder
        with open(EXAM_READINESS_MODEL_PATH, 'wb') as f:
            pickle.dump(exam_readiness_model, f)
        with open(LABEL_ENCODER_PATH, 'wb') as f:
            pickle.dump(label_encoder, f)
        
        # Train Progress Model
        class PredictiveProgressModel:
            def __init__(self):
                self.model = LinearRegression()
            
            def train(self, X_train, y_train):
                self.model.fit(X_train, y_train)
            
            def predict_syllabus_completion(self, X_test):
                return self.model.predict(X_test)
        
        # Sample data for Progress Model
        data = {
            'study_hours': [10, 15, 20, 30, 25, 35, 40, 50, 60],
            'topics_covered': [5, 7, 8, 12, 10, 15, 18, 20, 22],
            'quiz_scores': [60, 70, 75, 80, 85, 90, 95, 92, 96],
            'time_per_question': [2, 1.8, 2.5, 1.5, 1.6, 1.4, 1.3, 1.2, 1.1],
            'syllabus_completion': [20, 35, 50, 70, 65, 80, 85, 90, 95]
        }
        
        df = pd.DataFrame(data)
        X = df[['study_hours', 'topics_covered', 'quiz_scores', 'time_per_question']]
        y = df['syllabus_completion']
        
        # Train model
        progress_model = PredictiveProgressModel()
        progress_model.train(X, y)
        
        # Save model
        joblib.dump(progress_model, PROGRESS_MODEL_PATH)
        
        # Train Weak Subject Model
        from sklearn.linear_model import LogisticRegression
        
        # Sample data for Weak Subject Model
        data = {
            'study_hours': [10, 15, 20, 30, 25, 35, 40, 50, 60],
            'topics_covered': [5, 7, 8, 12, 10, 15, 18, 20, 22],
            'quiz_scores': [60, 70, 75, 80, 85, 90, 95, 92, 96],
            'time_per_question': [2, 1.8, 2.5, 1.5, 1.6, 1.4, 1.3, 1.2, 1.1],
            'weak_subject': [1, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        
        df = pd.DataFrame(data)
        X = df[['study_hours', 'topics_covered', 'quiz_scores', 'time_per_question']]
        y = df['weak_subject']
        
        # Create and fit scaler
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        weak_subject_model = LogisticRegression()
        weak_subject_model.fit(X_scaled, y)
        
        # Save model and scaler
        joblib.dump(weak_subject_model, WEAK_SUBJECT_MODEL_PATH)
        joblib.dump(scaler, WEAK_SUBJECT_SCALER_PATH)
        
        # Train Study Time Model
        # Sample data for Study Time Model
        data = {
            "past_study_hours": [2.5, 3.0, 1.5, 4.0, 2.0, 3.5, 1.0, 5.0, 2.8, 3.2],
            "test_scores": [70, 80, 50, 90, 60, 85, 40, 95, 75, 78],
            "subject_difficulty": [3, 2, 4, 1, 3, 2, 5, 1, 4, 2],
            "upcoming_deadlines": [10, 7, 5, 15, 8, 6, 3, 20, 9, 12],
            "focus_level": [4, 5, 2, 5, 3, 4, 1, 5, 3, 4],
            "recommended_study_hours": [3.5, 4.0, 2.5, 4.5, 3.0, 4.2, 2.0, 5.5, 3.6, 3.8]
        }
        
        df = pd.DataFrame(data)
        X = df.drop(columns=["recommended_study_hours"])
        y = df["recommended_study_hours"]
        
        # Create and fit scaler
        study_time_scaler = StandardScaler()
        X_scaled = study_time_scaler.fit_transform(X)
        
        # Train model
        study_time_model = LinearRegression()
        study_time_model.fit(X_scaled, y)
        
        # Save model and scaler
        joblib.dump(study_time_model, STUDY_TIME_MODEL_PATH)
        joblib.dump(study_time_scaler, STUDY_TIME_SCALER_PATH)
        
        # Train Task Prioritization Model
        from sklearn.ensemble import RandomForestClassifier
        
        # Sample data for Task Prioritization Model
        data = {
            "Task_Deadline": [2, 5, 1, 3, 7, 0, 4, 2, 6, 1],
            "Task_Type": ["Exam", "Homework", "Assignment", "Exam", "Assignment",
                          "Homework", "Exam", "Assignment", "Homework", "Exam"],
            "Task_Length": [10, 5, 15, 20, 7, 25, 30, 12, 8, 18],
            "User_Priority": [5, 3, 4, 5, 2, 1, 5, 3, 2, 4],
            "Priority_Label": ["High", "Medium", "Medium", "High", "Low",
                               "Low", "High", "Medium", "Low", "High"]
        }
        
        df = pd.DataFrame(data)
        
        # Encode task types
        task_type_encoder = LabelEncoder()
        df["Task_Type"] = task_type_encoder.fit_transform(df["Task_Type"])
        
        # Encode priority labels
        priority_map = {"Low": 0, "Medium": 1, "High": 2}
        df["Priority_Label"] = df["Priority_Label"].map(priority_map)
        
        # Split dataset
        X = df.drop("Priority_Label", axis=1)
        y = df["Priority_Label"]
        
        # Train model
        task_priority_model = RandomForestClassifier(n_estimators=100, random_state=42)
        task_priority_model.fit(X, y)
        
        # Save model and encoder
        joblib.dump(task_priority_model, TASK_PRIORITY_MODEL_PATH)
        joblib.dump(task_type_encoder, TASK_TYPE_ENCODER_PATH)
        
        # Reload models
        models.clear()
        models.update(load_models())
        
        return jsonify({
            "status": "success",
            "message": "All models trained successfully",
            "models_trained": [
                "adaptive_study_plan",
                "exam_readiness",
                "progress",
                "weak_subject",
                "study_time",
                "task_priority"
            ]
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error training models: {str(e)}"
        }), 500

if __name__ == '__main__':
=======
from flask import Flask, request, jsonify
import numpy as np
import pickle
import joblib
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  
  # Enable CORS for all routes

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Path to model files
ADAPTIVE_MODEL_PATH = 'adaptive_study_plan/adaptive_study_plan_model.pkl'
EXAM_READINESS_MODEL_PATH = 'exam_readiness/exam_readiness_score_model.pkl'
LABEL_ENCODER_PATH = 'exam_readiness/label_encoder.pkl'
PROGRESS_MODEL_PATH = 'predictive_progress/predictive_progress_model.pkl'
WEAK_SUBJECT_MODEL_PATH = 'predictive_progress/weak_subject_model.pkl'
WEAK_SUBJECT_SCALER_PATH = 'predictive_progress/scaler.pkl'
STUDY_TIME_MODEL_PATH = 'Study_Time_Prediction/study_time_model.pkl'
STUDY_TIME_SCALER_PATH = 'Study_Time_Prediction/scaler.pkl'
TASK_PRIORITY_MODEL_PATH = 'Task_prioritization/task_prioritization_model.pkl'
TASK_TYPE_ENCODER_PATH = 'Task_prioritization/task_type_encoder.pkl'

# Load all models (if they exist)
def load_models():
    models = {}
    
    # Check and load Adaptive Study Plan Model
    if os.path.exists(ADAPTIVE_MODEL_PATH):
        with open(ADAPTIVE_MODEL_PATH, 'rb') as f:
            models['adaptive_study_plan'] = pickle.load(f)
    
    # Check and load Exam Readiness Model and its Label Encoder
    if os.path.exists(EXAM_READINESS_MODEL_PATH) and os.path.exists(LABEL_ENCODER_PATH):
        with open(EXAM_READINESS_MODEL_PATH, 'rb') as f:
            models['exam_readiness'] = pickle.load(f)
        with open(LABEL_ENCODER_PATH, 'rb') as f:
            models['label_encoder'] = pickle.load(f)
    
    # Check and load Progress Model
    if os.path.exists(PROGRESS_MODEL_PATH):
        models['progress'] = joblib.load(PROGRESS_MODEL_PATH)
    
    # # Check and load Weak Subject Model and its Scaler
    if os.path.exists(WEAK_SUBJECT_MODEL_PATH) and os.path.exists(WEAK_SUBJECT_SCALER_PATH):
        models['weak_subject'] = joblib.load(WEAK_SUBJECT_MODEL_PATH)
        models['weak_subject_scaler'] = joblib.load(WEAK_SUBJECT_SCALER_PATH)
    
    # Check and load Study Time Model and its Scaler
    if os.path.exists(STUDY_TIME_MODEL_PATH) and os.path.exists(STUDY_TIME_SCALER_PATH):
        models['study_time'] = joblib.load(STUDY_TIME_MODEL_PATH)
        models['study_time_scaler'] = joblib.load(STUDY_TIME_SCALER_PATH)
    
    # Check and load Task Prioritization Model and its Encoder
    if os.path.exists(TASK_PRIORITY_MODEL_PATH) and os.path.exists(TASK_TYPE_ENCODER_PATH):
        models['task_priority'] = joblib.load(TASK_PRIORITY_MODEL_PATH)
        models['task_type_encoder'] = joblib.load(TASK_TYPE_ENCODER_PATH)
    
    return models

# Try to load models (will be empty if models don't exist yet)
models = load_models()

# Home route
@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Study AI API is running",
        "available_endpoints": [
            "/api/adaptive-study-plan",
            "/api/exam-readiness",
            "/api/progress-prediction",
            "/api/weak-subject",
            "/api/study-time",
            "/api/task-priority",
            "/api/train-models"
        ]
    })

# Endpoint for Adaptive Study Plan
@app.route('/api/adaptive-study-plan', methods=['POST'])
def adaptive_study_plan():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'adaptive_study_plan' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_logs = data.get('study_logs', [])
        subject_difficulty = data.get('subject_difficulty', [])
        time_left = data.get('time_left', 30)
        
        # Ensure data is in correct format
        if len(study_logs) != len(subject_difficulty):
            return jsonify({
                "status": "error",
                "message": "study_logs and subject_difficulty must have the same length"
            }), 400
        
        # Prepare input for model
        X = np.array([study_logs, subject_difficulty, [time_left] * len(study_logs)]).T
        
        # Make prediction
        prediction = models['adaptive_study_plan'].predict(X)
        
        return jsonify({
            "status": "success",
            "prediction": prediction.tolist(),
            "message": "Adaptive study plan generated successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Exam Readiness Score
@app.route('/api/exam-readiness', methods=['POST'])
def exam_readiness():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'exam_readiness' not in models or 'label_encoder' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_consistency = data.get('study_consistency', [])
        past_test_scores = data.get('past_test_scores', [])
        recent_study_hours = data.get('recent_study_hours', [])
        
        # Ensure data is in correct format and has the same length
        if not (len(study_consistency) == len(past_test_scores) == len(recent_study_hours)):
            return jsonify({
                "status": "error",
                "message": "All input arrays must have the same length"
            }), 400
        
        # Prepare input for model
        X = np.array([study_consistency, past_test_scores, recent_study_hours]).T
        
        # Make prediction
        prediction_numeric = models['exam_readiness'].predict(X)
        prediction = models['label_encoder'].inverse_transform(prediction_numeric)
        
        return jsonify({
            "status": "success",
            "prediction": prediction.tolist(),
            "message": "Exam readiness predicted successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Progress Prediction
@app.route('/api/progress-prediction', methods=['POST'])
def progress_prediction():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'progress' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_hours = data.get('study_hours', 0)
        topics_covered = data.get('topics_covered', 0)
        quiz_scores = data.get('quiz_scores', 0)
        
        # Prepare input for model
        input_data = np.array([[study_hours, topics_covered, quiz_scores]])
        
        # Make prediction
        prediction = models['progress'].predict(input_data)
        
        return jsonify({
            "status": "success",
            "syllabus_completion_percentage": float(prediction[0]),
            "message": "Progress prediction completed successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Weak Subject Identification
@app.route('/api/weak-subject', methods=['POST'])
def weak_subject():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'weak_subject' not in models or 'weak_subject_scaler' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        study_hours = data.get('study_hours', 0)
        topics_covered = data.get('topics_covered', 0)
        quiz_scores = data.get('quiz_scores', 0)
        time_per_question = data.get('time_per_question', 0)
        
        # Validate inputs
        if study_hours < 0 or topics_covered < 0 or quiz_scores < 0 or time_per_question < 0:
            return jsonify({
                "status": "error",
                "message": "Invalid input. Please provide positive values for all parameters."
            }), 400
        
        # Prepare input for model
        input_data = np.array([[study_hours, topics_covered, quiz_scores, time_per_question]])
        input_scaled = models['weak_subject_scaler'].transform(input_data)
        
        # Make prediction
        prediction = models['weak_subject'].predict(input_scaled)
        
        result_message = "The student is weak in the subject." if prediction[0] == 1 else "The student is not weak in the subject."
        
        return jsonify({
            "status": "success",
            "is_weak_subject": bool(prediction[0]),
            "message": result_message
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Study Time Recommendation
@app.route('/api/study-time', methods=['POST'])
def study_time():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'study_time' not in models or 'study_time_scaler' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        past_study_hours = data.get('past_study_hours', 0)
        test_scores = data.get('test_scores', 0)
        subject_difficulty = data.get('subject_difficulty', 0)
        upcoming_deadlines = data.get('upcoming_deadlines', 0)
        focus_level = data.get('focus_level', 0)
        
        # Prepare input for model
        input_data = np.array([[past_study_hours, test_scores, subject_difficulty, upcoming_deadlines, focus_level]])
        input_scaled = models['study_time_scaler'].transform(input_data)
        
        # Make prediction
        prediction = models['study_time'].predict(input_scaled)
        
        return jsonify({
            "status": "success",
            "recommended_study_hours": float(prediction[0]),
            "message": "Study time recommendation completed successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Task Prioritization
@app.route('/api/task-priority', methods=['POST'])
def task_priority():
    try:
        data = request.get_json()
        
        # Check if model is available
        if 'task_priority' not in models or 'task_type_encoder' not in models:
            return jsonify({
                "status": "error",
                "message": "Model not trained yet. Please train the model first."
            }), 400
        
        # Extract data from request
        task_deadline = data.get('task_deadline', 0)
        task_type = data.get('task_type', "Homework")
        task_length = data.get('task_length', 0)
        user_priority = data.get('user_priority', 0)
        
        # Encode task type
        try:
            encoded_task_type = models['task_type_encoder'].transform([task_type])[0]
        except:
            return jsonify({
                "status": "error",
                "message": f"Invalid task type: {task_type}. Valid types are Exam, Homework, and Assignment."
            }), 400
        
        # Prepare input for model
        input_data = np.array([[task_deadline, encoded_task_type, task_length, user_priority]])
        
        # Make prediction
        prediction = models['task_priority'].predict(input_data)
        
        # Convert numeric priority back to label
        priority_label = ["Low", "Medium", "High"][prediction[0]]
        
        return jsonify({
            "status": "success",
            "priority": priority_label,
            "priority_numeric": int(prediction[0]),
            "message": "Task priority prediction completed successfully"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Endpoint for Training Models (simplified for demonstration)
@app.route('/api/train-models', methods=['POST'])
def train_models():
    try:
        # In a real application, you would train models with actual data from your database
        # Here, we'll use the sample data from the code you provided
        
        # Train Adaptive Study Plan Model
        from sklearn.linear_model import LinearRegression
        
        # Sample data for Adaptive Study Plan Model
        study_logs = [5, 3, 6]
        subject_difficulty = [2, 3, 1]
        time_left = 30
        
        # Creating features
        X = np.array([study_logs, subject_difficulty, [time_left] * len(study_logs)]).T
        y = np.array([5, 3, 6])  # Target values
        
        # Train model
        adaptive_model = LinearRegression()
        adaptive_model.fit(X, y)
        
        # Save model
        with open(ADAPTIVE_MODEL_PATH, 'wb') as f:
            pickle.dump(adaptive_model, f)
        
        # Train Exam Readiness Model
        from sklearn.linear_model import LogisticRegression
        
        # Sample data for Exam Readiness Model
        study_consistency = [8, 6, 9]
        past_test_scores = [85, 65, 90]
        recent_study_hours = [10, 5, 15]
        readiness_score_labels = ['High', 'Medium', 'High']
        
        # Creating features
        X = np.array([study_consistency, past_test_scores, recent_study_hours]).T
        
        # Create and fit label encoder
        label_encoder = LabelEncoder()
        y = label_encoder.fit_transform(readiness_score_labels)
        
        # Train model
        exam_readiness_model = LogisticRegression()
        exam_readiness_model.fit(X, y)
        
        # Save model and encoder
        with open(EXAM_READINESS_MODEL_PATH, 'wb') as f:
            pickle.dump(exam_readiness_model, f)
        with open(LABEL_ENCODER_PATH, 'wb') as f:
            pickle.dump(label_encoder, f)
        
        # Train Progress Model
        class PredictiveProgressModel:
            def __init__(self):
                self.model = LinearRegression()
            
            def train(self, X_train, y_train):
                self.model.fit(X_train, y_train)
            
            def predict_syllabus_completion(self, X_test):
                return self.model.predict(X_test)
        
        # Sample data for Progress Model
        data = {
            'study_hours': [10, 15, 20, 30, 25, 35, 40, 50, 60],
            'topics_covered': [5, 7, 8, 12, 10, 15, 18, 20, 22],
            'quiz_scores': [60, 70, 75, 80, 85, 90, 95, 92, 96],
            'time_per_question': [2, 1.8, 2.5, 1.5, 1.6, 1.4, 1.3, 1.2, 1.1],
            'syllabus_completion': [20, 35, 50, 70, 65, 80, 85, 90, 95]
        }
        
        df = pd.DataFrame(data)
        X = df[['study_hours', 'topics_covered', 'quiz_scores', 'time_per_question']]
        y = df['syllabus_completion']
        
        # Train model
        progress_model = PredictiveProgressModel()
        progress_model.train(X, y)
        
        # Save model
        joblib.dump(progress_model, PROGRESS_MODEL_PATH)
        
        # Train Weak Subject Model
        from sklearn.linear_model import LogisticRegression
        
        # Sample data for Weak Subject Model
        data = {
            'study_hours': [10, 15, 20, 30, 25, 35, 40, 50, 60],
            'topics_covered': [5, 7, 8, 12, 10, 15, 18, 20, 22],
            'quiz_scores': [60, 70, 75, 80, 85, 90, 95, 92, 96],
            'time_per_question': [2, 1.8, 2.5, 1.5, 1.6, 1.4, 1.3, 1.2, 1.1],
            'weak_subject': [1, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        
        df = pd.DataFrame(data)
        X = df[['study_hours', 'topics_covered', 'quiz_scores', 'time_per_question']]
        y = df['weak_subject']
        
        # Create and fit scaler
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        weak_subject_model = LogisticRegression()
        weak_subject_model.fit(X_scaled, y)
        
        # Save model and scaler
        joblib.dump(weak_subject_model, WEAK_SUBJECT_MODEL_PATH)
        joblib.dump(scaler, WEAK_SUBJECT_SCALER_PATH)
        
        # Train Study Time Model
        # Sample data for Study Time Model
        data = {
            "past_study_hours": [2.5, 3.0, 1.5, 4.0, 2.0, 3.5, 1.0, 5.0, 2.8, 3.2],
            "test_scores": [70, 80, 50, 90, 60, 85, 40, 95, 75, 78],
            "subject_difficulty": [3, 2, 4, 1, 3, 2, 5, 1, 4, 2],
            "upcoming_deadlines": [10, 7, 5, 15, 8, 6, 3, 20, 9, 12],
            "focus_level": [4, 5, 2, 5, 3, 4, 1, 5, 3, 4],
            "recommended_study_hours": [3.5, 4.0, 2.5, 4.5, 3.0, 4.2, 2.0, 5.5, 3.6, 3.8]
        }
        
        df = pd.DataFrame(data)
        X = df.drop(columns=["recommended_study_hours"])
        y = df["recommended_study_hours"]
        
        # Create and fit scaler
        study_time_scaler = StandardScaler()
        X_scaled = study_time_scaler.fit_transform(X)
        
        # Train model
        study_time_model = LinearRegression()
        study_time_model.fit(X_scaled, y)
        
        # Save model and scaler
        joblib.dump(study_time_model, STUDY_TIME_MODEL_PATH)
        joblib.dump(study_time_scaler, STUDY_TIME_SCALER_PATH)
        
        # Train Task Prioritization Model
        from sklearn.ensemble import RandomForestClassifier
        
        # Sample data for Task Prioritization Model
        data = {
            "Task_Deadline": [2, 5, 1, 3, 7, 0, 4, 2, 6, 1],
            "Task_Type": ["Exam", "Homework", "Assignment", "Exam", "Assignment",
                          "Homework", "Exam", "Assignment", "Homework", "Exam"],
            "Task_Length": [10, 5, 15, 20, 7, 25, 30, 12, 8, 18],
            "User_Priority": [5, 3, 4, 5, 2, 1, 5, 3, 2, 4],
            "Priority_Label": ["High", "Medium", "Medium", "High", "Low",
                               "Low", "High", "Medium", "Low", "High"]
        }
        
        df = pd.DataFrame(data)
        
        # Encode task types
        task_type_encoder = LabelEncoder()
        df["Task_Type"] = task_type_encoder.fit_transform(df["Task_Type"])
        
        # Encode priority labels
        priority_map = {"Low": 0, "Medium": 1, "High": 2}
        df["Priority_Label"] = df["Priority_Label"].map(priority_map)
        
        # Split dataset
        X = df.drop("Priority_Label", axis=1)
        y = df["Priority_Label"]
        
        # Train model
        task_priority_model = RandomForestClassifier(n_estimators=100, random_state=42)
        task_priority_model.fit(X, y)
        
        # Save model and encoder
        joblib.dump(task_priority_model, TASK_PRIORITY_MODEL_PATH)
        joblib.dump(task_type_encoder, TASK_TYPE_ENCODER_PATH)
        
        # Reload models
        models.clear()
        models.update(load_models())
        
        return jsonify({
            "status": "success",
            "message": "All models trained successfully",
            "models_trained": [
                "adaptive_study_plan",
                "exam_readiness",
                "progress",
                "weak_subject",
                "study_time",
                "task_priority"
            ]
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error training models: {str(e)}"
        }), 500

if __name__ == '__main__':
>>>>>>> 6badb70 (Initial commit with updated files)
    app.run(debug=True, host='0.0.0.0', port=5000)