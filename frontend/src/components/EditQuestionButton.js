import * as React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import EditQuestion from './EditQuestionDialog';

const EditButton = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleClickOpen} // Opens the dialog on button click
                sx={{
                    backgroundColor: '#41AFFF', 
                    fontFamily: 'Poppins', 
                    fontWeight: 400,
                    '&:hover': {
                        backgroundColor: '#414EFF',
                    },
                }}
            >
                Edit
            </Button>
            
        </div>
    );
}

export default EditButton;