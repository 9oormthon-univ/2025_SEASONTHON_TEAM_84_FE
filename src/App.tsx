import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainApp from "./MainApp";
import UploadPage from "./pages/UploadPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}
