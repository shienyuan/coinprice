<template>
    <main>
        <!--        <Card id="login-form" class="mx-auto" v-if="!loggedIn">-->
        <!--            <template #content>-->
        <!--                <InputText-->
        <!--                    v-model="email"-->
        <!--                    class="mb-3"-->
        <!--                    placeholder="Email"-->
        <!--                    title="123"-->
        <!--                    type="email"-->
        <!--                />-->
        <!--                <InputText-->
        <!--                    v-model="password"-->
        <!--                    placeholder="Password"-->
        <!--                    type="password"-->
        <!--                />-->
        <!--            </template>-->
        <!--            <template #footer>-->
        <!--                <Button class="w-full" label="Login" @click="handleLogin" />-->
        <!--            </template>-->
        <!--        </Card>-->

        <Card>
            <template #content>
                <Button @click="handleLogout">Logout</Button>
            </template>
        </Card>
    </main>
</template>

<script lang="ts" setup async>
import { ref } from 'vue'
import { auth, authSignInEmail, authSignOut } from '@/plugins/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const email = ref()
const password = ref()

const handleLogin = async () => {
    try {
        const user = await authSignInEmail(email.value, password.value)
        console.log(user)
    } catch (e) {
        console.error(e)
    }
}

const handleLogout = async () => {
    try {
        await authSignOut()
    } catch (e) {
        console.error(e)
    }
}
</script>

<style lang="scss" scoped>
#login-form {
    max-width: 420px;

    .p-inputtext {
        display: block;
        width: 100%;
    }
}
</style>
