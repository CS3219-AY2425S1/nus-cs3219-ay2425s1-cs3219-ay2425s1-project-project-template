import React from "react";
import { Card, Tag } from "antd";
import { Question } from "../../domain/entities/Question";
import styles from "./QuestionCard.module.css";
import { getDifficultyColor } from "presentation/utils/QuestionUtils";

interface QuestionCardProps {
    question: Question;
    isSelected: boolean;
    onClick: () => void;
    isNarrow: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = React.memo(
    ({ question, isSelected, onClick, isNarrow }) => (
        <Card
            className={`${styles.card} ${isSelected ? styles.selectedCard : ""} ${
                isNarrow ? styles.narrowCard : ""
            }`}
            hoverable
            onClick={onClick}
        >
            <div className={styles.header}>
                <h2 className={styles.title}>{question.title}</h2>
            </div>

            <div className={styles.footer}>
                <Tag
                    color={getDifficultyColor(question.difficulty)}
                    className={styles.difficultyTag}
                >
                    {question.difficulty}
                </Tag>
                <div className={styles.categoriesContainer}>
                    {question.categories.map((category) => (
                        <Tag key={category} color="blue" className={styles.categoryTag}>
                            {category}
                        </Tag>
                    ))}
                </div>
            </div>
        </Card>
    ),
    (prevProps, nextProps) => {
        return (
            prevProps.question.questionId === nextProps.question.questionId &&
            prevProps.isSelected === nextProps.isSelected &&
            prevProps.isNarrow === nextProps.isNarrow
        );
    }
);
