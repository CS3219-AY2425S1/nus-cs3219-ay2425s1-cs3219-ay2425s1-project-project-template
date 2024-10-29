import './QuestionCounter.css';

interface QuestionCounterProps {
  colour: string;
  label: string;
  completed: number;
  total: number;
}

function QuestionCounter({ colour, label, completed, total }: QuestionCounterProps) {
  const progress = (completed / total) * 100; // Calculate percentage

  return (
    <div className="counter-container"> {/* New container for the circle and label */}
      <div className="circle-container">
        <div 
          className="circle" 
          style={{ 
            background: `conic-gradient(${colour} ${progress}%, lightgrey ${progress}%)` 
          }}
        />
        <div className="inner-circle">
          <div className="number-container">
            <p className="number-done">{completed}</p>
            <p className="number-remaining">/{total}</p>
          </div>
        </div>
      </div>
      <p className="difficulty-label">{label}</p>
    </div>
  );
}

export default QuestionCounter;
