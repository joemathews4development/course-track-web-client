import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";

// Types
type Student = {
  graduationStatus: "PASSED" | "FAILED";
  graduationDate?: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
};

type Course = {
  id: string;
  title: string;
  start: string;
  students: Student[];
};

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PASSED" | "FAILED">("ALL");
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseResponse, studentsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/courses/${courseId}`),
        axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/students/courses/${courseId}`,
        ),
      ]);
      setCourse(courseResponse.data);
      setAllStudents(studentsResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddStudent = async () => {
    try {
      const body = {
        studentId: selectedStudent,
        courseId: courseId,
        enrolledAt: new Date(),
      };
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/enrollments`,
        body,
      );
      loadData();
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemoveStudent = async (studentId: string) => {
  try {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/enrollments/${courseId}/${studentId}`);
      loadData();
  } catch (error) {
    console.error(error);
  }
}

  // ✅ Loading
  if (!course) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  // ✅ Filter + Search logic
  const filteredStudents = course.students.filter((s) => {
    const matchesSearch = s.student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "ALL" || s.graduationStatus === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <Container className="mt-4">
      {/* 📘 Course Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h3>{course.title}</h3>
          <p className="text-muted">
            Start Date: {new Date(course.start).toLocaleDateString()}
          </p>
          <p>
            <strong>Total Students:</strong> {course.students.length}
          </p>
        </Card.Body>
      </Card>

      <Row className="mb-4 g-2">
        <Col md={8}>
          <Form.Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select student to add</option>
            {allStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Button
            variant="primary"
            className="w-100"
            disabled={!selectedStudent}
            onClick={handleAddStudent}
          >
            ➕ Add Student
          </Button>
        </Col>
      </Row>

      {/* 🔍 Search + Filter */}
      <Row className="mb-3 g-2">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="🔍 Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            <Col xs={12} md={6} lg={4} key={s.student.id}>
              <Card className="shadow-sm h-100 student-card">
                <Card.Body>
                  <h5>{s.student.name}</h5>
                  <p className="text-muted mb-1">{s.student.email}</p>

                  {/* Status */}
                  <Badge
                    bg={s.graduationStatus === "PASSED" ? "success" : "danger"}
                    className="mb-2"
                  >
                    {s.graduationStatus}
                  </Badge>

                  {/* Graduation date */}
                  {s.graduationDate && (
                    <div className="small text-muted">
                      Graduated:{" "}
                      {new Date(s.graduationDate).toLocaleDateString()}
                    </div>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleRemoveStudent(s.student.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default CourseDetails;
