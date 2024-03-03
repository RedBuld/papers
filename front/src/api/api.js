import mem from "mem"
import axios from 'axios'
import { session } from '../contexts/auth'

export const API = axios.create({
    baseURL: 'https://oko-test.grampus-studio.ru/api',
    headers: {
        "Content-Type": "application/json",
    },
})

export const RAW = axios.create({
    baseURL: 'https://oko-test.grampus-studio.ru/api',
    headers: {
        "Content-Type": "application/json",
    },
})

export const MOEX = axios.create({
    baseURL: 'https://iss.moex.com/iss/',
    headers: {
        "Content-Type": "application/json",
    },
})

async function RefreshToken() {
    let ses = session.value

    return RAW
        .post("/auth/refresh", {}, {
                headers: {
                    authorization: `Bearer ${ses?.refresh_token}`,
                }
        })
        .then( (response) => {
            let new_ses = Object.assign(ses, response.data)            
            session.value = new_ses
            return Promise.resolve(session.value)
        })
        .catch( (err) => {
            session.value = {}
            return Promise.resolve(session.value)
        })
}

const memoizedRefreshToken = mem(RefreshToken, { 'maxAge': 5000 })

API.interceptors.request.use(
    async (config) => {
    
        let ses = session.value

        if (ses?.access_token) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${ses?.access_token}`,
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

API.interceptors.response.use(
    (response) => response,
    async (error) => {

        const config = error?.config

        if( (error?.response?.status === 401 || error?.response?.status === 422) && !config?.sent)
        {
            config.sent = true
            const result = await memoizedRefreshToken()
            if (result?.access_token)
            {
                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${result?.access_token}`,
                }
            }
            return axios(config)
        }
        return Promise.reject(error)
    }
)