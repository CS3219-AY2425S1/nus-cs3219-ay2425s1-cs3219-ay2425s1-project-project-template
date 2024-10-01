import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
    baseURL: 'http://localhost:3002',
})

// Request interceptor for all axios calls
api.interceptors.request.use(
    async (config) => {
        const session = await getSession()
        if (session) {
            config.headers['Authorization'] = `Bearer ${session.user.accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for all axios calls
api.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 403: // Forbidden
                    console.error('Access denied. You do not have permission to access this resource.')
                    break
                case 500:
                    throw new Error('Failed to connect to server, please try again!')
            }
        }
        return Promise.reject(error)
    }
)

export default api
