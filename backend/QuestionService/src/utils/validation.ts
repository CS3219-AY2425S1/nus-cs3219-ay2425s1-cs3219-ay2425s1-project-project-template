import { body, Result, validationResult } from "express-validator"
import Question from "../models/questionModel"
import { NextFunction, Request, Response } from "express"

export const ValidateBodyForCreation = () => {
    return [
        body("qid")
            .notEmpty().withMessage("Missing question ID.").bail()
            .isInt({min : 1}).withMessage("Question IDs should be integer values starting from 1.").bail()
            .custom( async (value) => {
                if (await Question.findOne({qid : value})) {
                    throw new Error("Question ID already exists.")
                }
            }),
        body("title").notEmpty().withMessage("Missing question title."),
        body("description").notEmpty().withMessage("Missing question description."),
        body("catagories").isLength({min: 1}).withMessage("Missing question catagory."),
        body("complexity").isIn(["Easy", "Medium", "Hard"]).withMessage("Invalid question complexity"),
        (req : Request, res: Response, next : NextFunction) => {
            const err : Result = validationResult(req);
            if (!err.isEmpty()) {
                const msg = err.array()[0].msg;
                console.log(msg);
                return res.status(400).json(msg);
            }
            next();
        }
    ];
};