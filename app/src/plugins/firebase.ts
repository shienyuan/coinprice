import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from 'firebase/auth'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const configs = {
    apiKey: '***REMOVED***',
    authDomain: '***REMOVED***',
    projectId: '***REMOVED***',
    storageBucket: '***REMOVED***.appspot.com',
    messagingSenderId: ***REMOVED***,
    appId: '***REMOVED***',
    measurementId: '***REMOVED***',
}

export const fb = initializeApp(configs)
export const analytics = getAnalytics(fb)
export const functions = getFunctions(fb)
export const auth = getAuth(fb)
export const authSignInEmail = (
    email: string,
    password: string
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password)
export const authSignOut = (): Promise<void> => signOut(auth)

export const appCheck = initializeAppCheck(fb, {
    provider: new ReCaptchaV3Provider(
        '***REMOVED***'
    ),
    isTokenAutoRefreshEnabled: true,
})

if (process.env.NODE_ENV === 'development')
    connectFunctionsEmulator(functions, 'localhost', 5001)

export default {
    install: (): void => {
        return
    },
}
