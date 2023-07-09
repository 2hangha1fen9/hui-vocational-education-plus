<template>
    <div class="title">
        <p>{{ currentWeekLog.weekStartDate }} ~ {{ currentWeekLog.weekEndDate }} 第{{ currentWeekLog.week }}周</p>
        <el-button-group>
            <el-button v-if="isWrite(currentWeekLog.week)" size="small" type="danger" @click="deleteWeekLog"> 删除</el-button>
            <el-button size="small" type="success" @click="saveWeekLog"> 发布</el-button>
        </el-button-group>
    </div>
    <el-input style="margin-top: 10px" autosize v-model="currentWeekLog.content" placeholder="请输入周记内容" type="textarea" />
    <div style="margin-top: 10px">
        <p v-if="currentWeekLog.evalComment">{{ currentWeekLog.evalTeacherName }}:{{ currentWeekLog.evalComment }}</p>
        <p v-if="currentWeekLog.evalScore">分数：{{ currentWeekLog.evalScore }}</p>
    </div>
    <div class="week-grid-container">
        <el-tooltip v-for="data in map" :key="data.week" effect="dark" :content="`${data.startDate} ~ ${data.endDate}`">
            <div :class="isWrite(data.week) ? 'is-selected week-cell' : 'no-selected week-cell'" @click="selectCell(data.week)">
                <span :class="data.isSelected ? 'selected' : ''">第{{ data.week }}周</span>
            </div>
        </el-tooltip>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { getWeekLogTable, getWeekLogTableStatus, getWeekLogDetail, saveWeekLogDetail, delWeekLogDetail } from "@/api/logs"
import { WeekMap, WeekLog } from "@/interface/week-log"
import { getInternshipInfo } from "@/api/user"
import { ElMessage, ElMessageBox } from "element-plus"

//周记表
const map = ref<Array<WeekMap>>([])
//当前周记状态
const mapState = ref([])
//当前周记
const currentWeekLog = reactive<WeekLog>({
    isDraft: false,
    contactTimes: 0,
    siteInstruction: 0,
})

//获取周记表
const getMap = () => {
    return getWeekLogTable(currentWeekLog.internshipId).then((data) => {
        map.value = data.data
    })
}
//获取周记表状态
const getMapState = () => {
    return getWeekLogTableStatus(currentWeekLog.internshipId).then((data) => {
        mapState.value = data.data
        mapState.value.sort((a, b) => {
            return a.week - b.week
        })
    })
}
//判断这周是否完成
const isWrite = (week: number) => {
    let flag = false
    mapState.value.forEach((item) => {
        if (item.week == week) {
            flag = true
        }
    })
    return flag
}
//根据周数获取周记id
const getWeekLogId = (week: number) => {
    let id = null
    mapState.value.forEach((item) => {
        if (item.week == week) {
            id = item.id
        }
    })
    return id
}
//选中单元格
const selectCell = (week: number) => {
    currentWeekLog.week = week
    //选中当前周
    map.value.forEach((item) => {
        if (week == item.week) {
            item.isSelected = true
            currentWeekLog.date = item.endDate
            currentWeekLog.weekStartDate = item.startDate
            currentWeekLog.weekEndDate = item.endDate
        } else {
            item.isSelected = false
        }
    })
    //获取当前周的日志
    if (isWrite(week)) {
        getWeekLogDetail(getWeekLogId(week)).then((data) => {
            if (data.data) {
                currentWeekLog.id = data.data.id
                currentWeekLog.content = data.data.content
                currentWeekLog.evalScore = data.data.evalScore
                currentWeekLog.evalComment = data.data.evalComment
                currentWeekLog.evalTeacherName = data.data.evalTeacherName
            }
        })
    } else {
        currentWeekLog.id = null
        currentWeekLog.content = ""
        currentWeekLog.evalScore = null
        currentWeekLog.evalComment = null
        currentWeekLog.evalTeacherName = null
    }
}
//保存周记内容
const saveWeekLog = () => {
    if (currentWeekLog.content) {
        saveWeekLogDetail(currentWeekLog).then((data) => {
            if (data.code == "0") {
                ElMessage.success("发布成功")
                setTimeout(() => {
                    getMapState()
                }, 300)
            } else {
                ElMessage.warning(data.msg)
            }
        })
    } else {
        ElMessage.warning("内容不能为空")
    }
}
//删除周记
const deleteWeekLog = () => {
    if (isWrite(currentWeekLog.week) && currentWeekLog.id) {
        ElMessageBox.confirm("确认删除这篇周记?", "Warning", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }).then(() => {
            delWeekLogDetail(currentWeekLog.id).then((data) => {
                if (data.code == "0") {
                    ElMessage.success("删除成功")
                    currentWeekLog.id = null
                    currentWeekLog.content = ""
                    currentWeekLog.evalScore = null
                    currentWeekLog.evalComment = null
                    currentWeekLog.evalTeacherName = null
                    setTimeout(() => {
                        getMapState()
                    }, 300)
                } else {
                    ElMessage.warning(data.msg)
                }
            })
        })
    }
}

//获取实习信息
getInternshipInfo()
    .then((data) => {
        if (data.data.result[0]) {
            currentWeekLog.studentId = data.data.result[0].studentId
            currentWeekLog.internshipId = data.data.result[0].PlanInternship.id
            currentWeekLog.studentInternshipName = data.data.result[0].BasicCompanyName
            currentWeekLog.studentInternshipId = data.data.result[0].id
        }
    })
    .then(() => {
        //获取周记表状态
        getMap().then(() => {
            getMapState().then(() => {
                //选中最后一个单元格
                selectCell((mapState.value && mapState.value[mapState.value.length - 1]?.week + 1) || 1 % map.value[map.value.length - 1]?.week)
            })
        })
    })
</script>

<style scoped>
.week-grid-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}
.week-cell {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 65px;
    height: 65px;
    background: red;
    margin: 10px;
}
.no-selected {
    color: #b88230;
    background-color: #faecd8;
}
.is-selected {
    color: #529b2e;
    background-color: #e1f3d8;
}
.selected {
    color: #79bbff;
}
.title {
    display: flex;
    justify-content: space-between;
}
</style>
