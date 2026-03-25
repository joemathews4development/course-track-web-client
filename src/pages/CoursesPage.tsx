import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Badge, ProgressBar, Button } from "react-bootstrap"
import Loader from "../components/Loader"
import axios from "axios"
import SearchBar from "../components/Searchbar"
import CourseModal from "../components/AddNewCourseModalComponent"

type Course = {
    id: number
    title: string
    start: string
    totalStudents: number
    passedStudents: number
    failedStudents: number
}

function CoursesPage() {

    const [courses, setCourses] = useState<Course[] | null>(null)
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
      loadData()
    }, [])

    const loadData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/courses`)
          setCourses(response.data)
        } catch (error) {
          console.log(error);
        }
    }

    const handleSave = async (data: {title: string, description: string, start: string}) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/courses`, data)
            loadData()
        } catch (error) {
            console.log(error)
        }      
    }

    const filteredCourses = courses ? courses.filter((course) =>
          course.title.toLowerCase().includes(search.toLowerCase())
        ) : []

    // ✅ Loading state
    if (!filteredCourses) {
        return <Loader />
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Courses</h3>
                <Button variant="primary" onClick={() => setShowModal(true)}>+ Add New Course</Button>
                <CourseModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} />
            </div>
            <Row>
                <SearchBar placeholder="Search courses by title..." searchTerm={search} setSearchTerm={setSearch}></SearchBar>
            </Row>
            <Row className="g-4">
                  {filteredCourses.length <= 0 && (
                      <div className="text-center mt-5">
                          <h5>No courses available</h5>
                      </div>
                  )}
                  {filteredCourses.length > 0 &&
                      filteredCourses.map((course) => (
                          <Col xs={12} sm={6} lg={4} key={course.id}>
                              <Card className="shadow-sm h-100" onClick={() => { navigate(`/courses/${course.id}`) }}>
                                  <Card.Body>
                                      <Card.Title>{course.title}</Card.Title>
                                      <Card.Text>
                                          <strong>Start:</strong>{" "} {new Date(course.start).toLocaleDateString()}
                                      </Card.Text>
                                      <Card.Text>
                                        <strong>Total Students:</strong> {course.totalStudents}
                                      </Card.Text>
                                      <div className="d-flex gap-2 flex-wrap">
                                          <Badge bg="success">Passed: {course.passedStudents}</Badge>
                                          <Badge bg="danger">Failed: {course.failedStudents}</Badge>
                                      </div>
                                      {/* ✅ Progress Bar (ADD HERE) */}
                                      <ProgressBar className="mt-3"
                                        now={ course.totalStudents > 0 ? (course.passedStudents / course.totalStudents) * 100 : 0 }
                                        label={
                                          `${ course.totalStudents > 0 ? 
                                              Math.round((course.passedStudents / course.totalStudents) * 100)
                                              : 0 }% Passed`
                                            }
                                      />
                                  </Card.Body>
                              </Card>
                          </Col>
                      ))
                  }
            </Row>
        </Container>
    )
}

export default CoursesPage;
