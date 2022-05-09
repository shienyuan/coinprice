import * as LogRocket from 'logrocket'
import { analyticsLogEvent } from '@/plugins/firebase'

export default {
    install: (): void => {
        if (process.env.NODE_ENV === 'development') return
        LogRocket.init('coinprice/coinpriceexchange')
        LogRocket.getSessionURL(function (sessionURL) {
            analyticsLogEvent('send', {
                hitType: 'event',
                eventCategory: 'LogRocket',
                eventAction: sessionURL,
            })
        })
    },
}
