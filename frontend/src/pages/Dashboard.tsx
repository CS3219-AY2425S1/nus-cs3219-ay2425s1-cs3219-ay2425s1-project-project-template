import { Button, Container, Typography, Box } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    auth.logOut(navigate);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Welcome to the Dashboard!
        </Typography>
        <Button
          onClick={handleLogOut}
          variant="contained"
          color="primary"
          size="large"
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
