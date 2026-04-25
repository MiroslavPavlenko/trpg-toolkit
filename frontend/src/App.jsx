import { Routes, Route } from "react-router-dom";
import VTT from "./pages/VTT";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* "/" renders the VTT page, but only if signed in */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <VTT />
          </ProtectedRoute>
        }
      />

       {/* "/login" renders the Login page */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;