# Import necessary modules
import joblib
import pandas as pd

# Load model and encoder
model = joblib.load("task_prioritization_model.pkl")
le = joblib.load("task_type_encoder.pkl")

# Predefined input
input_data = {
    "Task_Deadline": 2,  # 2 days left
    "Task_Type": "Exam",  # Categorical value
    "Task_Length": 12,  # 12 pages
    "User_Priority": 4   # User-defined priority (1-5)
}

# Convert categorical variable
input_data["Task_Type"] = le.transform([input_data["Task_Type"]])[0]

# Convert to DataFrame
input_df = pd.DataFrame([input_data])

# Make prediction
predicted_priority = model.predict(input_df)[0]

# Decode priority
priority_map_reverse = {0: "Low", 1: "Medium", 2: "High"}
predicted_priority_label = priority_map_reverse[predicted_priority]

print(f"🔹 Predicted Task Priority: {predicted_priority_label}")
