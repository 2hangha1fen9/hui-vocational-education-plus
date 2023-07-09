<template>
    <div class="title">
        <p>{{ currentMonthLog.startDate }} ~ {{ currentMonthLog.endDate }} 第{{ currentMonthLog.month }}次</p>
        <el-button-group>
            <el-button v-if="isWrite(currentMonthLog.month)" size="small" type="danger" @click="deleteMonthLog"> 删除</el-button>
            <el-button size="small" type="success" @click="saveMonthLog"> 发布</el-button>
        </el-button-group>
    </div>
    <el-input style="margin-top: 10px" autosize v-model="currentMonthLog.content" placeholder="请输入月记内容" type="textarea" />
    <div style="margin-top: 10px">
        <p v-if="currentMonthLog.evalComment">{{ currentMonthLog.evalTeacherName }}:{{ currentMonthLog.evalComment }}</p>
        <p v-if="currentMonthLog.evalScore">分数：{{ currentMonthLog.evalScore }}</p>
    </div>
    <div class="month-grid-container">
        <el-tooltip v-for="data in map" :key="data.month" effect="dark" :content="`${data.startDate} ~ ${data.endDate}`">
            <div :class="isWrite(data.month) ? 'is-selected month-cell' : 'no-selected month-cell'" @click="selectCell(data.month)">
                <span :class="data.isSelected ? 'selected' : ''">第{{ data.month }}次</span>
            </div>
        </el-tooltip>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { getMonthLogTable, getMonthLogTableStatus, getMonthLogDetail, saveMonthLogDetail, delMonthLogDetail } from "@/api/logs"
import { MonthMap, MonthLog } from "@/interface/month-log"
import { getInternshipInfo } from "@/api/user"
import { ElMessage, ElMessageBox } from "element-plus"

//周记表
const map = ref<Array<MonthMap>>([])
//当前周记状态
const mapState = ref([])
//当前周记
const currentMonthLog = reactive<MonthLog>({
    isDraft: false,
})

//获取周记表
const getMap = () => {
    return getMonthLogTable(currentMonthLog.internshipId).then((data) => {
        map.value = data.data
    })
}
//获取周记表状态
const getMapState = () => {
    return getMonthLogTableStatus(currentMonthLog.internshipId).then((data) => {
        mapState.value = data.data
        mapState.value.sort((a, b) => {
            return a.month - b.month
        })
    })
}
//判断这周是否完成
const isWrite = (month: number) => {
    let flag = false
    mapState.value.forEach((item) => {
        if (item.month == month) {
            flag = true
        }
    })
    return flag
}
//根据周数获取周记id
const getMonthLogId = (month: number) => {
    let id = null
    mapState.value.forEach((item) => {
        if (item.month == month) {
            id = item.id
        }
    })
    return id
}
//选中单元格
const selectCell = (month: number) => {
    currentMonthLog.month = month
    //选中当前周
    map.value.forEach((item) => {
        if (month == item.month) {
            item.isSelected = true
            currentMonthLog.startDate = item.startDate
            currentMonthLog.endDate = item.endDate
        } else {
            item.isSelected = false
        }
    })
    //获取当前周的日志
    if (isWrite(month)) {
        getMonthLogDetail(getMonthLogId(month)).then((data) => {
            if (data.data) {
                currentMonthLog.id = data.data.id
                currentMonthLog.content = data.data.content
                currentMonthLog.evalScore = data.data.evalScore
                currentMonthLog.evalComment = data.data.evalComment
                currentMonthLog.evalTeacherName = data.data.evalTeacherName
            }
        })
    } else {
        currentMonthLog.id = null
        currentMonthLog.content = ""
        currentMonthLog.evalScore = null
        currentMonthLog.evalComment = null
        currentMonthLog.evalTeacherName = null
    }
}
//保存周记内容
const saveMonthLog = () => {
    if (currentMonthLog.content) {
        saveMonthLogDetail(currentMonthLog).then((data) => {
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
const deleteMonthLog = () => {
    if (isWrite(currentMonthLog.month) && currentMonthLog.id) {
        ElMessageBox.confirm("确认删除这篇周记?", "Warning", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }).then(() => {
            delMonthLogDetail(currentMonthLog.id).then((data) => {
                if (data.code == "0") {
                    ElMessage.success("删除成功")
                    currentMonthLog.id = null
                    currentMonthLog.content = ""
                    currentMonthLog.evalScore = null
                    currentMonthLog.evalComment = null
                    currentMonthLog.evalTeacherName = null
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
            currentMonthLog.studentId = data.data.result[0].studentId
            currentMonthLog.internshipId = data.data.result[0].PlanInternship.id
            currentMonthLog.studentInternshipName = data.data.result[0].BasicCompanyName
            currentMonthLog.studentInternshipId = data.data.result[0].id
        }
    })
    .then(() => {
        //获取周记表状态
        getMap().then(() => {
            getMapState().then(() => {
                //选中最后一个单元格
                selectCell((mapState.value && mapState.value[mapState.value.length - 1]?.month + 1) || 1 % map.value[map.value.length - 1]?.month)
            })
        })
    })
</script>

<style scoped>
.month-grid-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}
.month-cell {
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
