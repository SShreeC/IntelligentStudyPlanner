import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
import joblib  # For saving the model

# Step 1: Create a synthetic dataset
data = {
    "past_study_hours": [2.5, 3.0, 1.5, 4.0, 2.0, 3.5, 1.0, 5.0, 2.8, 3.2],
    "test_scores": [70, 80, 50, 90, 60, 85, 40, 95, 75, 78],
    "subject_difficulty": [3, 2, 4, 1, 3, 2, 5, 1, 4, 2],
    "upcoming_deadlines": [10, 7, 5, 15, 8, 6, 3, 20, 9, 12],
    "focus_level": [4, 5, 2, 5, 3, 4, 1, 5, 3, 4],
    "recommended_study_hours": [3.5, 4.0, 2.5, 4.5, 3.0, 4.2, 2.0, 5.5, 3.6, 3.8]
}

df = pd.DataFrame(data)

# Step 2: Define input (X) and output (y)
X = df.drop(columns=["recommended_study_hours"])  # Features (input data)
y = df["recommended_study_hours"]  # Target (output)

# Step 3: Data Preprocessing
# Normalize the data (Important for models like Linear Regression)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Step 4: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Step 5: Train the model (Linear Regression)
model = LinearRegression()
model.fit(X_train, y_train)

# Step 6: Evaluate the model
y_pred = model.predict(X_test)

# Calculate error metrics
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Absolute Error: {mae:.2f}")
print(f"R-squared Score: {r2:.2f}")

# Step 7: Save the trained model for future use
joblib.dump(model, "study_time_model.pkl")
joblib.dump(scaler, "scaler.pkl")  # Save scaler for use in future predictions

print("Model and scaler saved as study_time_model.pkl and scaler.pkl")
