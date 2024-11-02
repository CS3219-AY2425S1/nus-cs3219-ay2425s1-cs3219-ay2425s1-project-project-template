import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from "@mui/material";
import { green } from "@mui/material/colors";
import PhoneDisabledRoundedIcon from '@mui/icons-material/PhoneDisabledRounded';
import PhoneEnabledRoundedIcon from '@mui/icons-material/PhoneEnabledRounded';
import { CallNotificationState } from "../../pages/Collaboration/collaboration";
import { useSocket } from "../../contexts/SocketContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CallNotification({ notification, handleCallResponse } : {notification : CallNotificationState, handleCallResponse: Function}) {



    return (
        <Dialog open={notification.isOpen} onClose={() => handleCallResponse(false)} >
            <DialogTitle textAlign="center">
                Incoming Call
            </DialogTitle>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                flex: "1",
                justifyContent:"center",
                alignItems: "center",
                gap:"10px"
            }}>
                <DialogContentText textAlign="center">
                    {notification.caller.username}
                </DialogContentText>
                <Avatar  alt="Remy Sharp" src={notification.caller.avatar} sx={{width:56, height:56}}/>
            </Box>
            <DialogActions className="flex justify-center items-center">
                <Box sx={{
                display: "flex",
                minHeight:"100%",
                minWidth: "100%",
                flex: "1",
                justifyContent:"center",
                alignItems: "center",
                gap:"10px"}}
                >
                    <IconButton size="large" onClick={() => handleCallResponse(true)}>
                        <PhoneEnabledRoundedIcon/>
                    </IconButton>
                    <IconButton onClick={() => handleCallResponse(false)}>
                        <PhoneDisabledRoundedIcon/>
                    </IconButton>

                </Box>
            </DialogActions>
        </Dialog>
    )
}
