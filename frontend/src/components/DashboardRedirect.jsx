import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
             
             <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center gap-8"
             >
                <div className="relative">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-[2rem] border-4 border-slate-100 border-t-indigo-600 shadow-xl shadow-indigo-600/10"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img src="/favicon.png" alt="Logo" className="w-8 h-8 animate-pulse" />
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Syncing Session</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Authenticating Portal Access...</p>
                </div>
             </motion.div>

             <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div 
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-indigo-600"
                        />
                    ))}
                </div>
             </div>
        </div>
    );
};

export default DashboardRedirect;
