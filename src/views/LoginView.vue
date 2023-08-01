<template>
    <section class="identity-container">
        <img id="bgBox" src="https://bing.ioliu.cn/v1?w=1920&h=1080" />
        <section class="login-form">
            <el-form :model="loginData" :rules="rules" size="large" ref="loginForm" status-icon
                @keyup.enter="handleLogin(loginForm)">
                <el-form-item>
                    <h3 style="width: 100%">慧职教——重庆商务职业学院</h3>
                </el-form-item>
                <el-form-item prop="loginName">
                    <el-input class="input-box" v-model="loginData.loginName" placeholder="请输入慧职教登录名" tabindex="1"
                        autocomplete="on" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginData.password" placeholder="请输入慧职教密码" tabindex="2" type="password"
                        :show-password="true" />
                </el-form-item>
                <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
                    @click="handleLogin(loginForm)">登录</el-button>
            </el-form>
        </section>
    </section>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import { reactive, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { FormRules, FormInstance, ElMessage } from "element-plus"
import { LoginPayload } from "@/interface/login"
import { login } from "@/api/user"

const router = useRouter()
const route = useRoute()
const store = useStore()
const loading = ref(false)
const loginData = reactive<LoginPayload>({
    loginName: null,
    password: null,
    schoolId: 83,
})
const loginForm = ref<FormInstance>()
const rules = reactive<FormRules>({
    loginName: [
        {
            required: true,
            message: "登录名不能为空",
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
        },
    ],
})

//登录方法
function handleLogin() {
    loginForm.value?.validate((valid, field) => {
        if (valid) {
            loading.value = true
            login(loginData)
                .then((data) => {
                    if (data.msg) {
                        ElMessage.warning(data.msg)
                    } else {
                        //存入token
                        store.dispatch("setLoginInfo", JSON.stringify({ ...loginData, email: data.data.user.student.email }))
                        store.dispatch("setToken", data.data.sessionId)
                        router.push("/")
                    }
                    loading.value = false
                })
                .catch((error) => {
                    loading.value = false
                })
        }
    })
}
</script>

<style scoped>
.login-form {
    width: 350px;
    padding: 30px 20px 10px 20px;
    border-radius: 10px;
    color: var(--el-color-white);
    background-color: var(--el-mask-color-extra-light);
    box-shadow: rgb(0 0 0 / 20%) 0 0 10px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    overflow: hidden;
    position: relative;
}

.identity-container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#bgBox {
    z-index: -1;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 1s, transform 0.25s, filter 0.25s;
}
</style>
