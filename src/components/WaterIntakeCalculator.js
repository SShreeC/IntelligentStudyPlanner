import React, { useState } from 'react';
import './CV.css';
import waterImage from '../media/water.png'; // Import the water image

const WaterIntakeCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [waterIntakeCups, setWaterIntakeCups] = useState(null);

  // 1 liter = approximately 4.22675 cups
  const calculateWaterIntake = () => {
    let intakeInLiters = 0;
    if (weight && height && age && gender) {
      const weightInKg = parseFloat(weight);
      if (gender === 'male') {
        intakeInLiters = (weightInKg * 35) / 1000; // Adjusted for men
      } else {
        intakeInLiters = (weightInKg * 31) / 1000; // Adjusted for women
      }
      const intakeInCups = intakeInLiters * 4.22675;
      setWaterIntakeCups(Math.round(intakeInCups)); // Round to nearest cup
    } else {
      alert('Please fill in all fields correctly!');
    }
  };

  return (
    <div className="water-intake-container">
      <h2>Water Intake Calculator</h2>
      <div className="input-group">
        <label>Weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter your weight in kg"
        />
      </div>
      <div className="input-group">
        <label>Height (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter your height in cm"
        />
      </div>
      <div className="input-group">
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </div>
      <div className="input-group">
        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <button className="calculate-button" onClick={calculateWaterIntake}>
        Calculate Water Intake
      </button>

      {waterIntakeCups && (
        <div className="result">
          <h3>Recommended Daily Water Intake: {waterIntakeCups} Cups</h3>
          <div className="cup-icons">
            {[...Array(waterIntakeCups)].map((_, index) => (
              <img key={index} src={waterImage} alt="Water Cup" className="cup-icon" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeCalculator;
