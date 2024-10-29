import CodeEditor from '../../../../components/collaboration/CodeEditor';
import QuestionDisplay from '@/components/collaboration/QuestionDisplay';

const App: React.FC = () => {

  return (
    <div className="flex flex-row w-full h-[90vh] gap-2">
      <div className="flex w-1/2 h-full">
        <QuestionDisplay />
      </div>
      <div className="flex w-1/2 h-full">
        <CodeEditor />
      </div>
    </div>

  );
};

export default App;