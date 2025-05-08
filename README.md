# 📘 Intelligent Study Planner (Prototype)

This is an intelligent, personalized study planner web application built using **React.js**, **Node.js**, and **Machine Learning models**. It helps students efficiently plan, track, and optimize their study schedule based on their unique learning preferences, pace, and goals.

---

## 🚀 Features

### 🔹 General Features:
- 🧠 **Task, Assignment & Exam Tracker**: Add and manage academic tasks, assignments, and exams with due dates.
- 🧪 **Progress Tracking**: View daily/weekly completion percentages and subjects pending.
- 🧘‍♀️ **Relaxation Corner**: Small games, music, and motivational quotes for mental refreshment.
- 💧 **Water Intake Tracker**: Encourages hydration during study sessions.
- 🕒 **Focus Timer (Pomodoro)**: Time your study sessions with break intervals.
- 📓 **Notes & Quick Tasks**: Jot down instant ideas or notes while studying.
- 👤 **Profile System**: Tracks user preferences, learning speeds, and personalized plans.

---

## 🧠 Machine Learning Features

### 1. 📊 **Adaptive Study Plan Generator**
- Predicts personalized study hours per subject using:
  - Past study logs
  - Subject difficulty
  - Days left
  - User's focus level
  - Weak subjects
  - Learning speed
- Models used: `Linear Regression` and `Random Forest Regressor`

### 2. ⏱️ **Time Requirement Predictor**
- Predicts how many hours are *actually needed* per subject to meet study goals.
- Learns from user habits and subject complexity.

### 3. 🟢 **Exam Readiness Predictor**
- Classifies user readiness (Low / Medium / High) using:
  - % of syllabus done
  - Study consistency
  - Time left vs. required time

### 4. ⚠️ **Weak Subject Detector**
- Detects which subjects need more attention.
- Flags them based on:
  - User feedback
  - Time spent vs. actual required
  - Missed deadlines

### 5. 📈 **Progress Predictor**
- Predicts if user will meet their study goals at current pace.
- Suggests changes if necessary.

---

## 💡 Future Scope

> 🚧 This project is still a **prototype**, and I'm actively working on improvements!

Planned enhancements:
- ✅ Natural Language Goal Input (NLP)
- ✅ Chatbot Assistant for study help
- ✅ Google Calendar sync
- ✅ Gamification & Reward Badges
- ✅ Dynamic feedback-based ML model retraining
- ✅ Daily smart notifications
- ✅ Graph-based data visualization (readiness, time distribution, etc.)

---

## 🛠️ Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Machine Learning**: Python (Scikit-learn, Pandas)
- **Others**: JWT Authentication, REST APIs, Cloudinary (for uploads)

---

## 📦 How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/SShreeC/studyPlanner
cd studyPlanner
```

### 2. Run Frontend
```bash
cd my-app
npm start
```

### 3.Run backend(Node)
```bash
cd my-app
node server.js
```

### 4. Run flask API (for ML models)
```bash
python3 -m venv venv
source venv/bin/activate      # For Windows: venv\Scripts\activate
python app.py    
```                    
