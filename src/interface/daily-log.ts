//日志历史记录
export interface DailyLogHistory {
    id: number
    date: string
}
//日志
export interface DailyLog {
    id: number
    date: string
    content: string
    studentId: number
    internshipId: number
}

//日期评价
export interface DailyLogEval {
    evalScore: number
    evalComment: string
    evalTea: string
    evalTeaId: string
}