import axios from 'axios'

const timeout = 5000

const cmcRequest = axios.create({
    timeout,
    baseURL: process.env.CMC_BASE_URL,
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string },
})

cmcRequest.interceptors.request.use(
    function (config) {
        console.log(config.url)
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

export { cmcRequest }
