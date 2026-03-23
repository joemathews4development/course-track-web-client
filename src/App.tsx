import { Route, Routes } from "react-router-dom"
import Navigationbar from "./components/Navigationbar"
import HomePage from "./pages/HomePage"
import CoursesPage from "./pages/CoursesPage"
import StudentsPage from "./pages/StudentsPage"
import Footer from "./components/Footer"
import CourseDetails from "./pages/CourseDetailsPage"

function App() {

  return (
    <div className="d-flex flex-column vh-100">
        <Navigationbar className="flex-shrink-0" />
        <div className="flex-fill overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/courses" element={<CoursesPage/>}/>
            <Route path="/students" element={<StudentsPage/>}/>
            <Route path="/courses/:courseId" element={<CourseDetails/>} />
          </Routes>
        </div>
        <Footer className="flex-shrink-0" />
    </div>
  )
}

export default App
