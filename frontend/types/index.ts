import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Question {
  title: string;
  complexity: string;
  category: string[];
  description: string;
}
