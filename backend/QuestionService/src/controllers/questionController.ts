import mongoose, { MongooseError } from "mongoose";
import Question from "../models/questionModel";
import { Response, Request } from "express";

export const getAllQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find({});
        res.status(200).json(questions);
    } catch (err) {
        res.status(400).send({msg : err});
        console.log("cant get");
    }
}

export const getOneQuestion = async (req: Request, res: Response) => {
    const { qid } = req.params;
    try {
        const question = await Question.findOne({qid: qid});
        if (!question) {
            return res.status(400).json({msg: `No workout with id=${qid}`});
        }
        res.status(200).json(question);
    } catch (err) {
        if (err instanceof MongooseError) {
            res.status(400).send({msg: err.message})
        } else {
            res.status(400).send({msg: "Unexpected error occured"})
        }
    }
}


export const addQuestion = async(req: Request, res: Response) => {
    const {qid, title, description, catagories, complexity} = req.body;

    try {
        const question = await Question.create({qid, title, description, catagories, complexity});
        res.status(200).json(question);
    } catch (err) {
        if (err instanceof MongooseError) {
            res.status(400).send({msg: err.message})
        } else {
            res.status(400).send({msg: "Unexpected error occured"})
        }
    }
}

export const deleteQuestion = async(req: Request, res: Response) => {
    const { qid } = req.params;
    try {
        const question = await Question.findOneAndDelete({qid: qid});
        if (!question) {
            return res.status(400).json({msg: `No workout with id=${qid}`});
        }
        res.status(200).json(question);
    } catch (err) {
        if (err instanceof MongooseError) {
            res.status(400).send({msg: err.message})
        } else {
            res.status(400).send({msg: "Unexpected error occured"})
        }
    }
}

export const updateQuestion = async(req: Request, res: Response) => {
    const { qid } = req.params;

    try {
        const question = await Question.findOneAndUpdate({qid: qid}, {...req.body})
        if (!question) {
            return res.status(400).json({msg: `No workout with id=${qid}`});
        }
        res.status(200).json(question);
    } catch (err) {
        if (err instanceof MongooseError) {
            res.status(400).send({msg: err.message})
        } else {
            res.status(400).send({msg: "Unexpected error occured"})
        }
    }
}
