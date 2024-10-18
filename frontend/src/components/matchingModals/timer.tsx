import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Timer = () => (
  <CountdownCircleTimer
    isPlaying
    duration={30}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[60, 45, 30, 0]}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
);

export default Timer;
