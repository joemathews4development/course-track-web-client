import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Container, Card, Row, Col, Form } from "react-bootstrap"
import { Button } from "react-bootstrap"
import axios from "axios"
import CourseStudentCard from "../components/CourseStudentCard"
import Loader from "../components/Loader"
import { useToast } from "../context/toast.context"
import { getFormattedInputDate } from "../Utils/Constants"

// Types
type Enrollment = {
    id: string,
    graduationStatus: "PASSED" | "FAILED" | "ONGOING",
    graduationDate?: string,
    student: {
      id: string,
      name: string,
      email: string,
    }
}

type Course = {
    id: string,
    title: string,
    description: string,
    start: string,
    enrollments: Enrollment[]
}

type FilterType = "ALL" | "PASSED" | "FAILED" | "ONGOING"

function CourseDetails() {
    const { courseId } = useParams()
    const [course, setCourse] = useState<Course | null>(null)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<FilterType>("ALL")
    const [allStudents, setAllStudents] = useState<any[]>([])
    const [selectedStudent, setSelectedStudent] = useState("")

    const { showToast } = useToast()

    const [formData, setFormData] = useState({
        title: course?.title ?? "",
        start: course?.start ?? "",
        description: course?.description ?? "",
    })

    useEffect(() => {
        loadData();
    }, [courseId]);

    const loadData = async () => {
        try {
            const [courseResponse, studentsResponse] = await Promise.all([
              axios.get(`${import.meta.env.VITE_SERVER_URL}/api/courses/${courseId}`),
              axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/courses/${courseId}`),
            ])
            console.log(courseResponse.data)
            setCourse(courseResponse.data)
            setAllStudents(studentsResponse.data)
            setFormData({
                title: courseResponse.data.title,
                start: courseResponse.data.start,
                description: courseResponse.data.description
            })
        } catch (error) {
            console.log(error)
            showToast(`Failed loading course details: ${error}`, "error")
        }
    }

    const handleAddStudent = async () => {
        try {
            const body = {
              studentId: selectedStudent,
              courseId: courseId,
              enrolledAt: new Date(),
            }
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/enrollments`, body)
            loadData()
            setSelectedStudent("")
            showToast(`Successfully added a student to course`, "success")
        } catch (error) {
            console.error(error)
            showToast(`Failed adding student to course: ${error}`, "error")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
          ...prev,
          [name]: name === "start" ? new Date(value).toISOString() : value,
        }))
    }

    const handleSave = async () => {
        try {
            const body = {
              title: formData.title,
              description: formData.description,
              start: formData.start,
            }
            console.log(body)
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/courses/${courseId}`, body)
            loadData()
            showToast(`Successfully updated course details`, "success")
        } catch (error) {
            console.error(error)
            showToast(`Failed updating course details: ${error}`, "error")
        }
    }

    // ✅ Loading
    if (!course) {
        return (<Loader />)
    }

    // ✅ Filter + Search logic
    const filteredStudents = course?.enrollments?.filter((enrollment) => {
        const matchesSearch = enrollment.student.name
                              .toLowerCase()
                              .includes(search.toLowerCase())
        const matchesFilter = filter === "ALL" || enrollment.graduationStatus === filter
        return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
        return a.student.name
        .toLowerCase()
        .localeCompare(b.student.name.toLowerCase());
    })

    return (
        <Container className="mt-4">
            {/* 📘 Course Info */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={9}>
                            <Form>
                                {/* Title */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title"
                                      value={formData.title} onChange={handleChange}
                                    />
                                </Form.Group>
                                {/* Start Date */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="datetime-local" name="start"
                                      value={getFormattedInputDate(formData.start)} onChange={handleChange}
                                    />
                                </Form.Group>
                                {/* Description (multiline) */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={4} name="description"
                                      value={formData.description} onChange={handleChange}
                                    />
                                </Form.Group>
                                {/* Total Students (read-only) */}
                                <p><strong>Total Students:</strong> {course.enrollments.length}</p>
                            </Form>
                        </Col>
                        {/* Save Button on Right */}
                        <Col md={3} className="d-flex align-items-start justify-content-end">
                            <Button variant="primary" onClick={handleSave}>Save</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Row className="mb-4 g-2">
                <Col md={8}>
                    <Form.Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                        <option value="">Select student to add</option>
                        {allStudents.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Button variant="primary" className="w-100"
                      disabled={!selectedStudent} onClick={handleAddStudent}
                    >
                        ➕ Add Student
                    </Button>
                </Col>
            </Row>

            {/* 🔍 Search + Filter */}
            <Row className="mb-3 g-2">
                <Col md={8}>
                    <Form.Control type="text" placeholder="🔍 Search students..."
                      value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Form.Select
                      value={filter}
                      onChange={(e) =>
                        setFilter(e.target.value as "ALL" | "PASSED" | "FAILED")
                      }
                    >
                      <option value="ALL">All Students</option>
                      <option value="PASSED">Passed</option>
                      <option value="FAILED">Failed</option>
                    </Form.Select>
                </Col>
            </Row>
            {/* 👥 Students List */}
            {filteredStudents.length === 0 ? (
              <div className="text-center mt-4">
                  <h5>No students found</h5>
              </div>
            ) : (
              <Row className="g-3">
                  {filteredStudents.map((s) => (
                      <CourseStudentCard key={s.id} enrollment={s} loadData={loadData} />
                  ))}
              </Row>
          )}
        </Container>
    )

}

export default CourseDetails
