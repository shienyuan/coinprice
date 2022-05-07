<template>
    <main class="flex flex-column justify-content-center align-items-center">
        <div id="convertor">
            <Convertor
                v-if="cryptos.length > 0 && fiats.length > 0"
                :cryptos="cryptos"
                :fiats="fiats"
                :initializing="loading"
            />
            <Skeleton
                v-else
                height="400px"
                style="transition: all 0.5s ease-out"
            >
            </Skeleton>
        </div>

        <ProgressSpinner
            v-if="loading"
            class="absolute"
            strokeWidth="3"
            style="width: 80px; height: 80px"
        />
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getCryptos, getFiats } from '@/api/convertor'
import { Fiat, Crypto } from 'shared/types'
// primevue
import ProgressSpinner from 'primevue/progressspinner/ProgressSpinner.vue'
import Skeleton from 'primevue/skeleton/Skeleton.vue'
// components
import Convertor from '@/components/convertor/Convertor.vue'
// data
const loading = ref(true)
const cryptos = ref<Crypto[]>([])
const fiats = ref<Fiat[]>([])

const loadCurrencies = async () => {
    ;[cryptos.value, fiats.value] = await Promise.all([
        getCryptos(),
        getFiats(),
    ])
}

onMounted(async () => {
    try {
        await loadCurrencies()
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
#convertor {
    width: 420px;
}
</style>
