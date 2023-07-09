import request from '@/utils/request'
import { DailyLog } from "@/interface/daily-log"
import { WeekLog } from "@/interface/week-log"
import { MonthLog } from "@/interface/month-log"

//获取日记表
export function getDaliyLogsByMonth(year: number, month: number) {
    return request({
        url: '/mobile/process/daily-report/stu-is-Write',
        method: 'post',
        data: {
            year: year,
            month: month
        }
    })
}
//获取日记详情
export function getDaliyLogDetail(id: number) {
    return request({
        url: '/mobile/process/daily-report/view',
        method: 'post',
        data: {
            id: id,
        }
    })
}
//保存日记
export function saveDaliyLogDetail(log: DailyLog) {
    return request({
        url: '/mobile/process/daily-report/save',
        method: 'post',
        data: log
    })
}
//删除日记
export function deleteDaliyLogDetail(id: number) {
    return request({
        url: '/mobile/process/daily-report/delete',
        method: 'post',
        data: {
            id: id
        }
    })
}

//获取周记表
export function getWeekLogTable(internshipId: number) {
    return request({
        url: '/mobile/process/weekly-report/get-stuIntern-weaks',
        method: 'post',
        data: {
            internshipId: internshipId
        }
    })
}
//查看周记表状态
export function getWeekLogTableStatus(internshipId: number) {
    return request({
        url: '/mobile/process/weekly-report/find-app-write-week-maps',
        method: 'post',
        data: {
            internshipId: internshipId
        }
    })
}
//查询周记
export function getWeekLogDetail(id: number) {
    return request({
        url: '/mobile/process/weekly-report/view',
        method: 'post',
        data: {
            id: id
        }
    })
}
//写周记
export function saveWeekLogDetail(log: WeekLog) {
    return request({
        url: '/mobile/process/weekly-report/save',
        method: 'post',
        data: log
    })
}
//删除周记
export function delWeekLogDetail(id: number) {
    return request({
        url: '/mobile/process/weekly-report/delete',
        method: 'post',
        data: {
            id: id
        }
    })
}

//获取月记表
export function getMonthLogTable(internshipId: number) {
    return request({
        url: '/mobile/process/month-summary/get-stuIntern-months',
        method: 'post',
        data: {
            internshipId: internshipId
        }
    })
}
//查看月记表状态
export function getMonthLogTableStatus(internshipId: number) {
    return request({
        url: '/mobile/process/month-summary/find-app-write-month-maps',
        method: 'post',
        data: {
            internshipId: internshipId
        }
    })
}
//查询月记
export function getMonthLogDetail(id: number) {
    return request({
        url: '/mobile/process/month-summary/view',
        method: 'post',
        data: {
            id: id
        }
    })
}
//写月记
export function saveMonthLogDetail(log: MonthLog) {
    return request({
        url: '/mobile/process/month-summary/save',
        method: 'post',
        data: log
    })
}
//删除月记
export function delMonthLogDetail(id: number) {
    return request({
        url: '/mobile/process/month-summary/delete',
        method: 'post',
        data: {
            id: id
        }
    })
}