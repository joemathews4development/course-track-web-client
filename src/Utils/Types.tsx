export type Course = {
    id: string,
    title: string,
    description?: string,
    start: Date,
    image?: string
}

export type Student = {
    id: string,
    name: string,
    email: string,
    profileImage: string
}

export type Enrollment = {
    id: string,
    studentId: string,
    courseId: string,
    enrolledAt: Date,
    graduationStatus: GraduationStatus,
    graduationDate?: Date
}

export type GraduationStatus = "PASSED" | "FAILED" | "ONGOING"