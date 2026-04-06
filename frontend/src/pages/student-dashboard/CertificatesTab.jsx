import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Calendar, ShieldCheck, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateCertificate } from "@/lib/certificateUtils";

const CertificatesTab = ({ registeredEvents }) => {
  const { user } = useAuth();

  const verifiedEvents = registeredEvents.filter((event) =>
    event.verifiedStudents?.some((id) => (id._id || id) === user?._id)
  );

  const handleDownload = (event) => {
    generateCertificate({
      studentName: user?.fullName,
      eventTitle: event.title,
      date: event.date,
      organizer: event.organizer?.fullName || "CampusBuzz Faculty",
      certificateId: `CB-CERT-${event._id.toString().toUpperCase().slice(-6)}-${user?._id.toString().toUpperCase().slice(-4)}`,
    });
  };

  if (verifiedEvents.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Certificates Issued Yet</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
          Attend events and get verified by faculty to receive your official digital certificates here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your Achievement Gallery</h2>
          <p className="text-sm text-slate-500 font-medium">You have earned {verifiedEvents.length} official certificates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {verifiedEvents.map((event) => (
          <Card key={event._id} className="group bg-white border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                  <Award size={28} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={12} /> Verified
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "long" })}
                  </span>
                  <span className="flex items-center gap-1.5 capitalize">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {event.type || event.category}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <Button
                  onClick={() => handleDownload(event)}
                  className="flex-1 rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-lg shadow-slate-200"
                >
                  <Download size={18} /> Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`/verify/CB-CERT-${event._id.toString().toUpperCase().slice(-6)}-${user?._id.toString().toUpperCase().slice(-4)}`, "_blank")}
                  className="h-12 w-12 rounded-2xl border-slate-200 text-slate-500 hover:bg-slate-50 p-0"
                  title="Verify Link"
                >
                  <ExternalLink size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificatesTab;
