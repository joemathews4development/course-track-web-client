import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { getFormattedInputDate } from "../Utils/Constants"

type CourseFormData = {
    title: string
    description: string
    start: string
}

type Props = {
    show: boolean
    onClose: () => void
    onSave: (data: CourseFormData) => void
}

function CourseModal({ show, onClose, onSave }: Props) {
    const [formData, setFormData] = useState<CourseFormData>({
        title: "",
        description: "",
        start: new Date().toISOString(),
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "start" ? new Date(value).toISOString() : value,
        }))
    }

    const handleSave = () => {
        if (!formData.title.trim()) return; // basic validation
        onSave(formData)
        onClose()
        // reset form after close
        setFormData({
          title: "",
          description: "",
          start: "",
        })
    }

    const handleCancel = () => {
        onClose()
    }

    return (
        <Modal show={show} onHide={handleCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Title */}
                    <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title}
                          onChange={handleChange} placeholder="Enter course title"
                        />
                    </Form.Group>
                    {/* Description */}
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description"
                          value={formData.description} onChange={handleChange} placeholder="Enter description"
                        />
                    </Form.Group>
                    {/* Start Date */}
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" name="start"
                          value={ getFormattedInputDate(formData.start) } onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CourseModal