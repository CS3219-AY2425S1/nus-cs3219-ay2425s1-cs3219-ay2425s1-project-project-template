import { Box, Button, Container } from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const ManageQuestions = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header></Header>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back To Question Repository
        </Button>
        <Box
          p={3}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          boxShadow={1}
          bgcolor="background.paper"
        ></Box>
      </Container>
    </>
  );
};

export default ManageQuestions;
