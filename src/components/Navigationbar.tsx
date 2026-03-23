import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

type FooterProps = React.HTMLAttributes<HTMLDivElement>;

function Navigationbar({ className }: FooterProps) {
    return (
        <div className={className}>
            <Navbar expand="lg" className="bg-body-tertiary position-relative">
                <Container fluid>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                            <Nav.Link as={Link} to="/students">Students</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default Navigationbar;
