
export interface MonthLog {
    content: string
    studentId: number
    internshipId: number
    id: number
    month: number
    startDate: string
    endDate: string
    isDraft: boolean
    studentInternshipName: string
    studentInternshipId: number
    experience: string
    createTime: string
    evalScore: number
    evalComment: string
    evalTeacherName: string
}

export interface MonthMap {
    month: number
    startDate: string
    endDate: string
    isSelected: true
}