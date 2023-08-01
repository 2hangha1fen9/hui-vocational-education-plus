import request from "@/utils/request"
import { AutoCheck } from "@/interface/auto-check"
import { Attach } from "@/interface/attach"

//订阅自动签到
export function subscribeCheckIn(data: AutoCheck) {
    return request({
        url: "/ext/subscribeCheckin",
        method: "post",
        data: data,
    })
}

//取消订阅
export function unsubscribeCheckIn(loginName: string) {
    return request({
        url: "/ext/unsubscribeCheckin",
        method: "delete",
        params: {
            loginName: loginName,
        },
    })
}

//查询订阅信息
export function getSubscribeInfo(loginName: string) {
    return request({
        url: "/ext/subscribeInfo",
        method: "get",
        params: {
            loginName: loginName,
        },
    })
}

//获取最佳签到时间
export function getAppropriateTime() {
    return request({
        url: "/ext/getAppropriateTime",
        method: "get",
    })
}

//获取附件列表
export function getAttachList(loginName: string) {
    return request({
        url: "/ext/ListAttach",
        method: "get",
        params: {
            loginName: loginName,
        },
    })
}

//添加附件
export function addAttach(data: Attach) {
    return request({
        url: "/ext/AddAttach",
        method: "post",
        data: data,
    })
}

//删除附件
export function deleteAttach(data: Attach) {
    return request({
        url: "/ext/DeleteAttach",
        method: "delete",
        data: data,
    })
}

//附件上传
export function uploadAttach(formData: FormData) {
    return request({
        url: "/ext/UploadAttach",
        headers: {
            "content-type": "multipart/form-data",
        },
        method: "post",
        data: formData,
    })
}
