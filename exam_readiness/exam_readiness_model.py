# exam_readiness_score_model.py

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import pickle

class ExamReadinessScoreModel:
    def __init__(self):
        self.model = LogisticRegression()
        self.label_encoder = LabelEncoder()

    def prepare_data(self, study_consistency, past_test_scores, recent_study_hours, readiness_score_labels):
        """
        Prepare input features and target labels for training the model.
        - study_consistency: Consistency of the student’s study habits (e.g., scale of 1-10).
        - past_test_scores: Previous test scores (e.g., percentage).
        - recent_study_hours: Hours studied recently (e.g., hours in the last 7 days).
        - readiness_score_labels: The actual readiness scores (Low, Medium, High).
        """
        # Combine features into a single dataset
        X = np.array([study_consistency, past_test_scores, recent_study_hours]).T
        
        # Convert the labels (Low, Medium, High) into numerical values
        y = self.label_encoder.fit_transform(readiness_score_labels)
        
        return X, y

    def train_model(self, study_consistency, past_test_scores, recent_study_hours, readiness_score_labels):
        """
        Train the model using input data.
        """
        X, y = self.prepare_data(study_consistency, past_test_scores, recent_study_hours, readiness_score_labels)
        self.model.fit(X, y)

        # Save the trained model and label encoder to disk
        with open('exam_readiness_score_model.pkl', 'wb') as f:
            pickle.dump(self.model, f)
        with open('label_encoder.pkl', 'wb') as f:
            pickle.dump(self.label_encoder, f)
        print("Model trained and saved.")

    def predict_readiness(self, study_consistency, past_test_scores, recent_study_hours):
        """
        Predict the exam readiness score.
        """
        X = np.array([study_consistency, past_test_scores, recent_study_hours]).T
        prediction = self.model.predict(X)
        return self.label_encoder.inverse_transform(prediction)


# Sample usage
# if __name__ == '__main__':
#     # Example data (should come from your MongoDB or user input)
#     study_consistency = [8, 6, 9]  # Scale of 1-10 (8 = good consistency, 6 = moderate, 9 = excellent)
#     past_test_scores = [85, 65, 90]  # Previous test scores (percentage)
#     recent_study_hours = [10, 5, 15]  # Hours studied recently (e.g., in last week)
#     readiness_score_labels = ['High', 'Medium', 'High']  # Actual labels for the training set

#     # Create and train the model
#     model = ExamReadinessScoreModel()
#     model.train_model(study_consistency, past_test_scores, recent_study_hours, readiness_score_labels)
    
#     # Example prediction
#     test_data = [8, 70, 10]  # Test data (study consistency = 8, past test score = 70%, recent hours = 10)
#     readiness = model.predict_readiness([test_data])
#     print(f"Predicted Exam Readiness: {readiness[0]}")
