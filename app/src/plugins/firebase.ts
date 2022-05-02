import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { App } from 'vue'

const configs = {
    apiKey: '***REMOVED***',
    authDomain: '***REMOVED***',
    projectId: '***REMOVED***',
    storageBucket: '***REMOVED***.appspot.com',
    messagingSenderId: ***REMOVED***,
    appId: '***REMOVED***',
    measurementId: '***REMOVED***',
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
