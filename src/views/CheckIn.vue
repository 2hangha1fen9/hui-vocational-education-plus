<template>
    <!-- <div v-if="checkPoint"> -->
    <div>
        <div class="address">
            <p>签到坐标点： {{ currentAddress }} X:{{ parseFloat(point.lng).toFixed(6) }} Y:{{ parseFloat(point.lat).toFixed(6) }}
            </p>
            <p>实习坐标点：{{ checkPoint?.provinceName ?? "" + checkPoint?.cityName ?? "" + checkPoint?.districtName ?? "" +
                checkPoint?.address ?? "" }} X:{{
        checkPoint?.locationY ?? 0 }} Y:{{ checkPoint?.locationX ?? 0 }}</p>
        </div>
        <div class="menu">
            <div class="check-btn">

                <el-button type="success" :disabled="disabled" @click="handleCheck">
                    <span v-if="!disabled">签到{{ time.hour }}:{{ time.min }}</span>
                    <span v-else>今日已签到</span>
                </el-button>
                <el-input style="padding-left: 10px" v-model="checkIn.content" placeholder="备注" clearable />
                <el-tag style="margin-left: 10px;">已选择{{
                    attachFileCheckedCount }}/{{ attachFileList.length }}个附件</el-tag>
                <el-checkbox style="padding-left: 10px" v-model="checkIn.isEvection" label="出差" size="large" :true-label="1"
                    :false-label="0" />

            </div>
            <div class="check-btn">

                <el-button type="primary" @click="attachDialogVisible = true">签到附件设置</el-button>
                <el-button type="primary" @click="resetPoint">坐标重置</el-button>
                <el-button :type="autoCheckBtnColor" @click="autoCheckDialogVisible = true">{{ autoCheckBtnText
                }}</el-button>
            </div>
        </div>
        <div id="map"></div>
        <el-card class="box-card" shadow="never">
            <template #header>
                <div class="card-header">
                    <span>签到历史</span>
                </div>
            </template>
            <el-timeline>
                <el-timeline-item v-for="h in checkHistorys" :key="h.id" :timestamp="convertTime(h.createTime)">
                    <div class="timeline-item">
                        <p>{{ h.label }}</p>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <p>X:{{ h.locationX }} Y:{{ h.locationY }}</p>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </el-card>
        <el-dialog v-model="attachDialogVisible" title="签到附件设置" style="width: 600px; max-width: 100%">
            <el-upload v-model:file-list="attachFileList" action="#" :http-request="handleUploadAttach"
                list-type="picture-card" :on-remove="(file) => deleteAttach(file)" :on-preview="handleAttachPreview"
                ref="uploader">
                <el-icon>
                    <Plus />
                </el-icon>
                <template #file="scope">
                    <div>
                        <img :src="scope.file.url" style="object-fit: cover;height: 100%;width: 100%;">
                        <el-checkbox v-model="scope.file.checked" size="large"
                            style="position: absolute;top: 0px;left: 10px;" />
                        <el-button type="danger" :icon="Delete" circle style="position: absolute;bottom: 10px;right: 10px;"
                            @click="uploader.handleRemove(scope.file)" />
                    </div>

                </template>
            </el-upload>

        </el-dialog>
        <el-dialog v-model="autoCheckDialogVisible" title="自动签到" style="width: 600px; max-width: 100%">
            <el-form :model="autoCheck" label-width="90px">
                <el-form-item label="签到坐标"> {{ autoCheck.label }} X:{{ autoCheck.locationX }} Y:{{ autoCheck.locationY }}
                </el-form-item>
                <el-form-item label="通知邮箱">
                    <el-input v-model="autoCheck.email" clearable />
                </el-form-item>
                <el-form-item label="签到时间">
                    <el-tooltip placement="top" content="为了减轻服务器压力,已设置为推荐时间">
                        <div>
                            <el-time-picker v-model="timerPicker" format="HH:mm" />
                        </div>
                    </el-tooltip>
                    <el-button style="margin-left: 10px;" @click="attachDialogVisible = true">已选择{{
                        attachFileCheckedCount }}/{{ attachFileList.length }}个附件</el-button>
                </el-form-item>
                <el-form-item label="个性设置">
                    <el-checkbox style="padding-left: 10px" v-model="autoCheck.startTime[2]" label="周六签到" size="large"
                        :true-label="1" :false-label="0" />
                    <el-checkbox style="padding-left: 10px" v-model="autoCheck.startTime[3]" label="周日签到" size="large"
                        :true-label="1" :false-label="0" />
                    <el-checkbox style="padding-left: 10px" v-model="autoCheck.randomAttach"
                        :label="`随机上传所有附件(当前${attachFileList.length}个)`" size="large" @click="clearCheckedAttachFileList" />
                    <el-checkbox style="padding-left: 10px" v-model="autoCheck.tFloat" label="浮动时间" size="large" />
                    <el-checkbox style="padding-left: 10px" v-model="autoCheck.lFloat" label="浮动位置" size="large" />

                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelAutoCheck" v-if="cancelAutoCheckBtnEnable">关闭自动签到</el-button>
                    <el-button type="primary" @click="submitAutoCheck">保存</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
    <!-- <div v-else>你还没有开始实习</div> -->
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import { ref, nextTick, reactive, watch } from "vue"
import { getLocation, check, checkHistory } from "@/api/checkin"
import { subscribeCheckIn, unsubscribeCheckIn, getSubscribeInfo, getAppropriateTime, uploadAttach, getAttachList, deleteAttach } from "@/api/ext"

import {
    Delete,
} from '@element-plus/icons-vue'

import { CheckPoint } from "@/interface/check-point"
import { CheckIn } from "@/interface/CheckIn"
import { ElMessage, UploadRequestOptions } from "element-plus"
import { AutoCheck } from "@/interface/auto-check"
import { Attach } from "@/interface/attach"


const store = useStore()
const loginInfo = JSON.parse(store.getters["loginInfo"])

let Bmap = window.BMapGL // 注意要带window，不然会报错（注意官方api,会有改动，之前是Bmap,后面3.0版本改为了BMap,最好查文档或者打印一下window）
let map = {}
//计时器
const time = reactive({
    hour: new Date().getHours(),
    min: new Date().getMinutes(),
})
//地图坐标
const point = ref({})
//地图标记
const marker = ref({})
//实习签到点
const checkPoint = ref<CheckPoint>({})
//当前地址
const currentAddress = ref("")
//签到信息
const checkIn = reactive<CheckIn>({
    checkType: "CHECKIN",
    locationX: 0,
    locationY: 0,
    scale: 16,
    label: "",
    mapType: "baidu",
    content: "",
    isAbnormal: false,
    isEvection: 0,
    studentId: null,
    internshipId: null,
})
//签到历史
const checkHistorys = ref<Array<CheckIn>>()
//自动签到对话框
const autoCheckDialogVisible = ref(false)
const timerPicker = ref(new Date(0, 0, 0, 7, 0))
const autoCheckBtnText = ref("自动签到")
const autoCheckBtnColor = ref("primary")
const autoCheck = reactive<AutoCheck>({
    loginName: loginInfo.loginName,
    password: loginInfo.password,
    schoolId: loginInfo.schoolId,
    email: loginInfo.email,
    startTime: [7, 0, 0, 0],
    tFloat: false,
    studentId: null,
    internshipId: null,
    locationX: 0,
    locationY: 0,
    lFloat: false,
    label: "",
    content: "",
    attachIds: [],
    randomAttach: false
})

//获取自动签到订阅信息
const getAutoCheckInfo = () => {
    getSubscribeInfo(autoCheck.loginName).then((data) => {
        if (data) {
            autoCheck.email = data.email
            autoCheck.startTime = data.startTime
            autoCheck.label = data.label
            autoCheck.locationX = data.locationX
            autoCheck.locationY = data.locationY
            autoCheck.tFloat = data.tFloat
            autoCheck.lFloat = data.lFloat
            autoCheckBtnText.value = "自动签到(已开启)"
            autoCheckBtnColor.value = "success"
            cancelAutoCheckBtnEnable.value = true
        } else {
            cancelAutoCheckBtnEnable.value = false
        }
    })
}
//自动签到
const submitAutoCheck = () => {
    autoCheck.studentId = checkIn.studentId
    autoCheck.internshipId = checkIn.internshipId
    autoCheck.locationX = checkIn.locationX
    autoCheck.locationY = checkIn.locationY
    autoCheck.label = checkIn.label
    autoCheck.content = checkIn.content
    autoCheck.startTime[0] = timerPicker.value.getHours()
    autoCheck.startTime[1] = timerPicker.value.getMinutes()
    subscribeCheckIn(autoCheck).then((data) => {
        ElMessage.success("订阅成功")
        autoCheckDialogVisible.value = false
        autoCheckBtnText.value = "自动签到(已开启)"
        cancelAutoCheckBtnEnable.value = true
        autoCheckBtnColor.value = "success"
    })
}
//取消自动签到
const cancelAutoCheckBtnEnable = ref(false)
const cancelAutoCheck = () => {
    unsubscribeCheckIn(autoCheck.loginName).then((data) => {
        ElMessage.success("取消成功")
        cancelAutoCheckBtnEnable.value = false
        autoCheckDialogVisible.value = false
        autoCheckBtnText.value = "自动签到"
        autoCheckBtnColor.value = "primary"
    })
}

//附件设置
const uploader = ref()
//对话框
const attachDialogVisible = ref(false)
//附件列表
const attachFileList = ref([])
const attachFileCheckedCount = ref(0)
watch(attachFileList, (newVal, oldVal) => {
    let checkedList = newVal.filter(i => i.checked);
    attachFileCheckedCount.value = checkedList.length;
    if (checkedList.length > 0) {
        checkIn.attachIds = checkedList.map(i => i.id).join(',')
        autoCheck.attachIds = checkedList.map(i => i.id)
        autoCheck.randomAttach = false
    }
    else {
        checkIn.attachIds = ""
        autoCheck.attachIds = []
    }
}, {
    deep: true
})
const clearCheckedAttachFileList = () => {
    attachFileList.value.forEach(i => i.checked = false)
}
const getAttach = async () => {
    var result = await getAttachList(JSON.parse(store.getters['loginInfo']).loginName)
    if (result) {
        attachFileList.value = []
        result.forEach(element => {
            const file = {
                ...element,
                checked: false,
                url: `http://183.230.44.139:8090/mobile/sys/attach/view-image?token=${store.getters['token']}&id=${element.id}`
            }
            attachFileList.value.push(file)
        });
    }

}
//上传文件
const handleUploadAttach = async (option: UploadRequestOptions) => {
    console.log(option)
    let formData = new FormData();
    formData.append("file", option.file);
    formData.append("token", store.getters['token']);
    formData.append("loginName", JSON.parse(store.getters['loginInfo']).loginName);

    let result = await uploadAttach(formData)
    if (result) {
        attachFileList.value = attachFileList.value.filter(i => !i.raw)
        attachFileList.value.push({
            ...result,
            checked: false,
            url: `http://183.230.44.139:8090/mobile/sys/attach/view-image?token=${store.getters['token']}&id=${result.id}`
        })
    }
    else {
        option.onError(result);
    }
}
const handleAttachPreview = (file) => {
    file.status = ""
    console.log(file)
}


//签到
const handleCheck = () => {
    check(checkIn).then((data) => {
        if (data.code == "1") {
            ElMessage.warning(data.msg)
        } else {
            ElMessage.success("签到成功")
            disabled.value = true
        }
    })
}
//获取当前坐标地址
const getAddress = () => {
    // 创建地理编码实例, 并配置参数获取乡镇级数据
    var myGeo = new Bmap.Geocoder({ extensions_town: true })
    // 根据坐标得到地址描述
    myGeo.getLocation(point.value, function (result) {
        if (result) {
            currentAddress.value = result.address + (result.surroundingPois[0]?.title || "")
            checkIn.label = autoCheck.label = result.address + (result.surroundingPois[0]?.title || "")
            checkIn.locationX = autoCheck.locationX = parseFloat(parseFloat(point.value.lng).toFixed(6))
            checkIn.locationY = autoCheck.locationY = parseFloat(parseFloat(point.value.lat).toFixed(6))
        }
    })
}

//重置坐标
const resetPoint = () => {
    point.value = new Bmap.Point(checkPoint.value.locationY, checkPoint.value.locationX)
    marker.value.setPosition(point.value)
    map.centerAndZoom(point.value, 17)
    getAddress()
}
//初始化地图
const init = () => {
    map = new Bmap.Map("map")
    point.value = new Bmap.Point(checkPoint.value.locationY ?? 0, checkPoint.value.locationX ?? 0) // 创建坐标点
    // 创建标记点
    marker.value = new Bmap.Marker(point.value, {
        enableDragging: true,
    })

    // 绘制圆
    var circle = new Bmap.Circle(new Bmap.Point(checkPoint.value.locationY, checkPoint.value.locationX), 3000, {
        strokeColor: "green",
        strokeWeight: 2,
        strokeOpacity: 0.2,
        fillColor: "green",
        fillOpacity: 0.1,
    })

    //标记点拖动事件
    marker.value.addEventListener("dragend", function () {
        point.value = marker.value.getPosition()
        getAddress()
    })

    map.addOverlay(circle)
    map.addOverlay(marker.value)
    map.enableScrollWheelZoom(true)
    map.centerAndZoom(point.value, 17)

    getAddress() //获取当前地址信息
}
const convertTime = (time: number) => {
    let date = new Date(time)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}
//按钮状态
const disabled = ref(false)
nextTick(() => {
    getAttach();
    //获取实习信息
    getLocation()
        .then((data) => {
            if (data.data) {
                checkPoint.value.locationX = parseFloat(data.data.info.locationX)
                checkPoint.value.locationY = parseFloat(data.data.info.locationY)
                checkPoint.value.provinceName = data.data.info.provinceName
                checkPoint.value.cityName = data.data.info.cityName
                checkPoint.value.districtName = data.data.info.districtName
                checkPoint.value.address = data.data.info.address
                checkIn.internshipId = data.data.info.internshipId
                checkIn.studentId = data.data.info.studentId
                checkIn.locationX = data.data.info.locationX
                checkIn.locationY = data.data.info.locationY
            } else {
                checkPoint.value = null
            }
        })
        .then(() => {
            //调用初始化方法
            init()
            //获取签到历史
            checkHistory().then((data) => {
                checkHistorys.value = data.data.list
                let recently = new Date(checkHistorys.value[0]?.createTime || -1)
                let now = new Date()
                if (recently.getFullYear() == now.getFullYear() && recently.getMonth() == now.getMonth() && recently.getDate() == now.getDate()) {
                    disabled.value = true
                } else {
                    disabled.value = false
                }
            })
            getAutoCheckInfo()
            getAppropriateTime().then((data) => {
                if (data) {
                    timerPicker.value = new Date(0, 0, 0, data[0], data[1])
                }
            })

        })

    time.timer = setInterval(() => {
        let now = new Date()
        time.hour = now.getHours()
        time.min = now.getMinutes()
    }, 100)
})
</script>
<style scoped>
.box-card {
    margin-top: 20px;
}

#map {
    width: 100%;
    height: 400px;
}

.menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.address {
    margin-bottom: 20px;
}

.check-btn {
    display: flex;
    justify-content: center;
    align-items: center;
}

.timeline-item {
    display: flex;
    flex-wrap: wrap;
}
</style>
