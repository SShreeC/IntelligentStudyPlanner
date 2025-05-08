# import joblib
# import numpy as np
# import pandas as pd
# from sklearn.linear_model import LogisticRegression
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score, classification_report
# from sklearn.preprocessing import StandardScaler

# # Define the Weak Subject Identification Model class
# class WeakSubjectModel:
#     def __init__(self):
#         self.model = LogisticRegression()  # Logistic Regression for binary classification
#         self.scaler = StandardScaler()  # StandardScaler to scale features

#     # Train the model on the data
#     def train(self, X_train, y_train):
#         # Fit the scaler to the training data
#         X_train_scaled = self.scaler.fit_transform(X_train)
#         self.model.fit(X_train_scaled, y_train)

#     # Predict if a student is weak in the subject (1 = weak, 0 = not weak)
#     def predict(self, X_test):
#         # Scale the test data before prediction
#         X_test_scaled = self.scaler.transform(X_test)
#         return self.model.predict(X_test_scaled)

#     # Evaluate the model using accuracy and other metrics
#     def evaluate(self, X_test, y_test):
#         X_test_scaled = self.scaler.transform(X_test)
#         predictions = self.model.predict(X_test_scaled)
#         accuracy = accuracy_score(y_test, predictions)
#         report = classification_report(y_test, predictions)
#         return accuracy, report

#     # Predict for a single set of user inputs
#     def predict_user_input(self, study_hours, topics_covered, quiz_scores, time_per_question):
#         # Validate inputs
#         if not self.is_valid_input(study_hours, topics_covered, quiz_scores, time_per_question):
#             return "Invalid input. Please provide positive values for all parameters."

#         # Scale and predict based on the user input
#         input_data = np.array([[study_hours, topics_covered, quiz_scores, time_per_question]])
#         input_scaled = self.scaler.transform(input_data)  # Scale the input data
#         prediction = self.model.predict(input_scaled)
        
#         # Output prediction
#         if prediction[0] == 1:
#             return "The student is weak in the subject."
#         else:
#             return "The student is not weak in the subject."

#     # Validate inputs (check for valid positive numbers)
#     def is_valid_input(self, study_hours, topics_covered, quiz_scores, time_per_question):
#         # Ensure all inputs are positive numbers
#         if study_hours < 0 or topics_covered < 0 or quiz_scores < 0 or time_per_question < 0:
#             return False
#         return True


# # Example data (this data would ideally come from your database)
# # Columns: Study hours, Topics covered, Quiz scores, Time per question
# # Target: Weak subject identification (1 = weak, 0 = not weak)
# data = {
#     'study_hours': [10, 15, 20, 30, 25, 35, 40, 50, 60],
#     'topics_covered': [5, 7, 8, 12, 10, 15, 18, 20, 22],
#     'quiz_scores': [60, 70, 75, 80, 85, 90, 95, 92, 96],
#     'time_per_question': [2, 1.8, 2.5, 1.5, 1.6, 1.4, 1.3, 1.2, 1.1],
#     'weak_subject': [1, 0, 0, 0, 0, 0, 0, 0, 0]  # Target variable (1 = weak subject, 0 = not weak)
# }

# # Convert data into a DataFrame
# df = pd.DataFrame(data)

# # Features (study hours, topics covered, quiz scores, time per question)
# X = df[['study_hours', 'topics_covered', 'quiz_scores', 'time_per_question']]

# # Target (weak subject identification)
# y = df['weak_subject']

# # Split the data into training and testing sets (80% train, 20% test)
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Create and train the model
# model = WeakSubjectModel()
# model.train(X_train, y_train)

# # Evaluate the model on test data
# accuracy, report = model.evaluate(X_test, y_test)
# print(f"Accuracy: {accuracy * 100:.2f}%")
# print("Classification Report:")
# print(report)

# # Example: Predict if the student is weak in the subject (with proper user input validation)
# study_hours = 12
# topics_covered = 2
# quiz_scores = 45
# time_per_question = 1.7

# # Save both model and scaler
# joblib.dump(model.model, 'weak_subject_model.pkl')  # Save the model
# joblib.dump(model.scaler, 'scaler.pkl')  # Save the scaler
# print("Model and scaler saved as 'weak_subject_model.pkl' and 'scaler.pkl'")

# # Predict using the model
# result = model.predict_user_input(study_hours, topics_covered, quiz_scores, time_per_question)
# print(result)
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

# Define the Weak Subject Identification Model class
class WeakSubjectModel:
    def __init__(self):
        self.model = LogisticRegression()  # Logistic Regression for binary classification
        self.scaler = StandardScaler()  # StandardScaler to scale features

    # Train the model on the data
    def train(self, X_train, y_train):
        # Fit the scaler to the training data
        X_train_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_train_scaled, y_train)

    # Predict if a student is weak in the subject (1 = weak, 0 = not weak)
    def predict(self, X_test):
        # Scale the test data before prediction
        X_test_scaled = self.scaler.transform(X_test)
        return self.model.predict(X_test_scaled)

    # Evaluate the model using accuracy and other metrics
    def evaluate(self, X_test, y_test):
        X_test_scaled = self.scaler.transform(X_test)
        predictions = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, predictions)
        report = classification_report(y_test, predictions)
        return accuracy, report

    # Predict for a single set of user inputs with tips
    def predict_user_input(self, study_hours, topics_covered, quiz_scores, time_per_question):
        # Validate inputs
        if not self.is_valid_input(study_hours, topics_covered, quiz_scores, time_per_question):
            return "❌ Invalid input. Please provide positive values for all parameters."

        # Scale and predict based on the user input
        input_data = np.array([[study_hours, topics_covered, quiz_scores, time_per_question]])
        input_scaled = self.scaler.transform(input_data)  # Scale the input data
        prediction = self.model.predict(input_scaled)
        
        # Output prediction with personalized feedback
        result = "The student is weak in the subject." if prediction[0] == 1 else "The student is not weak in the subject."
        tips = self.generate_tips(study_hours, topics_covered, quiz_scores, time_per_question, prediction[0])

        return f"💡 Prediction: {result}\n{tips}"

    # Generate personalized tips based on user input and prediction result
    def generate_tips(self, study_hours, topics_covered, quiz_scores, time_per_question, is_weak):
        # Tips for weak subjects
        if is_weak == 1:
            tips = [
                "🔴 Study hours seem insufficient. Try to dedicate more time to the subject.",
                "📝 Review topics that were less covered. Prioritize weak areas.",
                "⚡ Try solving more quizzes for practice, focus on accuracy."
            ]
        else:
            tips = [
                "✅ Well done! Keep up the good work.",
                "💡 Continue your progress by maintaining your study routine.",
                "📚 Regular revision and self-assessment will help you stay strong."
            ]
        
        # Adding some input-specific advice
        if study_hours < 5:
            tips.append("⏳ Increasing study hours can boost your performance.")
        if topics_covered < 5:
            tips.append("📊 Focus on covering more topics to get a broader understanding.")
        if quiz_scores < 60:
            tips.append("📝 Aim to improve your quiz scores through practice and time management.")
        if time_per_question > 2:
            tips.append("⏱️ Try to solve questions more quickly to improve time efficiency.")
        
        return "\n".join(tips)

    # Validate inputs (check for valid positive numbers)
    def is_valid_input(self, study_hours, topics_covered, quiz_scores, time_per_question):
        if study_hours < 0 or topics_covered < 0 or quiz_scores < 0 or time_per_question < 0:
            return False
        return True


# Example data (this data would ideally come from your database)
data = {
    'study_hours': [10, 15, 20, 30, 25, 35, 40, 50, 60],
    'topics_covered': [5, 7, 8, 12, 10, 15, 18, 20, 22],
    'quiz_scores': [60, 70, 75, 80, 85, 90, 95, 92, 96],
    'time_per_question': [2, 1.8, 2.5, 1.5, 1.6, 1.4, 1.3, 1.2, 1.1],
    'weak_subject': [1, 0, 0, 0, 0, 0, 0, 0, 0]  # Target variable (1 = weak subject, 0 = not weak)
}

# Convert data into a DataFrame
df = pd.DataFrame(data)

# Features (study hours, topics covered, quiz scores, time per question)
X = df[['study_hours', 'topics_covered', 'quiz_scores', 'time_per_question']]

# Target (weak subject identification)
y = df['weak_subject']

# Split the data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the model
model = WeakSubjectModel()
model.train(X_train, y_train)

# Evaluate the model on test data
accuracy, report = model.evaluate(X_test, y_test)
print(f"🎯 Accuracy: {accuracy * 100:.2f}%")
print("📋 Classification Report:")
print(report)

# Example: Predict if the student is weak in the subject (with proper user input validation)
study_hours = 12
topics_covered = 2
quiz_scores = 45
time_per_question = 1.7

# Save both model and scaler
joblib.dump(model.model, 'weak_subject_model.pkl')  # Save the model
joblib.dump(model.scaler, 'scaler.pkl')  # Save the scaler
print("✅ Model and scaler saved as 'weak_subject_model.pkl' and 'scaler.pkl'")

# Predict using the model
result = model.predict_user_input(study_hours, topics_covered, quiz_scores, time_per_question)
print(result)
print("🔍 Note: This is a simulated prediction. For accurate results, use real data.")