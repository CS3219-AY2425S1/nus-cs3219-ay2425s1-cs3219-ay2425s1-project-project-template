import axios from "axios"
import { Response } from "express"
import logger from "../utils/logger"
import { GetUserMatchRequest } from "../models/types"

const getCollaborator = async (req: GetUserMatchRequest, res: Response) => {
    const { userId } = req.params
}

export { getCollaborator  }