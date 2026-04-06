import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Trophy, Medal, Target, Star, Search, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

const Scoreboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: "national", value: "" });

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/events/global/leaderboard", {
                params: { type: filter.type, value: filter.value }
            });
            setLeaderboard(data);
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [filter.type]);

    return (
        <>
            <Helmet>
                <title>Scoreboard | CampusBuzz</title>
            </Helmet>

            <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-4 md:p-10">
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Header */}
                    <header className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm font-bold uppercase tracking-wider"
                        >
                            <Trophy size={16} /> Hall of Fame
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                            Community <span className="text-indigo-600">Leaderboard</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            Compete with students across the nation. Earn points through event participation and winning competitions.
                        </p>
                    </header>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full md:w-auto">
                            {["national", "state", "college"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter({ ...filter, type })}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter.type === type
                                            ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder={`Search ${filter.type}...`}
                                className="pl-12 rounded-2xl border-slate-200 dark:border-slate-800"
                                value={filter.value}
                                onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Leaderboard Table */}
                    <Card className="rounded-[2.5rem] overflow-hidden border-slate-200 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Rank</th>
                                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Student</th>
                                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">College</th>
                                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Badges</th>
                                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400">Recalculating Ranks...</td></tr>
                                        ) : leaderboard.length === 0 ? (
                                            <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400">No data found for this filter</td></tr>
                                        ) : (
                                            leaderboard.map((student, index) => (
                                                <motion.tr
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    key={student._id}
                                                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3 font-black text-lg">
                                                            {index === 0 && <Medal className="text-amber-500" />}
                                                            {index === 1 && <Medal className="text-slate-400" />}
                                                            {index === 2 && <Medal className="text-amber-700" />}
                                                            <span className={index < 3 ? "text-slate-900 dark:text-white" : "text-slate-400"}>
                                                                #{index + 1}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                                                {student.fullName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{student.fullName}</p>
                                                                <p className="text-xs text-slate-500">Student</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-medium">
                                                        {student.collegeName}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
                                                            {(student.badges || []).slice(0, 3).map((badge, i) => (
                                                                <div key={i} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] whitespace-nowrap font-bold">
                                                                    {badge.split(":")[0]}
                                                                </div>
                                                            ))}
                                                            {student.badges?.length > 3 && <span className="text-[10px] text-slate-400">+{student.badges.length - 3}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full font-black text-sm">
                                                            <Star size={14} fill="currentColor" />
                                                            {student.points} XP
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Scoreboard;
