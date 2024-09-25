import { Request, Response } from 'express';
import userModel from '../models/userModel';
import getUserCredentials from '../utils/getUserCredentials';
import { UserRole } from '../models/userModel';

const createUpdateUserController = async (req: Request, res: Response) => {
    const accessToken = req.headers.access_token;
    const updateFields = req.body;

    console.log(accessToken, updateFields);

    const userInfo = await getUserCredentials(accessToken);

    if (userInfo.error) {
        return res.status(401).json(userInfo);
    }

    const { name, email } = userInfo;

    const insertFields = { 
        ...(updateFields.username ? {} : { username: name }),
        ...(updateFields.email ? {} : { email: email }),
        ...(updateFields.authorisationRole ? {} : { authorisationRole: UserRole.USER })
    };

    try {
        const userDocument = await userModel.findOneAndUpdate(
            { email },
            { 
                $set: updateFields,
                $setOnInsert: insertFields
            },
            { upsert: true, new: true, runValidators: true }
        );
    
        res.json(userDocument);
    } catch (err) {
        res.status(500).json({
            error: `Unable to create or update user: ${err}`
        });
    }
}

export default createUpdateUserController;