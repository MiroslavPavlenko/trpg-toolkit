import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

function ProtectedRoute ({ children }) {
    const { session, loading } = useSession();

    if (loading){
        return null;
    }

    if (!session) {
        return <Navigate to="/ogin" replace />;
    }

    return children;
}

export default ProtectedRoute;