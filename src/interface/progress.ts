//登录请求
export interface Progress {
    daily: {
        written: number
        leastDaily: number
        precent: number
    },
    week: {
        written: number
        leastWeek: number
        precent: number
    },
    monthSum: {
        written: number
        leastMonthSum: number
        precent: number
    },
    sum: {
        written: number
        leastSum: number
        precent: number
    },
    signIn: {
        written: number
        leastSignIn: number
        precent: number
    }
}