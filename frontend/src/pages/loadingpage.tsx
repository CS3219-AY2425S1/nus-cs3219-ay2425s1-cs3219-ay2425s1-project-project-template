import React, { useEffect, useState } from "react";
import { Loader, Button, Header, Container } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import "semantic-ui-css/semantic.min.css";

interface CustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
}

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [matchFound, setMatchFound] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const jwtToken = localStorage.getItem("access_token");
    let decodedToken: CustomJwtPayload | null = null;
    if (jwtToken) {
      decodedToken = jwtDecode<CustomJwtPayload>(jwtToken);
    }

    const eventSource = new EventSource(
      `http://localhost:3009/rabbitmq/${decodedToken?.email}`
    );
    console.log("connected");
    eventSource.onmessage = (event) => {
      console.log("EVENT IS", event);
      const data = JSON.parse(event.data);
      if (data.userEmail === decodedToken?.email) {
        setMatchFound(true);
        clearInterval(timer);
      } else {
        console.log("Error");
        console.log(data.userEmail);
        console.log(decodedToken?.email);
      }
    };

    return () => {
      clearInterval(timer);
      eventSource.close();
    };
  }, [countdown, matchFound]);

  const resetTimer = () => {
    setCountdown(3);
    setMatchFound(false);
  };

  const conditionalRender = () => {
    if (countdown > 0 && !matchFound) {
      return (
        <Loader
          active
          inverted
          indeterminate
          size="massive"
          content={`Matching in ${countdown} seconds`}
        />
      );
    } else if (countdown <= 0 && !matchFound) {
      return (
        <Container textAlign="center">
          <Header as="h1" size="huge" style={{ color: "white" }}>
            Unable to find a match
          </Header>
          <Header as="h2" size="large" style={{ color: "white" }}>
            Retry matchmaking?
          </Header>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <Button primary size="large" onClick={resetTimer}>
              Retry
            </Button>
            <Button
              color="red"
              size="large"
              onClick={() => navigate("/matching-page")}
            >
              Exit
            </Button>
          </div>
        </Container>
      );
    } else {
      console.log("match found is", matchFound);
      console.log("count down is", countdown);
      return (
        <Container textAlign="center">
          <Header as="h1" size="huge" style={{ color: "white" }}>
            Match Found
          </Header>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <Button
              negative
              size="large"
              onClick={() => navigate("/matching-page")}
            >
              Decline
            </Button>
            <Button
              positive
              size="large"
              onClick={() => navigate("/matching-page")}
            >
              Accept
            </Button>
          </div>
        </Container>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {conditionalRender()}
    </div>
  );
};

export default LoadingPage;
