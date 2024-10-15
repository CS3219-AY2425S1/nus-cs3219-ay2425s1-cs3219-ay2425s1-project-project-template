import React, { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react'; // Import Semantic UI Loader
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'; // Ensure Semantic UI CSS is imported

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30); // Initialize countdown at 30 seconds

  useEffect(() => {

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate('/profile');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <Loader active inverted indeterminate size="huge" content={`Matching in ${countdown} seconds`} />
    </div>
  );
};

export default LoadingPage;
