import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user) {
                const role = user.role?.toLowerCase() || "student";
                navigate(`/${role}`, { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
};

export default DashboardRedirect;
