import request from '@/utils/request'
import { LoginPayload } from '@/interface/login'
//登录
export function login(data: LoginPayload) {
    return request({
        url: '/mobile/login',
        method: 'post',
        data: data
    })
}
//获取实习信息
export function getInternshipInfo() {
    return request({
        url: '/mobile/plan/student-internship/list',
        method: 'post',
    })
}

//获取实习进度
export function getInternshipProgress(internshipId: number) {
    return request({
        url: '/mobile/back-log/stu-task-progress',
        method: 'post',
        data: {
            internshipId: internshipId
        }
    })
}