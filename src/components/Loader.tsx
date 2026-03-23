import { Spinner, Row, Col } from "react-bootstrap";

function Loader() {
  return (
    <Row className="mt-5 text-center">
      <Col>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Fetching data...</p>
      </Col>
    </Row>
  );
}

export default Loader