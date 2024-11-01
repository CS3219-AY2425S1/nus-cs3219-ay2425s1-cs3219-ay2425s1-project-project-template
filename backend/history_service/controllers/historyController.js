const { db, FieldValue } = require("../config/firebaseConfig");
const moment = require("moment-timezone");

const getAllAttemptedQuestions = async (req, res) => {
    const { uid } = req.body;

    try {
        const usersRef = db.collection("users").doc(uid);
        const userDoc = await usersRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve and filter questionsAttempted array
        let questionsAttempted = userDoc.data().questionsAttempted || [];
        const cutoffDate = moment().tz("Asia/Singapore").subtract(180, 'days'); // 180 days ago in Singapore time

        // Filter away entries older than 180 days
        questionsAttempted = questionsAttempted.filter(attempt => {
            const attemptDate = moment(attempt.dateAttempted);
            return attemptDate.isSameOrAfter(cutoffDate);
        });

        // Update the document with the filtered array to remove old entries
        await usersRef.update({ questionsAttempted });

        // Extract unique question UIDs from the filtered attempts
        const questionUids = [...new Set(questionsAttempted.map(attempt => attempt.questionUid))];

        // Fetch question information from question_service 
        // const questionServiceUrl = process.env.QUESTION_SERVICE_URL || "http://localhost:5002/get-questions-by-questionuids";
        // const questionResponse = await fetch(questionServiceUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ questionUids })
        // });

        // if (!questionResponse.ok) {
        //     return res.status(500).json({ message: "Error retrieving question information" });
        // }

        // const questionData = await questionResponse.json();
        
        const questionsRef = db.collection("questions");

        // Fetch questions based on their questionUids using Promise.all for concurrent requests
        const questionsData = await Promise.all(
            questionUids.map(questionUid => questionsRef.doc(questionUid).get())
        );

        // Convert query results into an array of question data
        const questionData = questionsData.map(doc => ({ id: doc.id, ...doc.data() }));

        // Create a map for quick lookup of question details by questionUid
        const questionMap = {};
        questionData.forEach(question => {
            questionMap[question.id] = question;
        });

        // Combine question information with attempt date&time and code written
        const result = questionsAttempted.map(attempt => ({
            ...questionMap[attempt.questionUid],
            dateAttempted: attempt.dateAttempted,
            codeWritten: attempt.codeWritten
        }));

        // Send the result back to the frontend
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createQuestionAttempted = async (req, res) => {
    const { userUid, questionUid, dateAttempted } = req.body;

    try {
        const userRef = db.collection("users").doc(userUid);

        const userDoc = await userRef.get();

        // Check if the user document exists
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Prepare the new entry to add
        const newAttempt = {
            questionUid: questionUid,
            dateAttempted: dateAttempted
        };

        // Update the questionsAttempted field by adding the new attempt
        await userRef.update({
            questionsAttempted: FieldValue.arrayUnion(newAttempt)
        });

        res.status(200).json({ message: "Attempt recorded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const storeExecutedCode = async (req, res) => {
    const { userUid, questionUid, dateAttempted, codeWritten } = req.body;

    try {
        const userRef = db.collection("users").doc(userUid);

        const userDoc = await userRef.get();

        // Check if the user document exists
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve the current questionsAttempted array
        const questionsAttempted = userDoc.data().questionsAttempted || [];

        // Find the index of the entry to update
        const index = questionsAttempted.findIndex(attempt => 
            attempt.questionUid === questionUid && 
            attempt.dateAttempted === dateAttempted
        );

        // Check if the entry exists
        if (index === -1) {
            return res.status(404).json({ message: "Attempt entry not found" });
        }

        // Create a new array with the updated entry
        const updatedQuestionsAttempted = [
            ...questionsAttempted.slice(0, index), // Entries before the index
            { 
                ...questionsAttempted[index], // Keep the existing fields
                codeWritten: codeWritten // Update the codeWritten
            },
            ...questionsAttempted.slice(index + 1) // Entries after the index
        ];

        // Update the user's document with the new questionsAttempted array
        await userRef.update({
            questionsAttempted: updatedQuestionsAttempted
        });

        res.status(200).json({ message: "Executed code stored successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAttemptedQuestions,
    createQuestionAttempted,
    storeExecutedCode,
};
