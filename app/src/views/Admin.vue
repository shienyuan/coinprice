<template>
    <main>
        <div class="text-right mb-3">
            <Button
                @click="handleLogout"
                class="ml-auto p-button-secondary p-button-sm"
                label="Logout"
            />
        </div>

        <Card>
            <template #content>
                <div>
                    <Button
                        label="Update Cryptos"
                        @click="handleUpdateCryptos"
                    />
                    <div class="mt-3">
                        Results:
                        <p>
                            Sync with CMC:
                            <span class="text-green-500">{{
                                results.syncCrypto
                            }}</span>
                        </p>
                        <p>
                            Sync metaData with CMC:
                            <span class="text-green-500">{{
                                results.syncCryptoMetadata
                            }}</span>
                        </p>
                        <p>
                            Sync Algolia index:
                            <span class="text-green-500">{{
                                results.syncCryptoAlgolia
                            }}</span>
                        </p>
                    </div>
                </div>
            </template>
        </Card>
    </main>
</template>

<script lang="ts" setup async>
import { authSignOut } from '@/plugins/firebase'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { syncCryptos, syncCryptoMetadata, syncCryptoAlgolia } from '@/api/admin'

const router = useRouter()
const results = ref({
    syncCrypto: '',
    syncCryptoMetadata: '',
    syncCryptoAlgolia: '',
})

const handleLogout = async () => {
    await authSignOut()
    await router.push('/login')
}

const handleUpdateCryptos = async () => {
    results.value.syncCrypto = await syncCryptos()
    results.value.syncCryptoMetadata = await syncCryptoMetadata()
    results.value.syncCryptoAlgolia = await syncCryptoAlgolia()
}
</script>
