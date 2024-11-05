import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsoleCard {
  output: string;
}

const ConsoleCard: React.FC<ConsoleCard> = ({ output }) => {
  return (
    <Card className="max-h-3/4 w-3/4 overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Output</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
      </CardContent>
    </Card>
  );
};
export default ConsoleCard;
