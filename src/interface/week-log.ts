
export interface WeekLog {
    date: string
    content: string
    studentId: number
    internshipId: number
    id: number
    week: number
    weekStartDate: string
    weekEndDate: string
    isDraft: boolean
    siteInstruction: number
    contractTimes: number
    studentInternshipName: string
    studentInternshipId: number
    experience: string
    createTime: string
    evalScore: number
    evalComment: string
    evalTeacherName: string
}

export interface WeekMap {
    week: number
    startDate: string
    endDate: string
    isSelected: true
}