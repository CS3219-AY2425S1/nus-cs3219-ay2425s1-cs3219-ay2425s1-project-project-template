import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { forwardRef } from 'react';

interface ConsoleCardProp {
  output: string;
}

const ConsoleCard = forwardRef<HTMLDivElement, ConsoleCardProp>(
  ({ output }, ref) => {
    return (
      <div ref={ref} className="mx-4 mb-4 w-full max-w-2xl">
        <Card className="max-h-3/4 w-3/4 overflow-auto">
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
