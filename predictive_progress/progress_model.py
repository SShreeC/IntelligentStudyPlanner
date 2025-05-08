import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Sample Data (Replace with real data)
data = {
    "study_hours": [10, 20, 30, 40, 50, 60, 70],
    "topics_covered": [20, 30, 40, 50, 60, 70, 80],
    "quiz_scores": [40, 50, 60, 70, 80, 90, 100],
    "progress": [50, 60, 70, 80, 90, 100, 110]  # Hypothetical progress metric
}

df = pd.DataFrame(data)

# Features & Target
X = df[["study_hours", "topics_covered", "quiz_scores"]]
y = df["progress"]

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = LinearRegression()
model.fit(X_train, y_train)

# Save Model
with open("predictive_progress_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("✅ Model trained and saved successfully!")
