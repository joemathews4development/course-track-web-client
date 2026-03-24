export type Course = {
    id: string,
    title: string,
    description?: string,
    start: string,
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

export const DEFAULT_IMAGE = "https://via.placeholder.com/150?text=Profile"