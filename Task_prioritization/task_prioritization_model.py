import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib  # For saving the model

# Sample Data (Replace this with real dataset)
data = {
    "Task_Deadline": [2, 5, 1, 3, 7, 0, 4, 2, 6, 1],
    "Task_Type": ["Exam", "Homework", "Assignment", "Exam", "Assignment",
                  "Homework", "Exam", "Assignment", "Homework", "Exam"],
    "Task_Length": [10, 5, 15, 20, 7, 25, 30, 12, 8, 18],
    "User_Priority": [5, 3, 4, 5, 2, 1, 5, 3, 2, 4],
    "Priority_Label": ["High", "Medium", "Medium", "High", "Low",
                       "Low", "High", "Medium", "Low", "High"]
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Encode categorical variable (Task Type)
le = LabelEncoder()
df["Task_Type"] = le.fit_transform(df["Task_Type"])

# Encode output labels
priority_map = {"Low": 0, "Medium": 1, "High": 2}
df["Priority_Label"] = df["Priority_Label"].map(priority_map)

# Split dataset
X = df.drop("Priority_Label", axis=1)
y = df["Priority_Label"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, "task_prioritization_model.pkl")
joblib.dump(le, "task_type_encoder.pkl")

print("✅ Model trained & saved successfully!")
