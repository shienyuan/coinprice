import algolia from 'algoliasearch/lite'

const ag = algolia(
    process.env.VUE_APP_ALGOLIA_APP_ID,
    process.env.VUE_APP_ALGOLIA_API_KEY
)

export const cryptoIndex = ag.initIndex('cryptos')

export default {
    install: (): void => {
        return
    },
}
