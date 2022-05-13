import axios from 'axios'

export interface Status {
    timestamp: Date
    errorCode: number
    errorMessage: null
    elapsed: number
    creditCount: number
    notice: null
}

export const cmcRequest = axios.create({
    timeout: Number(process.env.TIMEOUT),
    baseURL: String(process.env.CMC_BASE_URL),
    headers: { 'X-CMC_PRO_API_KEY': String(process.env.CMC_API_KEY) },
})

cmcRequest.interceptors.request.use(
    function (config) {
        console.log(config.url)
        return config
    },
    function (error) {
        console.error(error)
        return Promise.reject(error)
    }
)

export default cmcRequest
