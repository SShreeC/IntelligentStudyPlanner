

import pickle
import numpy as np
from adaptive_study_plan_model import AdaptiveStudyPlanModel

# Load the saved model
with open('adaptive_study_plan_model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

# Example Inputs (can be replaced by user input)
subjects = ["Math", "Physics", "Chemistry"]
study_logs = [5, 3, 6]          # Past hours studied
subject_difficulty = [2, 3, 1]  # 1 (easy) to 5 (hard)
time_left = 30                  # Days until the exam

# Prepare input features
features = np.array([[log, diff, time_left] for log, diff in zip(study_logs, subject_difficulty)])

# Predict using loaded model
predicted_plan = loaded_model.predict(features)

# Show predictions with insights
print("\n📊 Predicted Study Hours Allocation:\n")
for subject, hours, diff in zip(subjects, predicted_plan, subject_difficulty):
    print(f"🔹 {subject}: {hours:.1f} hours (Difficulty: {diff}/5)")
    
    # Personalized tip
    if diff >= 4:
        print("   👉 Focus more on this subject. It's challenging.")
    elif hours < 3:
        print("   ✅ You're doing well. Just keep reviewing regularly.")
    else:
        print("   📝 Keep up consistent practice.")

# Final Motivational Note
print("\n✨ Tip: Break long sessions into short ones. Stay consistent.\n🎯 You’ve got this! All the best for your exams!\n")
