<template>
    <main class="flex flex-column justify-content-center align-items-center">
        <Convertor id="convertor" />

        <!--        <ProgressSpinner-->
        <!--            v-if="loading"-->
        <!--            strokeWidth="3"-->
        <!--            class="absolute z-5"-->
        <!--            style="width: 5rem; height: 5rem"-->
        <!--        />-->

        <!--        <div id="convertor">-->
        <!--            <Skeleton class="mb-2" width="100%" height="100%"></Skeleton>-->
        <!--        </div>-->
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getCryptos, getFiats } from '@/api/convertor'
import { Fiat, Crypto } from 'shared/types'
// primevue
import ProgressSpinner from 'primevue/progressspinner/ProgressSpinner.vue'
// components
import Convertor from '@/components/convertor/Convertor.vue'
import Skeleton from 'primevue/skeleton/Skeleton.vue'
// data
const loading = ref(true)
const cryptos = ref<Crypto[]>([])

const loadCurrencies = async () => {
    // ;[cryptos.value] = await Promise.all([getCryptos()])
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
    max-width: 450px;
}
</style>
