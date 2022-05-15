<template>
    <div>
        <nav class="flex justify-content-between align-items-center">
            <h1
                class="m-0 font-bold text-xl cursor-pointer"
                @click="$router.replace('/')"
            >
                CoinPrice
                <span class="font-light text-sm">v{{ version }}</span>
            </h1>
            <div class="flex align-items-center">
                <Button
                    class="p-button-rounded p-button-info p-button-text"
                    icon="pi pi-discord"
                    @click="navigateToSocial('https://discord.gg/4XvHekvAtt')"
                />
                <Button
                    class="p-button-rounded p-button-info p-button-text"
                    icon="pi pi-twitter"
                    @click="navigateToSocial('https://twitter.com/shienyuan97')"
                />
            </div>
        </nav>
        <Message sticky
            >CoinPrice is new and I'd love for your support and feedback, join
            me on
            <a
                class="underline"
                href="https://discord.gg/4XvHekvAtt"
                target="_blank"
            >
                Discord
            </a>
        </Message>
    </div>
</template>

<script setup lang="ts">
import { version } from '../../package.json'
import Message from 'primevue/message/Message.vue'

const navigateToSocial = (url: string) => {
    window.open(url)
}
</script>
