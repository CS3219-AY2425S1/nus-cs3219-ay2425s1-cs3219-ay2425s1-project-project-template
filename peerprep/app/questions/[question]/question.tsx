import { Question, StatusBody, Difficulty } from "@/api/structs";
import styles from '@/style/question.module.css';

interface Props {
  question : Question;
}

const difficultyColor = (diff: Difficulty) => {
  return (
    diff === Difficulty.Easy ? <p className={`${styles.title} ${styles.easy}`}>Easy</p>
    : diff === Difficulty.Medium ? <p className={`${styles.title} ${styles.med}`}>Med</p>
    : <p className={`${styles.title} ${styles.hard}`}>Hard</p>
  );
}

function QuestionBlock({ question }: Props) {
  const keys = question.test_cases ? Object.keys(question.test_cases) : [];

  const createRow = (key: string) => (
    <tr key={key}>
      <td className={`${styles.table} ${styles.cell}`}>{key}</td>
      <td className={`${styles.table} ${styles.cell}`}>{question.test_cases[key]}</td>
    </tr>
  );

  return (
    <>
      <div className={styles.qn_container}>
        <div className={styles.title_wrapper}>
          <h1 className={styles.title}>Q{question.id}: {question.title}</h1>
          {difficultyColor(question.difficulty)}
        </div>
        <br/>
        <p>{question.description}</p>
        <br/>
        {question.test_cases && (
          <table className={styles.table}>
            <tbody>
              <tr>
                <th className={`${styles.table} ${styles.header} ${styles.input}`}>Input</th>
                <th className={`${styles.table} ${styles.header} ${styles.output}`}>Expected Output</th>
              </tr>
              {keys.map(createRow)}
            </tbody>
          </table>
        )}
      </div>
      <form className={styles.editor_container}>
        <textarea className={styles.code_editor}/>
      </form>
    </>
  );
}

export default QuestionBlock;