<template>
    <el-descriptions class="info-container" :column="column" :size="size" border>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <user />
                    </el-icon>
                    姓名
                </div>
            </template>
            {{ myinfo.name }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <dataLine />
                    </el-icon>
                    课程名称
                </div>
            </template>
            {{ myinfo.internshipName }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <dArrowRight />
                    </el-icon>
                    实习开始时间
                </div>
            </template>
            {{ myinfo.startDate }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <bottomRight />
                    </el-icon>
                    实习结束时间
                </div>
            </template>
            {{ myinfo.endDate }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <office-building />
                    </el-icon>
                    实习单位名称
                </div>
            </template>
            {{ myinfo.companyName }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <suitcase />
                    </el-icon>
                    岗位名称
                </div>
            </template>
            {{ myinfo.jobName }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <User />
                    </el-icon>
                    老师
                </div>
            </template>
            {{ myinfo.tercher }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <Finished />
                    </el-icon>
                    状态
                </div>
            </template>
            <el-tag class="ml-2" :type="myinfo.status ? 'success' : 'warning'">{{ myinfo.status ? "正常" : "未审核" }}</el-tag>
        </el-descriptions-item>
    </el-descriptions>
    <el-card class="box-card" shadow="never">
        <template #header>
            <div class="card-header">
                <span>实习进度</span>
            </div>
        </template>
        <div class="demo-progress">
            <el-progress type="dashboard" :color="colors" :percentage="progress[4]?.precent">
                <template #default>
                    <span class="percentage-value">{{ progress[4]?.written }}/{{ progress[4]?.leastSignIn }}</span>
                    <span class="percentage-label">签到</span>
                </template>
            </el-progress>
            <el-progress type="dashboard" :color="colors" :percentage="progress[0]?.precent">
                <template #default>
                    <span class="percentage-value">{{ progress[0]?.written }}/{{ progress[0]?.leastDaily }}</span>
                    <span class="percentage-label">日记</span>
                </template>
            </el-progress>
            <el-progress type="dashboard" :color="colors" :percentage="progress[1]?.precent">
                <template #default>
                    <span class="percentage-value">{{ progress[1]?.written }}/{{ progress[1]?.leastWeek }}</span>
                    <span class="percentage-label">周记</span>
                </template>
            </el-progress>
            <el-progress type="dashboard" :color="colors" :percentage="progress[2]?.precent">
                <template #default>
                    <span class="percentage-value">{{ progress[2]?.written }}/{{ progress[2]?.leastMonthSum }}</span>
                    <span class="percentage-label">月总结</span>
                </template>
            </el-progress>
            <el-progress type="dashboard" :color="colors" :percentage="progress[3]?.precent">
                <template #default>
                    <span class="percentage-value">{{ progress[3]?.written }}/{{ progress[3]?.leastSum }}</span>
                    <span class="percentage-label">总结</span>
                </template>
            </el-progress>
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue"
import { Myinfo } from "@/interface/myinfo"
import { Progress } from "@/interface/progress"
import { getInternshipInfo, getInternshipProgress } from "@/api/user"
import { ElMessage } from "element-plus"

const column = ref(2)
const myinfo = ref<Myinfo>({})
const progress = ref<Progress>({})
const colors = [
    { color: "#f56c6c", percentage: 20 },
    { color: "#e6a23c", percentage: 40 },
    { color: "#6f7ad3", percentage: 60 },
    { color: "#1989fa", percentage: 80 },
    { color: "#5cb87a", percentage: 100 },
]

const autoWidth = () => {
    if (document.documentElement.clientWidth <= 820) {
        column.value = 1
    } else {
        column.value = 2
    }
}

getInternshipInfo()
    .then((data) => {
        if (data.msg) {
            ElMessage.warning(data.msg)
        } else {
            myinfo.value.name = data.data.result[0].BasicStudentName
            myinfo.value.studentId = data.data.result[0].studentId
            myinfo.value.internshipId = data.data.result[0].PlanInternship.id
            myinfo.value.internshipName = data.data.result[0].PlanInternshipName
            myinfo.value.companyName = data.data.result[0].BasicCompanyName
            myinfo.value.jobName = data.data.result[0].PlanStudentInternshipPostName
            myinfo.value.companyId = data.data.result[0].companyId
            myinfo.value.startDate = data.data.result[0].startDate
            myinfo.value.endDate = data.data.result[0].endDate
            myinfo.value.status = data.data.result[0].status
            myinfo.value.tercher = data.data.result[0].teaInName
        }
    })
    .then(() => {
        getInternshipProgress(myinfo.value.internshipId).then((data) => {
            if (data.msg) {
                ElMessage.warning(data.msg)
            } else {
                progress.value = data.data
                //签到
                progress.value[4].precent = Math.round((progress.value[4].written / progress.value[4].leastSignIn) * 100)
                //日记
                progress.value[0].precent = Math.round((progress.value[0].written / progress.value[0].leastDaily) * 100)
                //周记
                progress.value[1].precent = Math.round((progress.value[1].written / progress.value[1].leastWeek) * 100)
                //月记
                progress.value[2].precent = Math.round((progress.value[2].written / progress.value[2].leastMonthSum) * 100)
                //总结
                progress.value[3].precent = Math.round((progress.value[3].written / progress.value[3].leastSum) * 100)
            }
        })
    })
    .then(() => {
        addEventListener("resize", autoWidth)
    })
nextTick(() => {
    autoWidth()
})
</script>

<style scoped>
.box-card {
    margin-top: 20px;
}
.percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
}
.percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 12px;
}
.demo-progress {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
</style>
