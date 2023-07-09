<template>
    <el-calendar v-model="calendar" ref="calendarGrid">
        <template #header>
            <div class="cal-btns">
                <span>{{ calendar.toLocaleDateString() }}</span>
                <el-button-group>
                    <el-button size="small" @click="selectDate('prev-month')"> 上个月 </el-button>
                    <el-button size="small" @click="selectDate('today')">今天</el-button>
                    <el-button size="small" @click="selectDate('next-month')"> 下个月</el-button>
                </el-button-group>
                <el-button-group>
                    <el-button v-if="currentDaliyLog.id" size="small" type="danger" @click="deleteDaliyLog"> 删除</el-button>
                    <el-button size="small" type="success" @click="saveDaliyLog"> 发布</el-button>
                </el-button-group>
            </div>
            <div class="write-area">
                <el-input autosize v-model="currentDaliyLog.content" placeholder="请输入日记内容" type="textarea" />
                <div style="margin-top: 10px; margin-bottom: 10px; display: flex">
                    <el-input v-model="currentDailyEval.evalComment" placeholder="评价" size="small" style="margin-right: 5px" />
                    <el-input-number size="small" v-model="currentDailyEval.evalScore" :step="5" :min="1" :max="100" style="margin-right: 5px" />
                    <el-button size="small" type="success" @click="saveDaliyLog(true)">评价</el-button>
                </div>
            </div>
        </template>
        <template #date-cell="{ data }">
            <p v-if="data.date >= startDate && data.date <= endDate" :class="isWrite(data.date) ? 'is-selected cell' : 'no-selected cell'">
                &nbsp;{{ data.date.getDate() }}
                {{ isWrite(data.date) ? "✔️" : "" }}
            </p>
            <p v-else>&nbsp;{{ data.date.getDate() }}</p>
        </template>
    </el-calendar>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { getDaliyLogsByMonth, getDaliyLogDetail, saveDaliyLogDetail, deleteDaliyLogDetail } from "@/api/logs"
import { DailyLogHistory, DailyLog, DailyLogEval } from "@/interface/daily-log"
import { getInternshipInfo } from "@/api/user"
import { ElMessage, ElMessageBox } from "element-plus"

//日历数据
const calendarGrid = ref()
const calendar = ref(new Date())
calendar.value.setHours(0, 0, 0)
//实习开始时间
const startDate = ref(new Date())
//实习结束时间
const endDate = ref(new Date())
//日记历史记录
const daliyLogHistorys = ref<Array<DailyLogHistory>>([])
//当前日记
const currentDaliyLog = reactive<DailyLog>({
    date: `${calendar.value.getFullYear()}-${calendar.value.getMonth() + 1}-${calendar.value.getDate()}`,
    content: "",
})
//当前评论
const currentDailyEval = reactive<DailyLogEval>({})

//选择日期
const selectDate = (val: string) => {
    calendarGrid.value.selectDate(val)
}
//根据月份获取日记记录
const getDaliyLog = (year: number, month: number) => {
    return getDaliyLogsByMonth(year, month).then((data) => {
        if (data.data) {
            daliyLogHistorys.value = data.data
        }
    })
}
//根据日期判断是否写了日记
const isWrite = (date: Date) => {
    let flag = false
    daliyLogHistorys.value.forEach((value) => {
        let t = new Date(value.date)
        if (t.getFullYear() === date.getFullYear() && t.getMonth() === date.getMonth() && t.getDate() === date.getDate()) {
            flag = true
        }
    })
    return flag
}
//根据id获取日记信息
const getDaliyDetailById = (id: number) => {
    getDaliyLogDetail(id).then((data) => {
        if (data.data) {
            currentDaliyLog.id = id
            currentDaliyLog.content = data.data.content
            currentDailyEval.evalScore = data.data.evalScore
            currentDailyEval.evalComment = data.data.evalComment
        } else {
            currentDaliyLog.id = null
            currentDaliyLog.content = null
            currentDailyEval.evalScore = null
            currentDailyEval.evalComment = null
        }
    })
}
//根据日期获取日记id
const getDaliyIdByDate = (dateStr: string) => {
    //取得浏览器的userAgent字符串
    var userAgent = navigator.userAgent
    //判断是否Safari浏览器
    if (userAgent.indexOf("Safari") > -1) {
        dateStr = dateStr.replace(/-/g, "/") //把'-'转成'/' yyyy/mm/dd
    }
    let date = new Date(dateStr)
    let did = null

    daliyLogHistorys.value.forEach((value) => {
        let t = new Date(value.date)
        if (date.getFullYear() == t.getFullYear() && date.getMonth() == t.getMonth() && date.getDate() == t.getDate()) {
            did = value.id
        }
    })
    return did
}
//保存日记
const saveDaliyLog = (addEval: boolean) => {
    if (currentDaliyLog.content && calendar.value >= startDate.value && calendar.value <= endDate.value) {
        saveDaliyLogDetail(addEval ? { ...currentDaliyLog, ...currentDailyEval } : currentDaliyLog).then((data) => {
            if (data.code == "0") {
                ElMessage.success(data.msg)
                setTimeout(() => {
                    getDaliyLog(calendar.value.getFullYear(), calendar.value.getMonth() + 1)
                }, 300)
            } else {
                ElMessage.warning(data.msg)
            }
        })
    } else {
        if (!currentDaliyLog.content) {
            ElMessage.warning("内容不能为空")
        }
        if (!(startDate.value && calendar.value <= endDate.value)) {
            ElMessage.warning("日期不在实习期内")
        }
    }
}
//删除日记
const deleteDaliyLog = () => {
    if (currentDaliyLog.id) {
        ElMessageBox.confirm("确认删除这篇日记?", "Warning", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }).then(() => {
            deleteDaliyLogDetail(currentDaliyLog.id).then((data) => {
                if (data.code == "0") {
                    ElMessage.success("删除成功")
                    currentDaliyLog.id = null
                    currentDaliyLog.content = null
                    currentDailyEval.evalScore = null
                    currentDailyEval.evalComment = null
                    setTimeout(() => {
                        getDaliyLog(calendar.value.getFullYear(), calendar.value.getMonth() + 1)
                    }, 300)
                } else {
                    ElMessage.warning(data.msg)
                }
            })
        })
    }
}
//日期格式化
const dateFormator = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
//获取本月的日记信息
getDaliyLog(calendar.value.getFullYear(), calendar.value.getMonth() + 1).then(() => {
    //获取这一天的日记信息
    const date = dateFormator(calendar.value)
    const did = getDaliyIdByDate(date)
    if (did) {
        getDaliyDetailById(did)
    }
})

//获取实习日期
getInternshipInfo().then((data) => {
    if (data.data.result[0]) {
        startDate.value = new Date(data.data.result[0].startDate)
        startDate.value.setHours(0, 0, 0)
        endDate.value = new Date(data.data.result[0].endDate)
        endDate.value.setHours(0, 0, 0)
        currentDaliyLog.studentId = data.data.result[0].studentId
        currentDaliyLog.internshipId = data.data.result[0].PlanInternship.id
        currentDailyEval.evalTea = data.data.result[0].teaInName
        currentDailyEval.evalTeaId = data.data.result[0].teaInId
    }
})
//监听日期变化获取日记历史记录
watch(calendar, (newValue, oldValue) => {
    if (oldValue && oldValue.getMonth() != newValue.getMonth()) {
        getDaliyLog(newValue.getFullYear(), newValue.getMonth() + 1)
    }
    //获取这一天的日记信息
    const date = dateFormator(newValue)
    const did = getDaliyIdByDate(date)
    if (did) {
        getDaliyDetailById(did)
    } else {
        currentDaliyLog.id = null
        currentDaliyLog.content = null
        currentDailyEval.evalScore = null
        currentDailyEval.evalComment = null
    }
    currentDaliyLog.date = date
})
</script>

<style scoped>
.cell {
    height: 100%;
    width: 100%;
}
.is-selected {
    color: #529b2e;
    background-color: #e1f3d8;
}
.no-selected {
    color: #b88230;
    background-color: #faecd8;
}
.el-calendar >>> .el-calendar-table td.is-selected {
    background-color: #a0cfff;
}
.el-calendar >>> .el-calendar__header {
    flex-wrap: wrap;
    padding: 0;
}
.el-calendar >>> .el-calendar__body {
    padding: 0;
}

.write-area {
    margin-top: 20px;
    width: 100%;
}
.cal-btns {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
