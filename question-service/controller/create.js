import Question from '../model/Question.js';

export const createNewQuestion = async (req, res) => {
    try {
      const { title, description, topics, difficulty } = req.params.body;
      const question = new Question({
        title: title,
        description: description,
        topics: topics,
        difficulty: difficulty,
  
      });
      return res.status(200).json(questions);;
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unknown error when finding all questions!" });
    }
};