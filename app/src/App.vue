<template>
    <div class="m-3">
        <Navbar />
        <router-view />
        <Footer class="mt-8" />
    </div>
</template>

<script setup lang="ts">
import Navbar from '@/layouts/Navbar.vue'
import Footer from '@/layouts/Footer.vue'
</script>
