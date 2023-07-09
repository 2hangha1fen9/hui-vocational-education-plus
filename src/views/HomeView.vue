<template>
    <el-menu class="menu" mode="horizontal" router :default-active="defaultActive">
        <el-menu-item index="/user" style="background: none" @click="router.replace('/user')">个人信息</el-menu-item>
        <el-menu-item index="/checkin" style="background: none" @click="router.replace('/checkin')">签到</el-menu-item>
        <el-menu-item index="/logs" style="background: none" @click="router.replace('/logs')">日志</el-menu-item>
    </el-menu>
    <div style="padding: 10px">
        <router-view />
    </div>
    
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance, watch } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const defaultActive = ref<string>()
watch(
    route,
    (newVal) => {
        defaultActive.value = decodeURI(newVal.path)
    },
    {
        immediate: true,
    }
)
</script>
<style scoped>
.menu {
    display: flex;
    justify-content: center;
    height: 40px;
}
</style>
