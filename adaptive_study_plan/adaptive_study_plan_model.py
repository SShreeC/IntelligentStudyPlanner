# # adaptive_study_plan_model.py

# import numpy as np
# from sklearn.linear_model import LinearRegression
# import pickle

# class AdaptiveStudyPlanModel:
#     def __init__(self):
#         self.model = LinearRegression()

#     def prepare_data(self, study_logs, subject_difficulty, time_left):
#         """
#         Prepare the input data to be used for training the model.
#         - study_logs: List of hours spent on each subject (e.g., [5, 3, 6])
#         - subject_difficulty: List of difficulty scores for each subject (e.g., [2, 3, 1])
#         - time_left: Number of days left until the exam (e.g., 30)
#         """
#         # Creating features: [hours spent, subject difficulty, time left before exam]
#         X = np.array([study_logs, subject_difficulty, [time_left] * len(study_logs)]).T

#         # Creating target: predicted study time per subject (you would have this from historical data)
#         # For simplicity, I'm using a random target, replace it with actual study hours for each subject
#         y = np.array([5, 3, 6])  # Predicted hours for subjects (replace this with your target)

#         return X, y

#     def train_model(self, study_logs, subject_difficulty, time_left):
#         """
#         Train the model based on input data
#         """
#         X, y = self.prepare_data(study_logs, subject_difficulty, time_left)
#         self.model.fit(X, y)

#         # Save the model to disk
#         with open('adaptive_study_plan_model.pkl', 'wb') as f:
#             pickle.dump(self.model, f)
#         print("Model trained and saved.")

#     def predict_study_plan(self, study_logs, subject_difficulty, time_left):
#         """
#         Predict study hours allocation for each subject.
#         """
#         X, _ = self.prepare_data(study_logs, subject_difficulty, time_left)
#         return self.model.predict(X)


# # Sample usage
# if __name__ == '__main__':
#     # Example data (should come from your MongoDB or user input)
#     study_logs = [5, 3, 6]  # Example: 5 hours for Math, 3 for Physics, 6 for Chemistry
#     subject_difficulty = [2, 3, 1]  # Example: difficulty rating for each subject (Math=2, Physics=3, Chemistry=1)
#     time_left = 30  # Days left until the exam
    
#     # Create and train the model
#     model = AdaptiveStudyPlanModel()
#     model.train_model(study_logs, subject_difficulty, time_left)
    
#     # Example prediction
#     predicted_plan = model.predict_study_plan(study_logs, subject_difficulty, time_left)
#     print(f"Predicted Study Hours per Subject: {predicted_plan}")
# adaptive_study_plan_model.py

import numpy as np
import pickle
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

class AdaptiveStudyPlanModel:
    def __init__(self, model_type='linear'):
        """
        model_type: 'linear' for Linear Regression, 'forest' for Random Forest
        """
        self.model_type = model_type
        if model_type == 'forest':
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        else:
            self.model = LinearRegression()

    def prepare_data(self, study_logs, subject_difficulty, time_left, target_hours):
        """
        study_logs: List of lists -> [[5, 2, 30], [3, 3, 30], [6, 1, 30], ...]
        target_hours: List -> actual required hours [6, 7, 5, ...]
        """
        X = np.array(study_logs)
        y = np.array(target_hours)
        return X, y

    def train_model(self, study_logs, subject_difficulty, days_left, target_hours):
        """
        Train model using real/historical data
        """
        # Combine all features
        data = [[log, diff, days] for log, diff, days in zip(study_logs, subject_difficulty, days_left)]
        X, y = self.prepare_data(data, subject_difficulty, days_left, target_hours)

        # Optionally test accuracy (on small sample)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)
        predictions = self.model.predict(X_test)
        mse = mean_squared_error(y_test, predictions)
        print(f"Model trained. Test MSE: {mse:.2f}")

        # Save model
        with open('adaptive_study_plan_model.pkl', 'wb') as f:
            pickle.dump(self.model, f)

    def predict_study_plan(self, study_logs, subject_difficulty, time_left):
        """
        Predict study time per subject
        """
        features = np.array([[log, diff, time_left] for log, diff in zip(study_logs, subject_difficulty)])
        return self.model.predict(features)
if __name__ == '__main__':
    # Suppose we collected this historical data:
    # Inputs: [past_hours, difficulty, days_left]
    study_logs = [5, 3, 6, 2, 4]
    subject_difficulty = [2, 3, 1, 4, 3]
    days_left = [30, 30, 30, 30, 30]
    actual_required_hours = [6, 7, 5, 8, 6]  # Target study time per subject from real usage

    model = AdaptiveStudyPlanModel(model_type='forest')  # Try 'linear' or 'forest'
    model.train_model(study_logs, subject_difficulty, days_left, actual_required_hours)

    # Predict for a new student
    new_study_logs = [2, 1, 3]
    new_difficulty = [3, 5, 2]
    time_left = 15
    predicted = model.predict_study_plan(new_study_logs, new_difficulty, time_left)
    print("Predicted study hours per subject:", predicted)
