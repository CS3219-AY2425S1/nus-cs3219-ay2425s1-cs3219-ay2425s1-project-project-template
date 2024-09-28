import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import ErrorMessage from './ErrorMessageDialog'
import questionService from '../services/question-service';
import '../styles/create-question-dialog.css';

const difficulty_lvl = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' }
];

const EditQuestion = ({ open, handleClose, question }) => {
    const [questionData, setQuestionData] = React.useState({
      title: question?.title || '',
      description: question?.description || '',
      topic: question?.topic.join(', ') || '', // Convert array to comma-separated string
      difficulty: question?.difficulty || 'Easy',
      input: question?.input || '',
      expected_output: question?.expected_output || '',
      images: question?.images?.join(', ') || '', // Assuming images is an array, convert to comma-separated string
      leetcode_link: question?.leetcode_link || ''
    });

    const [imageFiles, setImageFiles] = React.useState([]);
    const [errorOpen, setErrorOpen] = React.useState(false); // State to control error dialog visibility
    const [errorMessage, setErrorMessage] = React.useState(''); // State to store error message

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setQuestionData({ ...questionData, [name]: value });
    };

    const handleDifficultyChange = (event) => {
      setQuestionData({ ...questionData, difficulty: event.target.value });
    };

    const handleImageFilesChange = (event) => {
      setImageFiles(event.target.files);
    };
    
    const handleErrorClose = () => {
      setErrorOpen(false); // Close the error dialog
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const updatedQuestionData = {
          ...questionData,
          topic: questionData.topic.split(',').map((t) => t.trim()), // Convert topics back to array
          images: questionData.images.split(',').map((img) => img.trim()) // Convert images back to array
      };
  
      const formData = new FormData();
      for (const key in updatedQuestionData) {
          if (Array.isArray(updatedQuestionData[key])) {
              updatedQuestionData[key].forEach(item => formData.append(key, item));
          } else {
              formData.append(key, updatedQuestionData[key]);
          }
      }
  
      for (let i = 0; i < imageFiles.length; i++) {
          formData.append('imageFiles', imageFiles[i]);
      }
  
      try {
          await questionService.updateQuestion(question._id, formData); // Assuming updateQuestion handles the API request for updating
          window.location.reload(); // Refresh the page after the update
          handleClose();
      } catch (error) {
          setErrorMessage('Error updating question: ' + error);
          setErrorOpen(true); // Open error dialog
      }
    };
    
    return (
      <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title">Edit Question</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              multiline
              value={questionData.title}
              onChange={handleInputChange}
              className="text-field"
            />
            <TextField
              margin="dense"
              required
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              minRows={4}
              maxRows={16}
              value={questionData.description}
              onChange={handleInputChange}
              className="text-field"
            />
            <TextField
              margin="dense"
              required
              id="topic"
              name="topic"
              label="Topics (comma separated)"
              type="text"
              fullWidth
              multiline
              value={questionData.topic}
              onChange={handleInputChange}
              className="text-field"
            />
            <TextField
              margin="dense"
              fullWidth
              id="difficulty"
              select
              label="Difficulty Level"
              value={questionData.difficulty}
              onChange={handleDifficultyChange}
              helperText="Select the difficulty level"
              className="text-field"
            >
              {difficulty_lvl.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              required
              id="input"
              name="input"
              label="Input"
              type="text"
              fullWidth
              multiline
              maxRows={16}
              value={questionData.input}
              onChange={handleInputChange}
              className="text-field"
            />
            <TextField
              margin="dense"
              required
              id="expected_output"
              name="expected_output"
              label="Expected Output"
              type="text"
              fullWidth
              multiline
              maxRows={16}
              value={questionData.expected_output}
              onChange={handleInputChange}
              className="text-field"
            />
            <TextField
              margin="dense"
              id="images"
              name="images"
              label="Images (URLs)"
              type="text"
              fullWidth
              multiline
              value={questionData.images}
              onChange={handleInputChange}
              className="text-field"
            />
            <TextField
              margin="dense"
              id="leetcode_link"
              name="leetcode_link"
              label="Leetcode Link"
              type="text"
              fullWidth
              multiline
              value={questionData.leetcode_link}
              onChange={handleInputChange}
              className="text-field"
            />
            <input
              type="file"
              id="imageFiles"
              name="imageFiles"
              multiple
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleImageFilesChange}
              className="file-input"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className="dialog-actions">Cancel</Button>
            <Button type="submit" className="dialog-actions">Update Question</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ErrorMessage
                open={errorOpen}
                handleClose={handleErrorClose}
                errorMessage={errorMessage}
            />
      </>
    );
  };

export default EditQuestion;