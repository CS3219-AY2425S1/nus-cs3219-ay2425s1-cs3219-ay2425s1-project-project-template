import axios from 'axios'
import axiosClient from './axios-middleware'
import { IPostMatching } from '@/types/matching-api'

const axiosInstance = axiosClient.matchingServiceAPI

// POST /matching
export const addUserToMatchmaking = async (data: IPostMatching): Promise<boolean | undefined> => {
    try {
        const response = await axiosInstance.post(`/matching`, data)
        return response.status === 200
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error('An unexpected error occurred' + error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
