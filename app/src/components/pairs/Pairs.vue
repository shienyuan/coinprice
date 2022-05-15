<template>
    <div>
        <h2 class="mt-0">Popular Pairs</h2>
        <div class="grid">
            <div class="col-6" v-for="(p, i) in pairs" :key="i">
                <Button
                    class="p-button-sm p-button-outlined p-button-secondary w-full"
                    @click="$emit('pairSelect', p)"
                >
                    <div class="w-full flex justify-content-center">
                        <CurrencyText
                            :type="
                                p.from?.sign
                                    ? CurrencyType.fiat
                                    : CurrencyType.crypto
                            "
                            :icon="p.from.icon"
                            :symbol="p.from.symbol"
                        />
                        <span class="mx-2">to️</span>
                        <CurrencyText
                            :type="
                                p.to?.sign
                                    ? CurrencyType.fiat
                                    : CurrencyType.crypto
                            "
                            :icon="p.to.icon"
                            :symbol="p.to.symbol"
                        />
                    </div>
                </Button>
            </div>
        </div>
    </div>
</template>

<script async setup lang="ts">
import { getPairs } from '@/api/recommand'
import { CurrencyType } from 'shared/types'
import CurrencyText from '@/components/CurrencyText.vue'

const pairs = await getPairs()
</script>
