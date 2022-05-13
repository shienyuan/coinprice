import algolia from 'algoliasearch'

const algoliaClient = algolia(
    process.env.AG_APP_ID as string,
    process.env.AG_API_KEY as string
)
export const cryptosIndex = algoliaClient.initIndex('cryptos')
