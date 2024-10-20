import {
    ICreateUser,
    ILoginUserRequest,
    ILoginUserResponse,
    IUserInfo,
    IUserPassword,
    IUserProfile,
} from '@/types/axios-user-types'

import { IEmailVerificationDto } from '@repo/user-types'
import { IUserDto } from '@repo/user-types'
import axios from 'axios'
import axiosClient from './axios-middleware'

const axiosInstance = axiosClient.userServiceAPI

// GET /validate
export const validateToken = async (): Promise<boolean | undefined> => {
    try {
        const response = await axiosInstance.get('/auth/token')
        if (response?.status === 204) {
            return true
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 401:
                case 404:
                    console.log('token invalid')
                    return false

                default:
                    console.log('Error checking validity of token')
            }
        }
    }
}

// POST /users
export const signUpRequest = async (userData: ICreateUser): Promise<IUserDto | undefined> => {
    try {
        const response: IUserDto = await axiosInstance.post('/users', userData)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            const errorResponse = error.response?.data

            switch (statusCode) {
                case 409:
                    console.log(errorResponse)
                    if (errorResponse === 'DUPLICATE_USERNAME') {
                        throw new Error('This username is already in use!')
                    } else if (errorResponse === 'DUPLICATE_EMAIL') {
                        throw new Error('This email is already in use!')
                    }
                    break

                case 500:
                    throw new Error('Failed to connect to the server!')

                default:
                    console.error('Error creating user:', errorResponse)
                    throw new Error('Unknown error when creating user')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// GET /users/:id
export const getUserProfile = async (id: string): Promise<IUserInfo | undefined> => {
    try {
        const response: IUserInfo = await axiosInstance.get(`/users/${id}`)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error getting profile: No such user!')
                default:
                    throw new Error('An unexpected error occurred' + error.message)
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// PUT /users/:id
export const updateUserProfile = async (id: string): Promise<IUserInfo | undefined> => {
    try {
        const response: IUserInfo = await axiosInstance.get(`/users/${id}`)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error getting profile: No such user!')
                default:
                    throw new Error('An unexpected error occurred' + error.message)
            }
        }
    }
}

// PUT /:id/password
export const updatePasswordRequest = async (password: IUserPassword, id: string): Promise<IUserInfo | undefined> => {
    try {
        const response: IUserInfo = await axiosInstance.put(`/users/${id}/password`, password)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            switch (statusCode) {
                case 400:
                    throw new Error('Did not meet password requirements')
                case 401:
                    throw new Error('Invalid login credentials, please check your input!')
                case 404:
                    throw new Error('No such user, please try again!')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// PUT /:id/
export const updateProfile = async (id: string, userData: Partial<IUserProfile>): Promise<IUserInfo | undefined> => {
    try {
        const response: ILoginUserResponse = await axiosInstance.put(`/users/${id}`, userData)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            switch (statusCode) {
                case 400:
                    throw new Error('Bad Request...')
                case 401:
                    throw new Error('Invalid login credentials, please check your input!')
                case 404:
                    throw new Error('No such user, please try again!')
                case 409:
                    throw new Error('The username is taken already, please try again with a different username')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// DELETE /:id/
export const deleteAccount = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/users/${id}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            switch (statusCode) {
                case 400:
                    throw new Error('Bad Request...')
                case 404:
                    throw new Error('No such user, please try again!')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// POST /auth/login
export const loginRequest = async (userData: ILoginUserRequest): Promise<ILoginUserResponse | undefined> => {
    try {
        const response: ILoginUserResponse = await axiosInstance.post('/auth/login', userData)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 400:
                    throw new Error('Bad Request...')
                case 401:
                    throw new Error('Invalid login credentials, please check your input!')
                case 404:
                    throw new Error('No such user, please try again!')
                case 500:
                    throw new Error('Failed to connect to server, please try again!')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// POST /auth/reset
export const sendResetPasswordEmail = async (userData: Partial<IEmailVerificationDto>): Promise<number | undefined> => {
    try {
        const response = await axiosInstance.post<Partial<IEmailVerificationDto>>('/auth/reset', userData)
        return response.status
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            switch (statusCode) {
                case 404:
                    throw new Error('Account not found. Please sign up and try again.')
                case 400:
                    return statusCode
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// POST /auth/verify
export const verifyEmail = async (userData: Partial<IEmailVerificationDto>): Promise<number | undefined> => {
    try {
        const response = await axiosInstance.post<Partial<IEmailVerificationDto>>('/auth/verify', userData)
        return response.status
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            switch (statusCode) {
                case 404:
                    throw new Error('Account not found. Please sign up and try again.')
                case 400:
                    throw new Error('Invalid OTP. Please try again.')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// POST /auth/update
export const updatePassword = async (userData: IEmailVerificationDto): Promise<number | undefined> => {
    try {
        const response = await axiosInstance.post<IEmailVerificationDto>('/auth/update', userData)
        return response.status
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            switch (statusCode) {
                case 404:
                    throw new Error('Account not found. Please sign up and try again.')
                case 400:
                    throw new Error('Please ensure your OTP is validated before updating your password.')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
