import axios from "axios";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form } from "react-bootstrap"
import { useToast } from "../context/toast.context"

type props = {
    enrollment: Enrollment,
    loadData: () => void,
}

// Types
type Enrollment = {
    id: string,
    graduationStatus: "PASSED" | "FAILED" | "ONGOING",
    graduationDate?: string,
    student: {
        id: string,
        name: string,
        email: string
    }
} 

function CourseStudentCard({ enrollment, loadData }: props) {

    const [formData, setFormData] = useState({
        graduationStatus: enrollment.graduationStatus,
        graduationDate: enrollment.graduationDate ? enrollment.graduationDate.split("T")[0] : "",
    })
    const [isDirty, setIsDirty] = useState(false)

    const { showToast } = useToast()

  // Detect changes
    useEffect(() => {
        const original = {
            graduationStatus: enrollment.graduationStatus,
            graduationDate: enrollment.graduationDate ? enrollment.graduationDate.split("T")[0] : "",
        }
        const changed = formData.graduationStatus !== original.graduationStatus ||
                        formData.graduationDate !== original.graduationDate
        setIsDirty(changed)
    }, [formData, enrollment])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSave = async () => {
        if (!isDirty) return
        try {
            const body = {
                graduationStatus: formData.graduationStatus,
                graduationDate: formData.graduationDate
            }
            await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/enrollments/${enrollment.id}`, body)
            loadData()
            showToast(`Successfully updated student graduation status`, "success")
        } catch (error) {
            console.error(error)
            showToast(`Failed updating student graduation status: ${error}`, "error")
        }
    }

    const handleRemoveStudent = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/enrollments/${enrollment.id}`)
            loadData()
            showToast(`Successfully removed student from this course`, "success")
        } catch (error) {
            console.error(error)
            showToast(`Failed removing student from this course: ${error}`, "error")
        }
    }

    return (
        <Col xs={12} sm={6} lg={4}>
            <Card className="student-card mb-3">
                <Card.Body className="p-3">
                    <h5>{enrollment.student.name}</h5>
                    <p className="text-muted mb-1">{enrollment.student.email}</p>
                    {/* Editable Status */}
                    <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="graduationStatus"
                            value={formData.graduationStatus}
                            onChange={handleChange}
                        >
                            <option value="PASSED">PASSED</option>
                            <option value="FAILED">FAILED</option>
                        </Form.Select>
                    </Form.Group>
                    {/* Editable Graduation Date */}
                    <Form.Group className="mb-2">
                        <Form.Label>Graduation Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="graduationDate"
                            value={formData.graduationDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {/* Status Badge */}
                    <Badge 
                        bg={formData.graduationStatus === "PASSED" ? "success" : "danger"}
                        className="mb-2"
                    >
                        {formData.graduationStatus}
                    </Badge>
                    {/* Buttons */}
                    <div className="d-flex gap-2 mt-2">
                    <Button variant="primary" size="sm" disabled={!isDirty} onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoveStudent()}>
                        Remove
                    </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )

}

export default CourseStudentCard