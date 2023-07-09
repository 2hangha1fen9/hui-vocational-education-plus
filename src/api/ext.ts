import request from "@/utils/request"
import { AutoCheck } from "@/interface/auto-check"

//订阅自动签到
export function subscribeCheckIn(data: AutoCheck) {
    return request({
        url: '/ext/subscribeCheckin',
        method: 'post',
        data: data
    })
}

//取消订阅
export function unsubscribeCheckIn(loginName: string) {
    return request({
        url: '/ext/unsubscribeCheckin',
        method: 'delete',
        params: {
            loginName: loginName
        }
    })
}   

//查询订阅信息
export function getSubscribeInfo(loginName: string) {
    return request({
        url: '/ext/subscribeInfo',
        method: 'get',
        params: {
            loginName: loginName
        }
    })
}  

//获取最佳签到时间
export function getAppropriateTime() {
    return request({
        url: '/ext/getAppropriateTime',
        method: 'get',
    })
}  