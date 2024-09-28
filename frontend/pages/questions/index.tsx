import QuestionTable from "@/components/questions/QuestionTable";
import DefaultLayout from "@/layouts/default";
import { Question } from "@/types/questions";
// import { DUMMY_DATA } from "../api/questions";

interface QuestionPageProps {
  questions: Question[];
}

const QuestionsPage = ({ questions }: QuestionPageProps) => {
  return (
    <DefaultLayout>
        <QuestionTable questions={questions} />
    </DefaultLayout>
  );
};

// export async function getStaticProps() {
//   return {
//     props: {
//       questions: DUMMY_DATA
//     },
//     revalidate: 1
//   }
// }
export default QuestionsPage;
