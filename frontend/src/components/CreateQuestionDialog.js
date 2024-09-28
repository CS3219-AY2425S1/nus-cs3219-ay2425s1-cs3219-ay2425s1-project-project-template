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

const CreateQuestion = ({ open, handleClose }) => {
    const [difficulty, setDifficulty] = React.useState('Easy'); // Default difficulty
    const [imageFiles, setImageFiles] = React.useState([]); // State to hold image files
    const [errorOpen, setErrorOpen] = React.useState(false); // State to control error dialog visibility
    const [errorMessage, setErrorMessage] = React.useState(''); // State to store error message

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleImageFilesChange = (event) => {
        setImageFiles(event.target.files);
    };

    const handleErrorClose = () => {
        setErrorOpen(false); // Close the error dialog
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        const formElements = event.currentTarget.elements;

        // Append each topic individually
        const topics = formElements.topic.value.split(',').map(topic => topic.trim());
        topics.forEach(topic => formData.append('topic', topic));

        // Append each image URL individually
        const images = formElements.images.value.split(',').map(image => image.trim());
        images.forEach(image => formData.append('images', image));

        formData.append('title', formElements.title.value);
        formData.append('description', formElements.description.value);
        formData.append('difficulty', difficulty);
        formData.append('input', formElements.input.value);
        formData.append('expected_output', formElements.expected_output.value);
        formData.append('leetcode_link', formElements.leetcode_link.value);

        // Append image files to formData
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('imageFiles', imageFiles[i]);
        }

        try {
            await questionService.createQuestion(formData); // Call the createQuestion function
            window.location.reload();
            handleClose(); // Close the dialog after submission
        } catch (error) {
            setErrorMessage('Error creating question: ' + error.message); // Set error message
            setErrorOpen(true); // Open error dialog
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle className="dialog-title">
                Add New Question
                </DialogTitle>
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
                            className="text-field"
                        />
                        <TextField
                            margin="dense"
                            fullWidth
                            id="difficulty"
                            select
                            label="Difficulty Level"
                            defaultValue="Easy"
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
                            className="text-field"
                        />
                        <TextField
                            margin="dense"
                            id="images"
                            name="images"
                            label="Images URLs (comma separated)"
                            type="text"
                            fullWidth
                            multiline
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
                        <TextField
                            margin="dense"
                            id="leetcode_link"
                            name="leetcode_link"
                            label="Leetcode Link"
                            type="text"
                            fullWidth
                            multiline
                            className="text-field"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} className="dialog-actions">Cancel</Button>
                        <Button type="submit" className="dialog-actions">Add Question</Button>
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

export default CreateQuestion;