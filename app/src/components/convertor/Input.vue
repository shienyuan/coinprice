<template>
    <div>
        <div class="surface-ground border-round p-3">
            <p class="text-sm text-gray-500 m-0">
                <slot></slot>
            </p>

            <div class="flex justify-content-between align-items-center">
                <div class="w-8">
                    <p v-if="disable" class="text-lg m-0 py-2">
                        {{ formatAmount(amount) }}
                    </p>
                    <InputText
                        v-else
                        class="w-full p-inputtext-lg p-0 border-none py-2"
                        placeholder="enter amount"
                        type="number"
                        :value="props.amount"
                        @input="
                            $emit('update:amount', Number($event.target.value))
                        "
                    />
                </div>

                <Button
                    class="p-button-text text-white text-right inline"
                    @click="handleToggleDialog"
                >
                    <span>{{ currency?.symbol }}</span>
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
                        {{ data.option?.sign }}{{ data.option?.symbol }}
                        <span class="text-gray-300">
                            {{ data.option.name }}
                        </span>
                    </p>
                </template>
            </Listbox>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { Currency, CurrencyType } from 'shared/types'

import Dialog from 'primevue/dialog/Dialog.vue'
import Listbox from 'primevue/listbox/Listbox.vue'
import { ListboxChangeEvent } from 'primevue/listbox'

const props = defineProps<{
    currencyType: CurrencyType
    currencies: Currency[]
    currency?: Currency
    amount?: number
    disable?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:currency', value: string | number | undefined): void
    (e: 'update:amount', value: string | null): void
}>()

const show = ref(false)
const isFiat = computed(() => props.currencyType === CurrencyType.fiat)

const handleToggleDialog = () => (show.value = !show.value)

const handleSelect = (event: ListboxChangeEvent) => {
    emit('update:currency', event.value)
    handleToggleDialog()
}

const formatAmount = (val: number) =>
    isFiat.value ? val.toFixed(2) : val % 1 != 0 ? val.toFixed(6) : val
</script>
