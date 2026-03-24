import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

type StudentFormData = {
    name: string
    email: string
}

type Props = {
    show: boolean
    onClose: () => void
    onSave: (data: StudentFormData) => void
}

function AddStudentModal({ show, onClose, onSave }: Props) {
    const [formData, setFormData] = useState<StudentFormData>({
        name: "",
        email: "",
    })
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // clear error on change
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }))
    }

    const validate = () => {
        const newErrors: typeof errors = {}
        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email";
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (!validate()) return
        onSave(formData)
        onClose()
        // reset form
        setFormData({ name: "", email: "" })
        setErrors({})
    }

    const handleCancel = () => {
        onClose()
        setErrors({})
    }

    return (
        <Modal show={show} onHide={handleCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name}
                            onChange={handleChange} isInvalid={!!errors.name} placeholder="Enter student name"
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Email */}
                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email}
                            onChange={handleChange} isInvalid={!!errors.email} placeholder="Enter email"
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.email}
                        </Form.Control.Feedback>
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

export default AddStudentModal