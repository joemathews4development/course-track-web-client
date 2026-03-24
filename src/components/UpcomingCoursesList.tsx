import { Row, Col, Card } from "react-bootstrap"
import type { Course } from "../Utils/Types"
import { displayableDateTime } from "../Utils/Constants"

function UpcomingCoursesList({ courses }: { courses: Course[] }) {

    if (!courses || courses.length === 0) {
      return (
          <div className="text-center mt-5">
              <h5>No upcoming courses</h5>
              <p className="text-muted">Please check back later</p>
          </div>
      )
    }
    return (
        <Row className="mt-4">
            <h4 className="mb-3 text-center">Upcoming Courses</h4>
            {courses.map((course) => (
                <Card key={course.id} className="shadow-sm mb-3">
                    <Row className="g-0 align-items-start">
                        <Col md={8} className="text-start">
                            <Card.Body className="text-start">
                                <Card.Title className="text-start">{course.title}</Card.Title>
                                <Card.Text className="text-start">
                                    {course.description}
                                </Card.Text>
                                <small className="text-muted text-start">
                                    Starts: {displayableDateTime(course.start)}
                                </small>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            ))}
        </Row>
    )
}

export default UpcomingCoursesList;
