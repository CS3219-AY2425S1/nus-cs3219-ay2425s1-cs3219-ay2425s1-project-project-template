import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { CircleX, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_EVENTS = {
  CONNECT: 'connect',
  MESSAGE: 'message',
  MATCHING: 'MATCHING',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const FAILED_STATUS = {
  header: 'No match found',
  icon: <CircleX color='red' />,
  description: <p className='mt-4 text-lg'>Match failed.</p>,
};

export const WaitingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const socketUrl = location.state?.socketURL;
  const [countdown, setCountdown] = useState(30);

  const [status, setStatus] = useState({
    header: 'Waiting for a Partner...',
    icon: <LoaderCircle className='animate-spin' />,
    description: <p className='mt-4 text-lg'>Time left: 30 seconds</p>,
  });

  console.log(socketUrl);

  // move logic to connect event
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (countdown > 0) {
      timerInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setStatus((prevStatus) => ({
        ...prevStatus,
        description: <p className='mt-4 text-lg'>Time left: {countdown} seconds</p>,
      }));
    } else {
      setStatus(FAILED_STATUS);
    }

    return () => clearInterval(timerInterval);
  }, [countdown]);

  useEffect(() => {
    // uncomment once integrated with BE
    // if (!socketUrl) {
    //   navigate(ROUTES.MATCH);
    // }
    const socket = io(socketUrl);

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to server');
    });

    socket.on(SOCKET_EVENTS.MESSAGE, (data) => {
      console.log('Message from server:', data);
    });

    socket.on(SOCKET_EVENTS.MATCHING, () => {
      console.log('Matching in progress');
    });

    socket.on(SOCKET_EVENTS.PENDING, () => {
      console.log('Waiting in pool');
    });

    socket.on(SOCKET_EVENTS.SUCCESS, (data) => {
      console.log(`Received match: ${JSON.stringify(data)}`);
      navigate(ROUTES.MATCH);
    });

    socket.on(SOCKET_EVENTS.FAILED, () => {
      console.log('Matching failed');
      setCountdown(0);
      setStatus(FAILED_STATUS);
    });

    return () => {
      socket.close();
    };
  }, [socketUrl, navigate]);

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-3xl'>{status.header}</h1>
      <div className='flex flex-col items-center justify-center'>
        {status.icon}
        {status.description}
      </div>
      {countdown > 0 ? (
        <Button className='mt-5' variant='destructive'>
          Cancel
        </Button>
      ) : (
        <Button className='mt-5' variant='outline'>
          <Link to={ROUTES.MATCH}>Back</Link>
        </Button>
      )}
    </div>
  );
};
