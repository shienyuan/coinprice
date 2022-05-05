export const collectionExists = (
    collection: FirebaseFirestore.CollectionReference
) => {
    let exists = false
    collection
        .get()
        .then((snap) => {
            console.log((exists = snap.size > 0))
            exists = snap.size > 0
        })
        .catch((e) => {
            console.error('ddd' + e)
        })
    return exists
}
