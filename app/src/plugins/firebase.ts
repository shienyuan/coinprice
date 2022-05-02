import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { App } from 'vue'

const configs = {
    apiKey: 'AIzaSyAiUWulccTEN50-MpJSrz6UGXs35GFzOac',
    authDomain: 'coinprice-exchange.firebaseapp.com',
    projectId: 'coinprice-exchange',
    storageBucket: 'coinprice-exchange.appspot.com',
    messagingSenderId: '924864630587',
    appId: '1:924864630587:web:2a89c7231c901d5bad311e',
    measurementId: 'G-2MTYD31PEX',
}

export const firebase = initializeApp(configs)
export const analytics = getAnalytics(firebase)
export const functions = getFunctions(firebase)
connectFunctionsEmulator(functions, 'localhost', 5001)

export default {
    install: (app: App): void => {
        app.provide('$fb', firebase)
        app.provide('$fb_analytics', analytics)
        app.provide('$fb_functions', functions)
    },
}
