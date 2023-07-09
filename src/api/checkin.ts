import request from '@/utils/request'
import { CheckIn } from '@/interface/checkin'
//获取实习地点
export function getLocation() {
    return request({
        url: '/mobile/process/stu-location/get-mylist',
        method: 'post',
    })
}
//签到
export function check(point: CheckIn) {
    return request({
        url: '/mobile/process/stu-location/save',
        method: 'post',
        data: point
    })
}
//判断是否签到
export function isCheck(studentId: number) {
    return request({
        url: '/mobile/process/stu-location/is-sign-in',
        method: 'post',
        data: {
            studentId: studentId
        }
    })
}
//获取签到历史
export function checkHistory() {
    return request({
        url: '/mobile/process/stu-location/getMylistByDate',
        method: 'post',
        data: {
            startDate: "2022-1-1",
            endDate: "2030-1-1"
        }
    })
}