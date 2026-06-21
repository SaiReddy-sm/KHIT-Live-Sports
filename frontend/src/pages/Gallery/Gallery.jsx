import React, { useState, useEffect, useMemo } from 'react';

// Restructured to contain only Photos, Achievements, and Events
const SUB_TABS = ["Photos", "Achievements", "Events"];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("Photos");
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/gallery');
        const result = await response.json();

        if (result.success) {
          setMediaItems(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch items');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      return item.category === activeTab;
    });
  }, [mediaItems, activeTab]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      
      {/* Hero Header Banner */}
      <section className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] relative text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-3">
            Media Hub
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Campus <span className="text-[#F2B84B]">Gallery</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Discover achievements, trophy wins, tournament moments, and active photo updates.
          </p>
        </div>
      </section>

      {/* Media Filter Sub-Tabs */}
      <section className="relative z-20 -mt-6 max-w-4xl mx-auto px-4">
        <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 flex flex-wrap gap-1.5 justify-center">
          {SUB_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#7A1E2D] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Active State Container */}
      <main className="max-w-6xl mx-auto px-4 mt-12">
        
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#7A1E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-[#64748B] font-bold">Loading media items...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 max-w-md mx-auto text-center animate-fade-in">
            <span className="text-xl block mb-2">⚠️</span>
            <h4 className="font-bold text-sm mb-1">Local Database Connection Idle</h4>
            <p className="text-[11px] leading-relaxed">
              Serving mock display data until backend is active. (Error: {error})
            </p>
          </div>
        )}

        {/* Content Render Grid */}
        {!loading && (
          <div className="space-y-8 animate-fade-in">
            
            {/* PHOTOS */}
            {activeTab === "Photos" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#7A1E2D]">Tournament Action Captures</h2>
                  <p className="text-xs text-[#64748B]">Real moments, triumphs, and emotional highlights of matches on the pitch.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedia.length === 0 ? (
                    [
                      { id: 1, title: "Cricket Final Over celebration", date: "Nov 2024", caption: "CSE team celebrating wickets." },
                      { id: 2, title: "Volleyball Spikers", date: "Oct 2024", caption: "Spike block during interdepartmental round." },
                      { id: 3, title: "Relay Race Finish Line", date: "Sep 2024", caption: "Athletes crossing the finish mark." }
                    ].map((photo) => (
                      <div key={photo.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="h-48 bg-slate-100 flex items-center justify-center relative">
                          <svg className="w-10 h-10 text-[#7A1E2D]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01" />
                          </svg>
                          <span className="absolute bottom-2 right-2 text-[10px] bg-slate-900/60 text-white px-2 py-0.5 rounded font-bold">Photo</span>
                        </div>
                        <div className="p-4">
                          <span className="text-[10px] text-[#7A1E2D] font-bold uppercase">{photo.date}</span>
                          <h3 className="font-extrabold text-sm text-[#0F172A] mt-1 group-hover:text-[#7A1E2D] transition-colors">{photo.title}</h3>
                          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{photo.caption}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredMedia.map((item) => (
                      <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="h-48 bg-[#EAF2FA] flex items-center justify-center relative">
                          <span className="absolute bottom-2 right-2 text-[10px] bg-[#7A1E2D] text-white px-2 py-0.5 rounded font-bold">Image File</span>
                          <p className="text-xs font-bold text-[#7A1E2D]/50">{item.placeholderText || "Photo Item"}</p>
                        </div>
                        <div className="p-4">
                          <span className="text-[10px] text-[#7A1E2D] font-bold uppercase">{item.event || "Sports Event"}</span>
                          <h3 className="font-extrabold text-sm text-[#0F172A] mt-1 group-hover:text-[#7A1E2D] transition-colors">{item.title}</h3>
                          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{item.caption}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ACHIEVEMENTS */}
            {activeTab === "Achievements" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#7A1E2D]">Shields, Trophies & Triumphs</h2>
                  <p className="text-xs text-[#64748B]">Official recognition won by college representatives in district and university tournaments.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 1, title: "JNTUK Zone D Championship Trophy", winner: "Volleyball Team (Gold Winners)", desc: "Outstanding display across all sets during JNTU inter-collegiate meet." },
                    { id: 2, title: "District Athletics Gold", winner: "M. Rajesh (CSE Department)", desc: "Finished first place in district level 400m sprint finals." }
                  ].map((ach) => (
                    <div key={ach.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-start">
                      <div className="p-3 bg-[#EAF2FA] text-[#7A1E2D] rounded-xl flex-shrink-0">
                        🏆
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-600 font-extrabold uppercase bg-amber-50 px-2 py-0.5 rounded">Tournament Honor</span>
                        <h3 className="font-extrabold text-base text-[#0F172A] mt-1.5">{ach.title}</h3>
                        <p className="text-xs text-[#7A1E2D] font-bold mt-0.5">{ach.winner}</p>
                        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS */}
            {activeTab === "Events" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#7A1E2D]">Calendar & Tournaments</h2>
                  <p className="text-xs text-[#64748B]">Important timelines of athletic events across the year.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Annual Departmental Sports Clash", date: "Dec 15 - Dec 22, 2024", location: "Main Campus Grounds", type: "Inter-Department" },
                    { title: "JNTU Intercollegiate Basketball Selection Trials", date: "Jan 10, 2025", location: "Central Sports Complex", type: "University Trials" }
                  ].map((evt, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#EAF2FA] text-[#7A1E2D] uppercase">
                          {evt.type}
                        </span>
                        <h3 className="font-extrabold text-base text-[#0F172A] mt-2">{evt.title}</h3>
                        <p className="text-xs text-[#64748B] mt-1">📍 {evt.location}</p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <span className="text-xs font-bold text-[#7A1E2D] block">Timeline Date</span>
                        <span className="text-sm font-semibold text-[#0F172A] mt-0.5 block">{evt.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}