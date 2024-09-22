import mongoose from "mongoose";
import Question from "../models/questionModel";
import { Response, Request, NextFunction } from "express";

const DUPKEYERRORCODE = 11000; 

export const getAllQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questions = await Question.find({});
        res.status(200).json(questions);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const getOneQuestion = async (req: Request, res: Response, next: NextFunction) => {
    const { qid } = req.params;
    if (isNaN(+qid)) {
        return res.status(404).send({msg: "Please enter a valid question ID."})
    }
    try {
        const question = await Question.findOne({qid: qid});
        if (!question) {
            return res.status(404).send({msg : `No question with id=${qid}.`});
        }
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        next(err);
    }
}


export const addQuestion = async (req: Request, res: Response, next : NextFunction) => {
    const {qid, title, description, categories, complexity} = req.body;
    try {
        const question = await Question.create({qid, title, description, categories, complexity});
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        if (err instanceof mongoose.mongo.MongoError && err.code == DUPKEYERRORCODE) { // this catches duplicate key error
            return res.status(404).json({msg: `Question ID ${qid} already exists.`});
        }
        next(err);
    }
}

export const deleteQuestion = async (req: Request, res: Response, next : NextFunction) => {
    const { qid } = req.params;
    if (isNaN(+qid)) {
        return res.status(404).send({msg: "Please enter a valid question ID."})
    }
    try {
        const question = await Question.findOneAndDelete({qid: qid});
        if (!question) {
            return res.status(404).send({msg: `No question with id=${qid}`});
        }
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const updateQuestion = async (req: Request, res: Response, next : NextFunction) => {
    const { qid } = req.params;
    if (isNaN(+qid)) {
        return res.status(404).send({msg: "Please enter a valid question ID."})
    }
    try {
        const question = await Question.findOneAndUpdate({qid: qid}, {...req.body, qid})
        if (!question) {
            return res.status(404).send({msg: `No question with id=${qid}`});
        }
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        next(err);
    }
}
