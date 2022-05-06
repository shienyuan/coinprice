import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import {
    getAuth,
    signInWithEmailAndPassword,
    signInAnonymously,
    onAuthStateChanged,
    signOut,
    User,
} from 'firebase/auth'
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

export const fb = initializeApp(configs)
export const analytics = getAnalytics(fb)
export const functions = getFunctions(fb)
export const auth = getAuth(fb)
export const authSignInEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
export const authSignOut = () => signOut(auth)
export const user: User | null = null
export const checkAuth = () => user !== null

if (process.env.NODE_ENV === 'development')
    connectFunctionsEmulator(functions, 'localhost', 5001)

export default {
    install: (app: App): void => {
        app.provide('$fb', fb)
        app.provide('$fb_analytics', analytics)
        app.provide('$fb_functions', functions)
        app.provide('$fb_auth', auth)
    },
}
