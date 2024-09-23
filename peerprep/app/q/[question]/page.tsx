import { fetchQuestion } from '@/api/gateway';
import { Question as QnType, ErrorBody, isError } from "@/api/structs";
import ErrorBlock from '@/components/shared/ErrorBlock';
import React from 'react'

type Props = {
  params: {
    question: string
  }
}

const questionBlock = (question: QnType) => (
  <>
    <h1>It works?</h1>
    <p>{question.description}</p>
  </>
);

async function Question({ params }: Props) {
  const question = await fetchQuestion(params.question);

  return (
    <div className="from-white">
      {isError(question) ? <ErrorBlock err={question as ErrorBody}/> : questionBlock(question as QnType)}
    </div>
  )
}

export default Question;