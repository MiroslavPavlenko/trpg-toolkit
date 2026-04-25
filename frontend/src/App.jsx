import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Test from "./pages/Test";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;