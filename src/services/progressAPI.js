export const predictProgress = async (inputData) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/progress-prediction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return { status: "error", message: "Failed to fetch progress prediction." };
    }
};
