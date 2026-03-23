import axios from "axios"
import { useEffect, useState } from "react"
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBook, FaUsers, FaClipboardList, FaClock } from "react-icons/fa";
import type { Course } from "../Utils/Types"
import Loader from "../components/Loader"
import UpcomingCoursesList from "../components/UpcomingCoursesList";

type Result = {
  courses: number;
  students: number;
  enrollments: number;
  upcomingCourses: Course[];
}


function HomePage() {

    const [specs, setSpecs] = useState<Result | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/specs`)
            console.log(response)
            setSpecs(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    
    if (!specs) {
        return <Loader/>;
    }
  return (
    <Container className="vh-100 d-flex flex-column justify-content-top ">
      <Row className="g-4 justify-content-center py-4">
        
        {/* Courses */}
        <Col xs={12} sm={6} md={3}>
          <Card className="text-white bg-primary shadow-lg text-center p-4 h-100">
            <FaBook size={40} className="mb-3" />
            <h5>Courses</h5>
            <h2>{specs.courses}</h2>
          </Card>
        </Col>

        {/* Students */}
        <Col xs={12} sm={6} md={3}>
          <Card className="text-white bg-success shadow-lg text-center p-4 h-100">
            <FaUsers size={40} className="mb-3" />
            <h5>Students</h5>
            <h2>{specs.students}</h2>
          </Card>
        </Col>

        {/* Enrollments */}
        <Col xs={12} sm={6} md={3}>
          <Card className="text-white bg-warning shadow-lg text-center p-4 h-100">
            <FaClipboardList size={40} className="mb-3" />
            <h5>Enrollments</h5>
            <h2>{specs.enrollments}</h2>
          </Card>
        </Col>

      </Row>


        {/* Upcoming */}
        <Row className="g-4 justify-content-center">
        <Col xs={12} sm={6} md={3}>
          <Card className="text-white bg-danger shadow-lg text-center p-4 h-100">
            <UpcomingCoursesList courses={specs.upcomingCourses} />
          </Card>
        </Col>

        </Row>
    </Container>
  )
}

export default HomePage