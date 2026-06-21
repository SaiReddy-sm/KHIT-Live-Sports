import React, { useState, useEffect, useMemo } from 'react';

export default function Notices() {
  const [activeSubTab, setActiveSubTab] = useState("Circulars");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notice board circulars & alerts from MongoDB on mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/notices");
        const result = await response.json();
        if (result.success) {
          setNotices(result.data);
        }
      } catch (err) {
        console.warn("Using offline fallback notice board parameters:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Filter listings based on the active chosen sub-tab
  const circulars = useMemo(() => notices.filter(n => n.category === "Circulars"), [notices]);
  const announcements = useMemo(() => notices.filter(n => n.category === "Announcements"), [notices]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A]">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] relative text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-3">
            Official Notices & Bulletin Board
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Circulars & <span className="text-[#F2B84B]">Announcements</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Stay up to date with official schedules, selection notices, training slots, and contact departments.
          </p>
        </div>
      </section>

      {/* Tab Switcher for Notices vs Announcements */}
      <section className="relative z-20 -mt-6 max-w-md mx-auto px-4">
        <div className="bg-white p-1.5 rounded-xl shadow-md border border-gray-100 flex gap-1 justify-center">
          {["Circulars", "Announcements"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === tab
                  ? "bg-[#7A1E2D] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Main Notice/Announcement Area */}
      <main className="max-w-4xl mx-auto px-4 mt-12 mb-16 min-h-[300px]">
        
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#7A1E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-[#64748B] font-bold">Syncing bulletin boards...</p>
          </div>
        )}

        {/* CIRCULARS SUB-TAB */}
        {!loading && activeSubTab === "Circulars" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-[#7A1E2D]">Office Circulars & Forms</h2>
              <p className="text-xs text-[#64748B]">Official paperwork, eligibility criteria, and general PDF files from the Sports Committee.</p>
            </div>

            {circulars.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6">No circular documents published.</p>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-slate-100">
                {circulars.map((notice) => (
                  <div key={notice._id} className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                    <div className="max-w-[70%]">
                      <h3 className="font-bold text-xs md:text-sm text-[#0F172A] leading-tight">{notice.title}</h3>
                      <span className="text-[10px] text-[#64748B] font-semibold mt-1 block">Uploaded: {notice.date}</span>
                    </div>
                    <button className="px-3.5 py-1.5 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white rounded text-xs font-bold transition-all shrink-0">
                      Open PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANNOUNCEMENTS SUB-TAB */}
        {!loading && activeSubTab === "Announcements" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-[#7A1E2D]">Real-time Updates</h2>
              <p className="text-xs text-[#64748B]">Instant news updates concerning training schedules or match postponements.</p>
            </div>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6">No announcements currently published.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((ann) => (
                  <div key={ann._id} className={`bg-white p-5 rounded-xl shadow-sm border ${
                    ann.important ? "border-l-4 border-l-[#7A1E2D]" : "border-slate-100"
                  }`}>
                    <span className="text-[9px] font-extrabold uppercase bg-red-50 text-[#7A1E2D] px-2 py-0.5 rounded">
                      {ann.important ? "Urgent Alert" : "News Update"}
                    </span>
                    <h3 className="font-extrabold text-sm text-[#0F172A] mt-2">{ann.title}</h3>
                    <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Bottom Contact Section */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Get in Touch</span>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">Sports Department Contact</h2>
            <p className="text-xs text-[#64748B] mt-1">Have queries regarding selections, sports categories, or schedules? Reach out directly to our directors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Staff Members in Maroon, Gold and White */}
            <div className="space-y-4">
              
              {/* Staff Member Card 1 */}
              <div className="bg-white border-2 border-[#7A1E2D] p-5 rounded-xl shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#F2B84B]/10 rounded-bl-full" />
                <span className="text-[9px] font-extrabold uppercase bg-[#F2B84B] text-[#7A1E2D] px-2.5 py-1 rounded">
                  Physical Director
                </span>
                <h3 className="font-extrabold text-base text-[#7A1E2D] mt-3">Dr. G. Sasidhar</h3>
                <div className="mt-3 space-y-1.5 text-xs text-[#64748B] font-semibold">
                  <p className="flex items-center gap-2">
                    <span className="text-[#D9A441] text-xs">📞</span> +91 98765 43210
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#D9A441] text-xs">✉️</span> pd@khit.edu.in
                  </p>
                </div>
              </div>

              {/* Staff Member Card 2 */}
              <div className="bg-white border-2 border-[#7A1E2D] p-5 rounded-xl shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#F2B84B]/10 rounded-bl-full" />
                <span className="text-[9px] font-extrabold uppercase bg-[#F2B84B] text-[#7A1E2D] px-2.5 py-1 rounded">
                  Asst. Physical Director
                </span>
                <h3 className="font-extrabold text-base text-[#7A1E2D] mt-3">Sri. M. Srinivasa Rao</h3>
                <div className="mt-3 space-y-1.5 text-xs text-[#64748B] font-semibold">
                  <p className="flex items-center gap-2">
                    <span className="text-[#D9A441] text-xs">📞</span> +91 87654 32109
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#D9A441] text-xs">✉️</span> apd@khit.edu.in
                  </p>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g., CSE" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Registration No</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 21H71A05..." 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Message Query</label>
                <textarea 
                  rows="3" 
                  placeholder="Ask a question about matches or trials..." 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#7A1E2D] resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>

          </div>
        </div>
      </section>

    </div>
  );
}