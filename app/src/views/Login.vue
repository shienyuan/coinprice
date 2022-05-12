<template>
    <Card style="width: 420px" class="mx-auto">
        <template #content>
            <InputText class="w-full mb-3" v-model="email" />
            <Password
                class="w-full"
                input-class="w-full"
                v-model="password"
                :feedback="false"
            />
        </template>
        <template #footer>
            <Button class="w-full" label="Login" @click="handleLogin" />
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authSignInEmail } from '@/plugins/firebase'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext/InputText.vue'
import Password from 'primevue/password/Password.vue'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
    await authSignInEmail(email.value, password.value)
    await router.push('/admin')
}
</script>
