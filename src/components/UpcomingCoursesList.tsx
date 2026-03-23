import { Row, Col, Card } from "react-bootstrap";
import type { Course } from "../Utils/Types";

function UpcomingCoursesList({ courses }: { courses: Course[] }) {
  const DEFAULT_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center mt-5">
        <h5>No upcoming courses</h5>
        <p className="text-muted">Please check back later</p>
      </div>
    );
  }
  return (
    <Row className="mt-4">
      <h4 className="mb-3 text-center">Upcoming Courses</h4>

      {courses.slice(0, 3).map((course) => (
        <Col xs={12} md={4} key={course.id} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Img
              variant="top"
              src={course.image || DEFAULT_IMAGE} // ✅ fallback here
              style={{ height: "180px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{course.title}</Card.Title>
              <Card.Text>{course.description}</Card.Text>
              <small className="text-muted">
                Starts: {course.start.toDateString()}
              </small>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default UpcomingCoursesList;