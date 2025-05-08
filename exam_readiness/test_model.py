# # load_model_and_predict.py

import pickle
import numpy as np

# Load the saved model and label encoder
# with open('exam_readiness_score_model.pkl', 'rb') as f:
#     model = pickle.load(f)
# with open('label_encoder.pkl', 'rb') as f:
#     label_encoder = pickle.load(f)

# # New test data (study consistency, past test scores, recent study hours)
# study_consistency = [8]  # Scale of 1-10 (8 = good consistency)
# past_test_scores = [70]  # Previous test score (percentage)
# recent_study_hours = [10]  # Hours studied recently (e.g., in last week)

# # Prepare the input for prediction
# X_test = np.array([study_consistency, past_test_scores, recent_study_hours]).T

# # Predict readiness score
# readiness = model.predict(X_test)
# readiness_label = label_encoder.inverse_transform(readiness)

# # Output the result
# print(f"Predicted Exam Readiness: {readiness_label[0]}")
if __name__ == '__main__':
    # Sample training data
    study_consistency = [8, 6, 9]
    past_test_scores = [85, 65, 90]
    recent_study_hours = [10, 5, 15]
    readiness_score_labels = ['High', 'Medium', 'High']

    # Load the saved model and label encoder
with open('exam_readiness_score_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)
    model.train_model(study_consistency, past_test_scores, recent_study_hours, readiness_score_labels)

    # Test input (simulated user input)
    test_data = [[6, 68, 4]]  # study_consistency, past_test_score, recent_study_hours
    sc, pts, rsh = test_data[0]

    # Prediction (label)
    readiness = model.predict_readiness(test_data)[0]

    # Prediction (score)
    probas = model.model.predict_proba(test_data)[0]
    score_percent = round(max(probas) * 100, 1)

    # Icons
    icons = {
        'High': "📘",
        'Medium': "📗",
        'Low': "📕"
    }

    # Tip generator (simple, personalized)
    def generate_tips(sc, pts, rsh, level):
        tips = []
        if level == 'High':
            tips.append("Great consistency! Keep going 💪")
            if rsh >= 10:
                tips.append("Your recent efforts are paying off ⏰")
        elif level == 'Medium':
            if rsh < 6:
                tips.append("Try studying 1-2 hours more daily ⌛")
            if sc < 6:
                tips.append("Add small goals to stay consistent 🎯")
            if pts < 70:
                tips.append("Quick review of key topics can boost confidence 📖")
        else:  # Low
            tips.append("Start small – even 30 mins daily helps 🧱")
            if pts < 60:
                tips.append("Focus on weak areas with smart revision 🧠")
            tips.append("Use a fixed routine for better focus 📅")
        return tips[:3]  # Max 3 tips

    # Display
    print(f"{icons[readiness]} Predicted Exam Readiness: {readiness} ({score_percent}%)")
    print("💡 Tips:")
    for tip in generate_tips(sc, pts, rsh, readiness):
        print(f"- {tip}")
    print("🔍 Note: This is a simulated prediction. For accurate results, use real data.")