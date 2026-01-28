import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from "./pages/Room";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
