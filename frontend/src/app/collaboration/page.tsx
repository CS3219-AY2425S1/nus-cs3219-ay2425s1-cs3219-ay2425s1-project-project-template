import CollaborativeEditor from "@/components/collaboration/collaborative-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CollaborationPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-8">
            <CollaborativeEditor
              sessionId="unique-session-id"
              questionId="question-123"
              initialLanguage="javascript"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}