import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Features" element={<Features />} />
          <Route path="/Contact" element={<Contact />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/Register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
