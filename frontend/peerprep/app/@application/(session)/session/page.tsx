import CodeEditor from '../../../../components/collaboration/CodeEditor';
import QuestionDisplay from '@/components/collaboration/QuestionDisplay';

const App: React.FC = () => {

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex w-full h-1/2">
        <QuestionDisplay />
      </div>
      <div className="flex w-full h-1/2">
        <CodeEditor />
      </div>
    </div>

  );
};

export default App;