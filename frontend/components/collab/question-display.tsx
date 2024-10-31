import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Question } from "@/lib/schemas/question-schema";

const difficultyColors = {
  Easy: "bg-green-500",
  Medium: "bg-yellow-500",
  Hard: "bg-red-500",
};

// export default function QuestionDisplay({ question }: { question: Question }) {
//   return (
    // <Card className="flex-shrink-0">
    //   <CardHeader>
    //     <CardTitle>{question.title}</CardTitle>
    //     <CardDescription className="flex items-center space-x-2">
    //       <span>{question.categories}</span>
    //       <Badge className={`${difficultyColors[question.complexity]}`}>
    //         {question.complexity}
    //       </Badge>
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <p>{question.description}</p>
    //   </CardContent>
    // </Card>
export default function QuestionDisplay() {
  return (
    <Card className="flex-shrink-0">
      <CardHeader>
        <CardTitle>Placeholder Title</CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <span>Placeholder category</span>
          <Badge className={`${difficultyColors["Easy"]}`}>
            Placeholder complexity
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Placeholder description ahudhauihd iuadhaidhiaidhaiwud hiuahwd uiahi
          udhaiw dhaiuwdghi uagwiud aiwgyaij eoifja ihaiu hdiaoj doiawj iougaw
          irai hfiuoa hdiaw iuorg aiah diugawidjawi dbiuadiawh ifuhafiojaowjioad
          jiua wfija dadwud hiaw iuhda iwidhwa iluehd aiwh diuaw iuh awidh
        </p>
      </CardContent>
    </Card>
  );
}
