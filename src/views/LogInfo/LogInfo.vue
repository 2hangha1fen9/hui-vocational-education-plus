<template>
    <el-tabs type="border-card">
        <el-tab-pane label="日记"><DaliyLog /></el-tab-pane>
        <el-tab-pane label="周记"><WeekLog /></el-tab-pane>
        <el-tab-pane label="月记"><MonthLog /></el-tab-pane>
    </el-tabs>
</template>

<script setup lang="ts">
import DaliyLog from "./DaliyLog.vue"
import WeekLog from "./WeekLog.vue"
import MonthLog from "./MonthLog.vue"
</script>

<style></style>
