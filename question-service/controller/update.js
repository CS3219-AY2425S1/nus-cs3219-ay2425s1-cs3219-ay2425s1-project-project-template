import Question from '../model/Question.js';

export const updateQuestion = async (req, res) => {
    try {
      const id = req.params.id;
      const filter = {
        id: id
      }
      const update = req.body;
      const question = await Question.findOneAndUpdate(filter, update, {
        new: true
      });
      return res.status(200).json(question);;
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: `Unknown error when updating question with ID ${id}!` });
    }
};