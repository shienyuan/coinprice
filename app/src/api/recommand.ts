import { httpsCallable } from 'firebase/functions'
import { functions } from '@/plugins/firebase'
import { Pair } from 'shared/types'

export const getPairs = async (): Promise<Pair[]> => {
    const req = httpsCallable<void, Pair[]>(functions, 'getPairs')
    const resp = await req()
    return resp.data
}
