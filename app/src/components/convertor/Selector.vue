<template>
    <aside class="flex align-items-center justify-content-end">
        <Button @click="handleShow" class="p-button-text text-white">
            <span>{{ modelValue.symbol }}</span>
        </Button>
        <Dialog
            :header="`Select a ${
                currencyType === CurrencyType.fiat ? 'Fiat' : 'Token'
            }`"
            v-model:visible="show"
            style="width: 400px"
            modal
            dismissable-mask
            close-on-escape
            :draggable="false"
            keep-in-viewport
            content-class="p-0"
        >
            <Listbox
                :filter="true"
                :filterFields="['name', 'symbol']"
                :options="currencies"
                :model-value="props.modelValue"
                :virtualScrollerOptions="{ itemSize: 5 }"
                listStyle="height:500px"
                class="border-0"
                @change="$emit('update:modelValue', $event.value)"
            >
                <template #option="data">
                    <span class="mr-1">{{ data.option?.sign }}</span>
                    <span class="mr-1">{{ data.option.symbol }}</span>
                    <span class="text-gray-300"> {{ data.option.name }}</span>
                </template>
            </Listbox>
        </Dialog>
    </aside>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import { Currency, CurrencyType } from 'shared/types'

import Listbox from 'primevue/listbox/Listbox.vue'
import Dialog from 'primevue/dialog/Dialog.vue'

const props = defineProps<{
    modelValue: Currency
    currencyType: CurrencyType
    currencies: Currency[]
}>()

const show = ref(false)

const handleShow = () => (show.value = true)
</script>

<style scoped></style>
