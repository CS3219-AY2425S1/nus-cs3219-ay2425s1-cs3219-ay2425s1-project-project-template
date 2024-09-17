import mongoose, { MongooseError } from "mongoose";
import Question from "../models/questionModel";
import { Response, Request, NextFunction } from "express";

export const getAllQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questions = await Question.find({});
        res.status(200).json(questions);
    } catch (err) {
        // res.status(500).send();
        // console.log("Internal Server Error");
        console.log(err);
        next(err);
    }
}

export const getOneQuestion = async (req: Request, res: Response, next: NextFunction) => {
    const { qid } = req.params;
    try {
        const question = await Question.findOne({qid: qid});
        if (!question) {
            console.log(`No question with id=${qid}`);
            return res.status(404).send();
        }
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        next(err);
        // if (err instanceof MongooseError) {
        //     res.status(500).send();
        //     console.log(err.message);
        // } else {
        //     res.status(500).send();
        //     console.log("Internal server error");
        // }
    }
}


export const addQuestion = async(req: Request, res: Response, next : NextFunction) => {
    const {qid, title, description, catagories, complexity} = req.body;
    try {
        const question = await Question.create({qid, title, description, catagories, complexity});
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const deleteQuestion = async(req: Request, res: Response, next : NextFunction) => {
    const { qid } = req.params;
    try {
        const question = await Question.findOneAndDelete({qid: qid});
        if (!question) {
            console.log(`No question with id=${qid}`);
            return res.status(404).send();
        }
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        next(err);
        // if (err instanceof MongooseError) {
        //     res.status(501).send();
        //     console.log(err.message);
        // } else {
        //     res.status(502).send();
        //     console.log("Internal server error");
        // }
    }
}

export const updateQuestion = async(req: Request, res: Response, next : NextFunction) => {
    const { qid } = req.params;

    try {
        const question = await Question.findOneAndUpdate({qid: qid}, {...req.body})
        if (!question) {
            console.log(`No question with id=${qid}`);
            return res.status(404).send();
        }
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        next(err);
        // if (err instanceof MongooseError) {
        //     res.status(501).send();
        //     console.log(err.message);
        // } else {
        //     res.status(502).send();
        //     console.log("Internal server error");
        // }
    }
}
