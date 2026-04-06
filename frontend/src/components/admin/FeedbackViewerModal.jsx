import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MessageSquare, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeedbackViewerModal = ({ isOpen, onClose, eventTitle, feedback = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="text-indigo-600" size={20} />
              Student Feedback
            </h2>
            <p className="text-sm text-slate-500 font-medium truncate max-w-[400px]">
              For: {eventTitle}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {feedback.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-medium">No feedback submitted yet for this event.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {feedback.map((f, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                        {f.studentName?.[0] || <User size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{f.studentName || "Student"}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < f.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-1 rounded-lg border border-slate-100">
                      ID: #{f.studentId?._id?.slice(-4) || "..."}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{f.comment}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-50 bg-slate-50/30 flex justify-end">
          <Button onClick={onClose} className="rounded-2xl px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11">
            Close Viewer
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackViewerModal;
