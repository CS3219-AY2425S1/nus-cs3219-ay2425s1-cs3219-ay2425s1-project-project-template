const { db } = require("../config/firebaseConfig");
const moment = require("moment-timezone");

const getAllQuestions = async (req, res) => {
  try {
    const questionsRef = db.collection("questions");
    const snapshot = await questionsRef.get();
    const questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getQuestionsOfTopicAndDifficulty = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res
        .status(400)
        .json({ message: "Both topic and difficulty are required" });
    }

    const questionsRef = db.collection("questions");
    const query = questionsRef
      .where("topics", "array-contains", topic)
      .where("difficulty", "==", difficulty);
    const snapshot = await query.get();
    const questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createQuestion = async (req, res) => {
  try {
    const questionData = req.body;
    const {
      title,
      description,
      difficulty,
      topics,
      examples = [],
      constraints = [],
    } = questionData;

    if (!title || !description || !difficulty || !topics) {
      return res
        .status(400)
        .json({
          message:
            "All of title, description, difficulty and topics are required",
        });
    }

    // Check for duplicates (we define duplicates as either having same title or same description)
    const questionsRef = db.collection("questions");

    // Query to check for the same title
    const titleQuery = questionsRef.where("title", "==", title);
    const titleSnapshot = await titleQuery.get();
    if (!titleSnapshot.empty) {
      return res
        .status(400)
        .json({ message: "A question with this title already exists" });
    }

    // Query to check for the same description
    const descriptionQuery = questionsRef.where(
      "description",
      "==",
      description
    );
    const descriptionSnapshot = await descriptionQuery.get();
    if (!descriptionSnapshot.empty) {
      return res
        .status(400)
        .json({ message: "A question with this description already exists" });
    }

    // Add new question to database
    const dateCreated = moment().tz("Asia/Singapore").format(); // Gets the current time in Singapore Time
    const questionDataWithDateCreated = {
      title,
      description,
      difficulty,
      topics,
      examples, // Ensure this field is always included
      constraints, // Ensure this field is always included
      dateCreated,
    };
    const newQuestionRef = await db
      .collection("questions")
      .add(questionDataWithDateCreated);
    res
      .status(201)
      .json({ id: newQuestionRef.id, ...questionDataWithDateCreated });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Question id is required" });
    }

    const questionsRef = db.collection("questions").doc(id);
    await questionsRef.delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllQuestions,
  getQuestionsOfTopicAndDifficulty,
  createQuestion,
  deleteQuestion,
};
