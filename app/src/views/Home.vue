<template>
    <main class="grid justify-content-center">
        <div id="convertor" class="mb-3 lg:mb-0 lg:col-6 lg:mr-5">
            <Convertor id="convertor" :pair="selectedPair" />
        </div>

        <div class="lg:col-6">
            <Suspense>
                <Pairs @pairSelect="handlePairSelect" />
            </Suspense>
        </div>
    </main>
</template>

<script lang="ts" setup>
import Convertor from '@/components/convertor/Convertor.vue'
import Pairs from '@/components/pairs/Pairs.vue'
import { Pair } from 'shared/types'
import { ref } from 'vue'

const selectedPair = ref<Pair>({} as Pair)

const handlePairSelect = (pair: Pair) => {
    selectedPair.value = pair
}
</script>

<style scoped>
#convertor {
    max-width: 500px;
}
</style>
