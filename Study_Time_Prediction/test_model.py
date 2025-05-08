# import joblib
# import numpy as np

# # Load the trained model and scaler
# model = joblib.load("study_time_model.pkl")
# scaler = joblib.load("scaler.pkl")

# # Define the predefined input values (example input)
# input_data = {
#     "past_study_hours": 3.0,  # Example: The student studied 3 hours previously
#     "test_scores": 75,         # Example: The student scored 75 in the last test
#     "subject_difficulty": 2,   # Example: The subject is rated 2 in difficulty (on a scale of 1 to 5)
#     "upcoming_deadlines": 10,  # Example: 10 days left until the exam
#     "focus_level": 4           # Example: The student has a focus level of 4 (on a scale of 1 to 5)
# }

# # Convert the input data into a numpy array (matching the order of features)
# input_array = np.array([
#     input_data["past_study_hours"],
#     input_data["test_scores"],
#     input_data["subject_difficulty"],
#     input_data["upcoming_deadlines"],
#     input_data["focus_level"]
# ]).reshape(1, -1)  # Reshape to make it a 2D array as the model expects 2D input

# # Normalize the input data using the same scaler used for training
# input_scaled = scaler.transform(input_array)

# # Predict the recommended study hours using the model
# predicted_study_hours = model.predict(input_scaled)

# # Output the prediction
# print(f"Predicted Study Hours: {predicted_study_hours[0]:.2f} hours")
import joblib
import numpy as np

# Load the trained model and scaler
model = joblib.load("study_time_model.pkl")
scaler = joblib.load("scaler.pkl")

# Define the student's input data
input_data = {
    "past_study_hours": 3.0,      # Student studied 3 hours before
    "test_scores": 75,            # Last test score
    "subject_difficulty": 2,      # Subject difficulty (1-easy to 5-hard)
    "upcoming_deadlines": 10,     # Days left for exam
    "focus_level": 4              # Focus level (1-low to 5-high)
}

# Convert the input into an array in the right order
input_array = np.array([
    input_data["past_study_hours"],
    input_data["test_scores"],
    input_data["subject_difficulty"],
    input_data["upcoming_deadlines"],
    input_data["focus_level"]
]).reshape(1, -1)

# Scale the input
input_scaled = scaler.transform(input_array)

# Predict recommended study hours
predicted_study_hours = model.predict(input_scaled)[0]

# Output the result with personalized insight
print(f"\n📚 Recommended Study Time: {predicted_study_hours:.2f} hours/day")

# Generate personalized tips based on prediction
if predicted_study_hours < 2:
    print("✅ You're doing well! Just keep revising consistently to stay on track.")
elif predicted_study_hours < 4:
    print("📈 Boost your focus during study sessions and revise smart with summaries.")
elif predicted_study_hours < 6:
    print("📌 Consider breaking study time into smaller blocks and avoid distractions.")
else:
    print("🚨 Time to prioritize! You may need to reduce distractions and set strict routines.")

# Bonus Tips based on focus and difficulty
if input_data["focus_level"] < 3:
    print("🧘 Try Pomodoro technique or short meditation before studying to improve focus.")

if input_data["subject_difficulty"] >= 4:
    print("📝 Break down difficult topics into smaller chunks and practice with mock tests.")

if input_data["upcoming_deadlines"] <= 5:
    print("⏰ Exam is close! Focus on revision and time management. Avoid starting new topics.")

print("\n✨ Tip: Progress > Perfection. Study smart, not just hard!")
