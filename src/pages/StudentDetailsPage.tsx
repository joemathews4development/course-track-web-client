import { useEffect, useState } from "react"
import { Card, Form, Button, Row, Col, Badge, Image } from "react-bootstrap"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { DEFAULT_IMAGE } from "../Utils/Types"
import { useToast } from "../context/toast.context"
import Loader from "../components/Loader"

function StudentDetailsPage() {
    const [student, setStudent] = useState<any>(null)
    const [formData, setFormData] = useState({ name: "", email: "" })
    const [isDirty, setIsDirty] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const { showToast } = useToast()

    const { studentId } = useParams()

    useEffect(() => {
        loadStudentDetails()
    }, [studentId])

    const loadStudentDetails = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/${studentId}`)
            setStudent(res.data)
            setFormData({
                name: res.data.name,
                email: res.data.email,
            })
        } catch (error) {
            console.log(error)
            showToast(`Failed loading student details: ${error}`, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!student) return
        setIsDirty(
            formData.name !== student.name ||
            formData.email !== student.email
        )
    }, [formData, student])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!isDirty) return
        try {
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/students/${studentId}`, formData)
            setStudent((prev: any) => ({ ...prev, ...formData }))
            setIsDirty(false)
            showToast(`Successfully updated student details`, "success")
        } catch (error) {
            console.log(error)
            showToast(`Failed updating student details: ${error}`, "error")
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/students/${studentId}`)
            navigate(`/students`)
            showToast(`Successfully deleted student`, "success")
        } catch (error) {
            console.log(error)
            showToast(`Failed deleting a student: ${error}`, "error")
        }
    }

    if (loading) return <Loader />
    if (!student) return <div>Student not found</div>

    const canDelete = student.courses.length === 0

    return (
        <div className="container py-4">
        {/* 🔹 TOP: Student Info Row */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Row className="align-items-center g-3">
                        {/* Profile Image */}
                        <Col xs={12} md={3} className="text-center">
                            <Image src={student.profileImage || DEFAULT_IMAGE} roundedCircle
                                fluid style={{ width: 120, height: 120, objectFit: "cover" }}
                            />
                        </Col>
                        {/* Editable Details */}
                        <Col xs={12} md={9}>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange}/>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" disabled={!isDirty} onClick={handleSave}>Save</Button>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {/* 🔹 COURSES SECTION */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h4 className="mb-3">Courses</h4>
                    {student.courses.length === 0 ? (
                        <p className="text-muted">No enrollments</p>
                    ) : (
                        <Row className="g-3">
                            {student.courses.map((c: any) => (
                                <Col xs={12} md={6} lg={4} key={c.id}>
                                    <Card className="h-100 border">
                                        <Card.Body>
                                            <h6>{c.course.title}</h6>
                                            <Badge bg={ c.graduationStatus === "PASSED" ? "success"
                                                    : c.graduationStatus === "FAILED" ? "danger" : "secondary"
                                                }
                                                className="mb-2"
                                            >
                                                {c.graduationStatus}
                                            </Badge>
                                            {c.graduationDate && (
                                                <div className="small text-muted">
                                                    {new Date(c.graduationDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Card.Body>
            </Card>
            {/* 🔹 DELETE */}
            <Card className="shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Danger Zone</strong>
                        <div className="text-muted small">
                            Can only delete if no courses enrolled
                        </div>
                    </div>
                <Button variant="danger" disabled={!canDelete} onClick={handleDelete}>
                    Delete Student
                </Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default StudentDetailsPage