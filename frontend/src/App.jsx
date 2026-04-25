import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* "/" renders the Homepage, but only if signed in */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home /> 
          </ProtectedRoute>
        }
      />

       {/* "/login" renders the Login page */}
      <Route path="/login" element={<Login />} />
    </Routes>

  );
}

export default App;