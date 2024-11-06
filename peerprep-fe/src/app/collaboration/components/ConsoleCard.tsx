import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { forwardRef } from 'react';

interface ConsoleCardProp {
  output: string;
}

const ConsoleCard = forwardRef<HTMLDivElement, ConsoleCardProp>(
  ({ output }, ref) => {
    return (
      <div ref={ref} className="flex w-full items-center justify-center">
        <Card className="max-h-3/4 w-3/4 overflow-auto rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {output}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
);

export default ConsoleCard;
