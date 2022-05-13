import * as LogRocket from 'logrocket'
import { analyticsLogEvent } from '@/plugins/firebase'

export default {
    install: (): void => {
        if (process.env.NODE_ENV === 'development') return
        LogRocket.init(process.env.VUE_APP_LOG_ROCKET_KEY)
        LogRocket.getSessionURL(function (sessionURL) {
            analyticsLogEvent('send', {
                hitType: 'event',
                eventCategory: 'LogRocket',
                eventAction: sessionURL,
            })
        })
    },
}
