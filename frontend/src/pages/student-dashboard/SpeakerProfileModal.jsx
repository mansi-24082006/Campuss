import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Twitter, Globe, Mic, Clock, Building2 } from "lucide-react";

const SpeakerProfileModal = ({ speaker, onClose }) => {
  if (!speaker) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 pb-4 md:pb-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
        >
          {/* Header Gradient */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              {speaker.photoUrl ? (
                <img
                  src={speaker.photoUrl}
                  alt={speaker.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/50 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                  {speaker.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{speaker.name}</h2>
                {speaker.organization && (
                  <p className="flex items-center gap-1.5 text-indigo-200 text-sm mt-1">
                    <Building2 size={13} />
                    {speaker.organization}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Bio */}
            {speaker.bio && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">About</p>
                <p className="text-slate-700 text-sm leading-relaxed">{speaker.bio}</p>
              </div>
            )}

            {/* Session */}
            {(speaker.sessionTitle || speaker.sessionTime) && (
              <div className="bg-indigo-50 rounded-2xl p-4 space-y-1.5">
                {speaker.sessionTitle && (
                  <div className="flex items-start gap-2">
                    <Mic size={15} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Session</p>
                      <p className="text-slate-800 font-semibold text-sm">{speaker.sessionTitle}</p>
                    </div>
                  </div>
                )}
                {speaker.sessionTime && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={14} className="text-indigo-500" />
                    <span className="text-sm">{speaker.sessionTime}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {(speaker.socialLinks?.linkedin || speaker.socialLinks?.twitter || speaker.socialLinks?.website) && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Connect</p>
                <div className="flex gap-3">
                  {speaker.socialLinks?.linkedin && (
                    <a
                      href={speaker.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin size={15} /> LinkedIn
                    </a>
                  )}
                  {speaker.socialLinks?.twitter && (
                    <a
                      href={speaker.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-xl text-sm font-semibold hover:bg-sky-100 transition-colors"
                    >
                      <Twitter size={15} /> Twitter
                    </a>
                  )}
                  {speaker.socialLinks?.website && (
                    <a
                      href={speaker.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                    >
                      <Globe size={15} /> Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpeakerProfileModal;
