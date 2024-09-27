import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Question {
  questionTitle: string;
  questionDifficulty: string;
  questionTopics: string[];
  questionDescription: string;
}
