<template>
    <div class="h-screen py-3 px-4">
        <Navbar class="mb-5 md:mb-8" />
        <router-view />
        <Footer class="mt-8" />
    </div>
</template>

<script setup lang="ts">
import Navbar from '@/layouts/Navbar.vue'
import Footer from '@/layouts/Footer.vue'
</script>
