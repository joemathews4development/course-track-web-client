import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import Loader from "../components/Loader"
import axios from "axios"
import SearchBar from "../components/Searchbar"
import { useNavigate } from "react-router-dom"
import { DEFAULT_IMAGE } from "../Utils/Types"
import AddStudentModal from "../components/AddStudentModelComponent"
import { useToast } from "../context/toast.context"

type Student = {
    id: number
    name: string
    email: string
    profileImage?: string | null
    courses: { graduationStatus: string }[]
}

function StudentsPage() {
    const [students, setStudents] = useState<Student[] | null>(null)
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)

    const { showToast } = useToast()

    const navigate = useNavigate()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students`)
            setStudents(response.data)
        } catch (error) {
            console.log(error)
            showToast(`Failed loading students: ${error}`, "error")
        }
    }

    const handleSave = async (data: { name: string; email: string }) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/students`, data)
            loadData()
            showToast(`Successfully created a new student`, "success")
        } catch (error) {
            console.log(error)
            showToast(`Failed creating a new student: ${error}`, "error")
        }
    }

    // ✅ Loading
    if (!students) {
        return (<Loader/>)
    }

    // ✅ Filter students
    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Container className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>Students</h3>
                  <Button variant="primary" onClick={() => setShowModal(true)}>+ Add New Student</Button>
                  <AddStudentModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} />
              </div>
              {/* 🔍 Search Bar */}
              <SearchBar placeholder="Search students by name..." searchTerm={search} setSearchTerm={setSearch}></SearchBar>
              {/* ❌ No results */}
              {filteredStudents.length === 0 ? (
                  <div className="text-center mt-4"><h5>No students found</h5></div>
              ) : (
                <Row className="g-4">
                    {filteredStudents.map((student) => (
                        <Col xs={12} sm={6} lg={4} key={student.id}>
                            <Card className="shadow-sm h-100 student-card"  onClick={() => { navigate(`/students/${student.id}`) }}>
                                <Card.Body className="d-flex align-items-center gap-3">
                                    {/* 🖼️ Profile Image */}
                                    <img src={student.profileImage || DEFAULT_IMAGE}
                                        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                                        alt="profile"
                                        style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                    {/* 📄 Info */}
                                    <div>
                                        <h5 className="mb-1">{student.name}</h5>
                                        <div className="text-muted small">{student.email}</div>
                                        <div className="mt-1"><strong>Courses:</strong>{" "}{student.courses.length}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
          )}
        </Container>
    )

}

export default StudentsPage