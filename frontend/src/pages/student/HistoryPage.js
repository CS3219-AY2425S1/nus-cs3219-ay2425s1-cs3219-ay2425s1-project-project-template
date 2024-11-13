import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import HistoryCard from "../../components/student/HistoryCard";
import { getUserByEmail } from "../../api/UserApi";
import { UserContext } from "../../App";
import { getQuestion } from "../../api/QuestionsApi";

const HistoryPage = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [enrichedSessionHistory, setEnrichedSessionHistory] = useState([]); // Store session history with question details
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const { userEmail } = useContext(UserContext);

  // Use context or local storage for storedEmail
  const storedEmail = userEmail || localStorage.getItem("userEmail");

  useEffect(() => {
    if (!storedEmail) return;

    async function fetchUser() {
      try {
        const userData = await getUserByEmail(storedEmail);
        setCurrentUserInfo(userData.data);

        // Only set session history if it exists in the response
        if (userData.data && userData.data.sessionHistory) {
          setSessionHistory(userData.data.sessionHistory);
        }

        console.log("User Data:", userData.data); // Log after data is fetched
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false); // Set loading to false once data fetching is done
      }
    }

    fetchUser();
  }, [storedEmail]);

  // fetch questions using questionId
  useEffect(() => {
    async function fetchQuestionDetails() {
      try {
        const enrichedData = await Promise.all(
          sessionHistory.map(async (session) => {
            if (session.questionId) {
              const questionDetails = await getQuestion(session.questionId);
              console.log("Question Details:", questionDetails);
              return {
                ...session,
                question: questionDetails,
              };
            }
            return session;
          })
        );
        setEnrichedSessionHistory(enrichedData);
      } catch (error) {
        console.error("Failed to fetch question details:", error);
      }
    }

    if (sessionHistory.length > 0) {
      fetchQuestionDetails();
    }
  }, [sessionHistory]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 justify-center">
      <p className="text-center text-4xl font-bold py-4">MATCH HISTORY</p>

      {loading ? ( // Show a loading message while fetching data
        <p className="text-center">Loading...</p>
      ) : (
        <div className="max-w-full h-[80vh] bg-gray-100 mx-4 justify-between gap-4 custom-scrollbar rounded-lg mb-1">
          {enrichedSessionHistory.length > 0 ? (
            enrichedSessionHistory.map((item, index) => (
              <HistoryCard
                key={index}
                sessionData={item}
                userImage=""
              />
            ))
          ) : (
            <p className="text-center">No match history available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

