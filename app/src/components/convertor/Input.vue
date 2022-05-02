<template>
    <div class="py-2">
        <small class="block text-gray-300 m-0 mb-2">
            <slot />
        </small>
        <div class="p-inputgroup p-inputtext-lg">
            <InputNumber
                :maxFractionDigits="6"
                :model-value="props.amount"
                class="w-7"
                :class="disable ? 'pointer-events-none' : ''"
                mode="decimal"
                placeholder="0"
                @input="$emit('update:amount', $event.value)"
            />
            <Dropdown
                :filter="true"
                :filterFields="['name', 'symbol']"
                :model-value="currency"
                :options="currencyOptions"
                :virtualScrollerOptions="{ itemSize: 50 }"
                class="w-5"
                optionLabel="symbol"
                @change="$emit('update:currency', $event.value)"
            >
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <span>
                            {{ slotProps.option.name }} ({{
                                slotProps.option.symbol
                            }})</span
                        >
                    </div>
                </template>
            </Dropdown>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { IConvertorCurrency } from 'shared/convertor.model'
import Dropdown from 'primevue/dropdown'

const props = defineProps<{
    amount: number
    currency: IConvertorCurrency
    currencyOptions: IConvertorCurrency[]
    disable?: boolean
}>()
</script>
