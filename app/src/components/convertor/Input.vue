<template>
    <aside>
        <div class="surface-ground border-round p-3">
            <p class="text-sm text-gray-500 m-0">
                <slot></slot>
            </p>

            <div class="flex justify-content-between align-items-center">
                <div class="w-8">
                    <InputNumber
                        :input-class="
                            (disable ? 'pointer-events-none' : '') +
                            ' p-0 border-none py-2'
                        "
                        :maxFractionDigits="isFiat ? 2 : 6"
                        :minFractionDigits="isFiat ? 2 : 0"
                        :model-value="props.amount"
                        :placeholder="disable ? 0 : 'enter amount'"
                        class="w-full p-inputtext-lg"
                        @input="handleInput"
                    />
                </div>

                <Button
                    class="p-button-text text-white text-right inline"
                    @click="handleToggleDialog"
                >
                    <span>{{ currency.symbol }}</span>
                </Button>
            </div>

            <slot name="footer" />
        </div>

        <Dialog
            v-model:visible="show"
            :draggable="false"
            :header="`Select a ${isFiat ? 'Fiat' : 'Token'}`"
            close-on-escape
            content-class="p-0"
            dismissable-mask
            keep-in-viewport
            modal
            style="width: 400px"
        >
            <Listbox
                :filter="true"
                :filterFields="['name', 'symbol']"
                :model-value="props.currency"
                :options="currencies"
                :virtualScrollerOptions="{ itemSize: 10 }"
                class="border-0"
                listStyle="height:600px"
                @change="handleSelect"
            >
                <template #option="data">
                    <p class="m-0 py-2">
                        {{ data.option?.sign }}{{ data.option.symbol }}
                        <span class="text-gray-300">
                            {{ data.option.name }}
                        </span>
                    </p>
                </template>
            </Listbox>
        </Dialog>
    </aside>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { Currency, CurrencyType } from 'shared/types'

import InputNumber from 'primevue/inputnumber/InputNumber.vue'
import Dialog from 'primevue/dialog/Dialog.vue'
import Listbox from 'primevue/listbox/Listbox.vue'
import { InputNumberInputEvent } from 'primevue/inputnumber'
import { ListboxChangeEvent } from 'primevue/listbox'

const props = defineProps<{
    currencyType: CurrencyType
    currencies: Currency[]
    currency: Currency | null
    amount: number | null
    disable?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:currency', value: string | number | undefined): void
    (e: 'update:amount', value: string | number | undefined): void
}>()

const show = ref(false)
const isFiat = computed(() => props.currencyType === CurrencyType.fiat)
const handleToggleDialog = () => (show.value = !show.value)

const handleInput = (event: InputNumberInputEvent) => {
    if (props.disable) {
        return
    } else {
        emit('update:amount', event.value)
    }
}

const handleSelect = (event: ListboxChangeEvent) => {
    emit('update:currency', event.value)
    handleToggleDialog()
}
</script>

<style>
.p-inputtext:enabled:focus {
    box-shadow: none !important;
}
</style>
