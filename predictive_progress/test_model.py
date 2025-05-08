# import pickle
# import numpy as np

# # Load the trained model
# with open("progress_model.pkl", "rb") as file:
#     model = pickle.load(file)

# # Predefined Input
# input_data = np.array([
#     [12, 34, 45],  # Example: Study Hours = 12, Topics Covered = 34, Quiz Scores = 45
#     [20, 45, 60]   # Another Example
# ])

# # Predict Progress
# predicted_progress = model.predict(input_data)

# # Print Results
# for i, progress in enumerate(predicted_progress):
#     print(f"Prediction {i+1}: {progress:.2f}")
import pickle
import numpy as np

# Load the trained model
with open("progress_model.pkl", "rb") as file:
    model = pickle.load(file)

# Sample Input: [Study Hours, Topics Covered, Quiz Scores]
input_data = np.array([
    [12, 34, 45],   # Moderate effort
    [20, 45, 60],   # Better performance
    [5, 15, 20]     # Low effort
])

# Predict Progress
predicted_progress = model.predict(input_data)

# Generate personalized tips
def personalized_tip(study_hours, topics, quiz, progress):
    tips = []

    if study_hours < 8:
        tips.append("⏰ Try to increase your daily study hours.")
    elif study_hours >= 15:
        tips.append("✅ Great study routine! Stay balanced.")

    if topics < 25:
        tips.append("🧠 Cover more topics for better grip.")
    elif topics >= 40:
        tips.append("📚 You're covering a lot, nice going!")

    if quiz < 40:
        tips.append("📝 Consider practicing quizzes more often.")
    elif quiz >= 50:
        tips.append("🥇 Strong quiz scores! Keep it up.")

    if progress >= 80:
        tips.append("🚀 Excellent progress overall!")
    elif progress >= 60:
        tips.append("📈 You're doing well, a bit more push!")
    else:
        tips.append("🛠️ Time to restructure your study plan.")

    return " ".join(tips[:3])  # Keep it short — pick the top 3 tips

# Display Results
print("📊 Personalized Progress Predictions:\n")
for i, (row, progress) in enumerate(zip(input_data, predicted_progress)):
    study_hours, topics, quiz = row
    tip = personalized_tip(study_hours, topics, quiz, progress)
    
    print(f"🔹 Prediction {i+1}: {progress:.2f}%")
    print(f"💡 Tip: {tip}\n")
print("🔍 Note: This is a simulated prediction. For accurate results, use real data.")                