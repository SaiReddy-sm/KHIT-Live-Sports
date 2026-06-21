import React, { useState, useEffect, useMemo } from 'react';

// Static FAQs (Kept on frontend for immediate reading layout)
const FAQS = [
  {
    q: "Who is eligible to participate in KHIT sports events?",
    a: "All active student branches (B.Tech, MCA, MBA, and Diploma programs) who have valid physical department registration and clear athletic clearance."
  },
  {
    q: "How can we form departmental teams?",
    a: "Branches formulate selection lists under their designated staff coordinators and HODs. Nominated squad sheets must be submitted to the physical education department before registration deadlines."
  },
  {
    q: "Are there entry fees or charges to register?",
    a: "No. All college intramural and campus sports meets are fully sponsored and funded by the KHIT Management."
  }
];

export default function Events() {
  // Dynamic Events States
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState("Upcoming"); // Upcoming / Past

  // Fetch events from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/events');
        const result = await response.json();

        if (result.success) {
          setEvents(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch events');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on active tab status
  const filteredEvents = useMemo(() => {
    return events.filter(evt => evt.status === activeTab);
  }, [events, activeTab]);

  // Find the main flagship event (if one is set in the database)
  const flagshipEvent = useMemo(() => {
    return events.find(evt => evt.isFlagship);
  }, [events]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      
      {/* Section 1 — Hero */}
      <section className="khit-hero-gradient relative text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="khit-container relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-3">
            Collegiate Calendar
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Sports Events & <span className="text-[#F2B84B]">Meets</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            View up-to-date schedule indices for departmental leagues, university trials, fitness seminars, and upcoming flagship matches.
          </p>
        </div>
      </section>

      {/* Section 2 — Navigation Status Tabs */}
      <section className="relative z-20 -mt-8 max-w-lg mx-auto px-4">
        <div className="bg-white p-1.5 rounded-2xl shadow-xl border border-gray-100 flex gap-2">
          
          <button 
            onClick={() => setActiveTab("Upcoming")}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-sm transition-all ${
              activeTab === "Upcoming" 
                ? "bg-[#7A1E2D] text-white shadow-md" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
            }`}
          >
            Upcoming Events
          </button>

          <button 
            onClick={() => setActiveTab("Past")}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-sm transition-all ${
              activeTab === "Past" 
                ? "bg-[#7A1E2D] text-white shadow-md" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
            }`}
          >
            Past Events
          </button>

        </div>
      </section>

      {/* Loading & Error Blocks */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-[#7A1E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#64748B] font-semibold">Loading Live Events Calendar...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 max-w-md mx-auto text-center animate-fade-in">
            <span className="text-3xl block mb-2">⚠️</span>
            <h4 className="font-bold text-lg mb-1">Connection Error</h4>
            <p className="text-xs">{error}. Please make sure your backend server is running.</p>
          </div>
        )}
      </section>

      {/* Section 3 — Flagship Event Highlight Segment */}
      {!loading && !error && activeTab === "Upcoming" && flagshipEvent && (
        <section className="khit-section max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-[#EAF2FA] rounded-3xl p-8 md:p-12 border border-blue-100 flex flex-col lg:flex-row items-center gap-10">
            
            <div className="flex-1">
              <span className="bg-[#7A1E2D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-4 inline-block">
                Flagship Event Highlight
              </span>
              <h2 className="text-3xl font-extrabold text-[#7A1E2D] tracking-tight mb-4">
                {flagshipEvent.title}
              </h2>
              <p className="text-sm md:text-base text-[#64748B] leading-relaxed mb-6">
                {flagshipEvent.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">Date</span>
                  <span className="font-bold text-[#0F172A]">{flagshipEvent.date}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">Venue</span>
                  <span className="font-bold text-[#0F172A]">{flagshipEvent.venue}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <button className="btn-maroon px-6 py-3 font-bold rounded-lg text-sm transition-transform hover:scale-105">
                  Register Branch Team
                </button>
                <span className="text-xs text-[#64748B] italic">
                  Deadline: {flagshipEvent.registrationDeadline}
                </span>
              </div>
            </div>

            {/* Graphic Badge */}
            <div className="bg-white p-8 rounded-2xl border border-blue-50 shadow-sm flex flex-col items-center justify-center text-center w-full lg:w-72 flex-shrink-0">
              <span className="text-5xl mb-4">🏆</span>
              <h4 className="font-extrabold text-lg text-[#0F172A]">Annual Trophy</h4>
              <p className="text-xs text-[#64748B] mt-1 mb-4 leading-relaxed">
                Aggregated scoreboard calculations determining our annual department championship shield.
              </p>
              <span className="text-xs font-bold text-[#7A1E2D] bg-[#EAF2FA] px-3 py-1 rounded-full">
                12 Sporting Events
              </span>
            </div>

          </div>
        </section>
      )}

      {/* Section 4 — Primary Events List Grid */}
      <section className="khit-section max-w-6xl mx-auto px-4 mt-8">
        
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A]">
            {activeTab} Matches & Meets List
          </h2>
          <p className="text-sm text-[#64748B] mt-1 max-w-md mx-auto">
            Browse complete scheduling notes, dates, times, and entry clearances for {activeTab.toLowerCase()} sessions.
          </p>
        </div>

        {!loading && !error && filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto animate-fade-in">
            <span className="text-4xl block mb-2">📅</span>
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">No Events Found</h3>
            <p className="text-sm text-[#64748B]">There are currently no events logged inside this section.</p>
          </div>
        ) : (
          !loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {filteredEvents.map((evt) => (
                <div key={evt._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md">
                        {evt.category}
                      </span>
                      <span className="text-xs text-[#64748B] font-semibold flex items-center gap-1.5">
                        <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {evt.date}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-[#0F172A] mb-2">{evt.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-4">{evt.description}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                    <div className="flex justify-between items-center text-xs text-[#64748B] flex-wrap gap-2">
                      <span>Venue: <b className="text-[#0F172A]">{evt.venue}</b></span>
                      <span>Time: <b className="text-[#0F172A]">{evt.time}</b></span>
                    </div>

                    {evt.status === "Upcoming" && (
                      <div className="flex items-center justify-between gap-4 pt-2">
                        <span className="text-[11px] text-red-500 font-semibold">
                          Register by: {evt.registrationDeadline}
                        </span>
                        <button className="bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                          Register Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </section>

      {/* Section 5 — Registration Guidelines FAQ */}
      <section className="bg-white py-16 border-y border-gray-100 mt-12">
        <div className="khit-container max-w-5xl mx-auto px-4">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Registration Process</span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Guidelines & FAQs</h2>
            <p className="text-[#64748B] text-sm mt-1">
              General instructions regarding tournament registration, team formation, and sports safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-base text-[#7A1E2D] mb-2">{faq.q}</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 6 — Support & Suggestion CTA */}
      <section className="text-center max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Propose Event</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-3">
            Want to organize a sports event?
          </h2>
          <p className="text-[#64748B] text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Students clubs, associations, or departments looking to arrange individual tournaments, physical awareness runs, or friendly sports games should submit a formal proposal index to the sports board.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-maroon px-6 py-3 font-bold rounded-lg text-sm w-full sm:w-auto">
              Submit Event Proposal Form
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-[#0F172A] px-6 py-3 font-bold rounded-lg text-sm w-full sm:w-auto transition-colors">
              Read Safety Directives
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}