<template>
    <div>
        <Button
            class="border-none text-white text-right inline bg-transparent"
            @click="handleToggleDialog"
        >
            <div class="flex align-items-center" style="height: 25px">
                <img
                    v-if="type === CurrencyType.crypto && modelValue?.icon"
                    class="mr-2"
                    :src="modelValue.icon"
                    :alt="modelValue.icon"
                    style="height: 25px; width: 25px"
                />
                <span
                    v-if="type === CurrencyType.fiat && modelValue?.icon"
                    class="mr-2 text-2xl"
                    >{{ modelValue.icon }}</span
                >

                <span>{{ modelValue?.symbol || 'loading...' }}</span>
            </div>
        </Button>

        <Dialog
            content-class="p-0"
            class="w-full"
            style="max-width: 400px"
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
            <div>
                <div class="mx-3">
                    <InputText
                        v-model="filter"
                        class="w-full"
                        placeholder="search by name or symbol"
                    />
                </div>
                <Listbox
                    class="border-0 w-full"
                    :options="visibleOptions"
                    :model-value="props.modelValue"
                    @change="handleSelect"
                >
                    <template #option="data">
                        <div class="flex align-items-center">
                            <span v-if="type === CurrencyType.fiat">{{
                                data.option.icon
                            }}</span>
                            <img
                                v-else
                                :src="data.option.icon"
                                alt=""
                                height="20"
                                width="20"
                            />
                            <p class="ml-2 m-0 py-2">
                                <span class="mr-1">{{
                                    data.option?.symbol
                                }}</span>
                                <span class="text-gray-300">
                                    {{ data.option.name }}
                                </span>
                            </p>
                        </div>
                    </template>
                </Listbox>
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue'
import { Currency, CurrencyType } from 'shared/types'
import { ListboxChangeEvent } from 'primevue/listbox'
import Listbox from 'primevue/listbox/Listbox.vue'
import Dialog from 'primevue/dialog/Dialog.vue'
import InputText from 'primevue/inputtext/InputText.vue'
import { cryptoIndex } from '@/plugins/algolia'
import { FilterService } from 'primevue/api'
import { asyncComputed } from '@vueuse/core'

const props = defineProps<{
    modelValue: Currency
    type: CurrencyType
    options?: Currency[]
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', value: Currency): void
}>()

const show = ref(false)
const filter = ref('')
const visibleOptions = asyncComputed(async () => {
    if (filter.value) {
        const result = FilterService.filter(
            props.options,
            ['name', 'symbol'],
            filter.value,
            'contains'
        )
        if (result.length <= 0) {
            const { hits } = await cryptoIndex.search(filter.value)
            return hits
        }
        return result
    } else {
        return props.options
    }
})

const handleToggleDialog = () => (show.value = !show.value)
const handleSelect = (event: ListboxChangeEvent) => {
    emits('update:modelValue', event.value)
    handleToggleDialog()
}
</script>
