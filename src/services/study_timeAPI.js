
// Study Time Prediction API Call
export const predictStudyTime = async (inputData) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/study-time", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputData),
        });

        const data = await response.json();
        console.log(data);
        return data; 
    } catch (error) {
        console.error("Error:", error);
        return { error: "Failed to fetch prediction" };
    }
};
