import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Search, CheckCircle2, Award, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

const CertificateVerifier = () => {
    const [certId, setCertId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!certId) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            // In a real app, this would be a dedicated verification endpoint
            // For now, we'll simulate or use the event/user data
            const { data } = await api.get(`/events/verify/${certId}`);
            setResult(data);
        } catch (err) {
            setError("Certificate not found or invalid. Please check the ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Verify Certificate | CampusBuzz</title>
            </Helmet>

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-xl w-full space-y-8">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none text-white mb-4">
                            <ShieldCheck size={40} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Verify Authenticity</h1>
                        <p className="text-slate-500 dark:text-slate-400">Enter the unique Certificate ID to verify its validity and details.</p>
                    </div>

                    <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardContent className="p-10">
                            <form onSubmit={handleVerify} className="space-y-6">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <Input
                                        placeholder="e.g. CERT-2025-XXXX-XXXX"
                                        className="h-16 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 text-lg font-mono"
                                        value={certId}
                                        onChange={(e) => setCertId(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <Button
                                    disabled={loading || !certId}
                                    className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
                                >
                                    {loading ? "Verifying..." : "Verify Certificate"}
                                </Button>
                            </form>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-4 text-rose-600 dark:text-rose-400"
                                    >
                                        <ShieldAlert size={24} />
                                        <p className="font-bold">{error}</p>
                                    </motion.div>
                                )}

                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-8 space-y-6 animate-in fade-in"
                                    >
                                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-3xl">
                                            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black mb-4 uppercase tracking-widest text-sm">
                                                <CheckCircle2 size={20} /> Verified Authentic
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                                                    <User className="text-slate-400 mt-1" size={18} />
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Issued To</p>
                                                        <p className="font-bold text-slate-800 dark:text-white">{result.studentName}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                                                    <Award className="text-slate-400 mt-1" size={18} />
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Event / Achievement</p>
                                                        <p className="font-bold text-slate-800 dark:text-white">{result.eventTitle}</p>
                                                        <p className="text-xs text-indigo-600 font-bold">{result.category}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                                                    <Calendar className="text-slate-400 mt-1" size={18} />
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Date of Issue</p>
                                                        <p className="font-bold text-slate-800 dark:text-white">{new Date(result.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    <p className="text-center text-slate-400 text-sm">
                        Secured by CampusBuzz Blockchain-Verification Tool (Simplified V1)
                    </p>
                </div>
            </div>
        </>
    );
};

export default CertificateVerifier;
