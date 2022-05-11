<template>
    <div>
        <Button
            class="border-none text-white text-right inline bg-transparent"
            @click="handleToggleDialog"
        >
            <span class="mr-2" v-if="modelValue?.icon">{{
                modelValue.icon
            }}</span>
            <span>{{ modelValue?.symbol || 'loading...' }}</span>
        </Button>

        <Dialog
            content-class="p-0"
            style="width: 400px"
            v-model:visible="show"
            :draggable="false"
            :header="`Select a ${
                type === CurrencyType.crypto ? 'Coin' : 'Fiat'
            }`"
            dismissable-mask
            close-on-escape
            keep-in-viewport
            modal
        >
            <template #header>
                <slot></slot>
            </template>
            <Listbox
                class="border-0"
                :options="options"
                :model-value="props.modelValue"
                @change="handleSelect"
            >
                <template #option="data">
                    <p class="m-0 py-2">
                        <span class="mr-2" v-if="data.option.icon">{{
                            data.option.icon
                        }}</span>
                        <span class="mr-1">{{ data.option?.symbol }}</span>
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
import { defineEmits, defineProps, ref } from 'vue'
import { Currency, CurrencyType } from 'shared/types'
import { ListboxChangeEvent } from 'primevue/listbox'
import Listbox from 'primevue/listbox/Listbox.vue'
import Dialog from 'primevue/dialog/Dialog.vue'

const props = defineProps<{
    modelValue: Currency
    type: CurrencyType
    options?: Currency[]
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', value: Currency): void
}>()

const show = ref(false)

const handleToggleDialog = () => (show.value = !show.value)
const handleSelect = (event: ListboxChangeEvent) => {
    emits('update:modelValue', event.value)
    handleToggleDialog()
}
</script>
