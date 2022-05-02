import axios from 'axios'

const timeout = 5000

const cmcRequest = axios.create({
    timeout,
    baseURL: process.env.CMC_BASE_URL,
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string },
})

export { cmcRequest }
