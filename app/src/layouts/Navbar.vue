<template>
    <nav class="flex justify-content-between align-items-center">
        <p
            class="m-0 font-bold text-xl cursor-pointer"
            @click="$router.replace('/')"
        >
            CoinPrice
            <span class="font-light text-sm">v{{ version }}</span>
        </p>
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
</template>

<script setup lang="ts">
import { version } from '../../package.json'
const navigateToSocial = (url: string) => {
    window.open(url)
}
</script>
