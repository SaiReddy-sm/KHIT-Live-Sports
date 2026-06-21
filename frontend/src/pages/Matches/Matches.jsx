import React, { useState, useEffect, useMemo } from 'react';

// Static Filter Options
const DEPARTMENTS = ["All", "CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"];
const SPORTS = ["All", "Cricket", "Volleyball", "Basketball", "Kabaddi", "Badminton", "Table Tennis", "Chess"];

// Mock fallback matches aligning with your new dynamic schema
const MOCK_FALLBACKS = [
  {
    _id: "m1",
    sport: "Cricket",
    status: "Live",
    teamA: "CSE Warriors",
    teamB: "ECE Giants",
    scoreA: "142/4 (16.2 Ov)",
    scoreB: "138/10 (20 Ov)",
    venue: "Main Ground Pitch A",
    date: "Today",
    time: "02:30 PM",
    tournament: "Annual Sports Meet 2026",
    statusDetail: "CSE needs 12 runs in 18 balls.",
    teamA_roster: [
      { name: "A. Vinay", rollNo: "21H71A0501", isCaptain: true },
      { name: "S. Kumar", rollNo: "21H71A0504", isCaptain: false },
      { name: "P. Rajesh", rollNo: "21H71A0512", isCaptain: false },
      { name: "K. Akhil", rollNo: "22H75A0502", isCaptain: false }
    ],
    teamB_roster: [
      { name: "K. Rahul", rollNo: "21H71A0402", isCaptain: true },
      { name: "M. Dinesh", rollNo: "21H71A0409", isCaptain: false },
      { name: "J. Prasad", rollNo: "21H71A0415", isCaptain: false },
      { name: "T. Gopi", rollNo: "21H71A0430", isCaptain: false }
    ]
  },
  {
    _id: "m2",
    sport: "Volleyball",
    status: "Upcoming",
    teamA: "Mechanical Titans",
    teamB: "Civil Knights",
    scoreA: "0",
    scoreB: "0",
    venue: "Outdoor Court 1",
    date: "Tomorrow",
    time: "04:00 PM",
    tournament: "Annual Sports Meet 2026",
    statusDetail: "Warmup matches scheduled.",
    teamA_roster: [
      { name: "G. Suresh", rollNo: "21H71A0301", isCaptain: true },
      { name: "V. Ramu", rollNo: "21H71A0310", isCaptain: false }
    ],
    teamB_roster: [
      { name: "P. Rajesh", rollNo: "21H71A0105", isCaptain: true },
      { name: "L. Tarun", rollNo: "21H71A0114", isCaptain: false }
    ]
  },
  {
    _id: "m3",
    sport: "Kabaddi",
    status: "Completed",
    teamA: "CSE Warriors",
    teamB: "Mechanical Titans",
    scoreA: "38",
    scoreB: "42",
    venue: "Kabaddi Clay Arena",
    date: "Yesterday",
    time: "05:00 PM",
    tournament: "Inter-Department Tournament",
    statusDetail: "Mechanical Titans won by 4 points.",
    bestPerformers: [
      { name: "M. Akhil", department: "Mechanical", statHighlight: "12 Raid Points" },
      { name: "S. Kumar", department: "CSE", statHighlight: "8 Tackle Points" }
    ],
    teamA_roster: [
      { name: "A. Vinay", rollNo: "21H71A0501", isCaptain: true },
      { name: "S. Kumar", rollNo: "21H71A0504", isCaptain: false }
    ],
    teamB_roster: [
      { name: "G. Suresh", rollNo: "21H71A0301", isCaptain: true },
      { name: "M. Akhil", rollNo: "21H71A0308", isCaptain: false }
    ]
  }
];

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [activeTab, setActiveTab] = useState("Live"); // Live / Upcoming / Completed
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");

  // State to track which match's roster sheet is opened
  const [expandedRosterId, setExpandedRosterId] = useState(null);

  // Fetch matches from backend on mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/matches');
        const result = await response.json();

        if (result.success && result.data?.length > 0) {
          setMatches(result.data);
        } else {
          // Fallback to offline mock data if backend serves empty list
          setMatches(MOCK_FALLBACKS);
        }
      } catch (err) {
        console.warn("Using offline fallback match dataset:", err.message);
        setMatches(MOCK_FALLBACKS);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Multi-tier filtering logic
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesTab = match.status === activeTab;
      const matchesSport = selectedSport === "All" || match.sport === selectedSport;
      
      // Filter dynamically across both Team A and Team B departments
      const matchesDept = selectedDept === "All" || 
        match.teamA.toUpperCase().includes(selectedDept.toUpperCase()) || 
        match.teamB.toUpperCase().includes(selectedDept.toUpperCase());

      return matchesTab && matchesSport && matchesDept;
    });
  }, [matches, activeTab, selectedSport, selectedDept]);

  // Statistics summaries
  const matchStats = useMemo(() => {
    return matches.reduce(
      (acc, curr) => {
        if (curr.status === "Live") acc.liveCount++;
        if (curr.status === "Upcoming") acc.upcomingCount++;
        if (curr.status === "Completed") acc.completedCount++;
        return acc;
      },
      { liveCount: 0, upcomingCount: 0, completedCount: 0 }
    );
  }, [matches]);

  const handleResetFilters = () => {
    setSelectedSport("All");
    setSelectedDept("All");
    setExpandedRosterId(null);
  };

  const toggleRoster = (matchId) => {
    setExpandedRosterId(expandedRosterId === matchId ? null : matchId);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] text-white py-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-3">
            KHIT Matches
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Live Matches & <span className="text-[#F2B84B]">Scorecards</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Dynamic squad configurations, live scores, and tournament archives compiled in real-time.
          </p>
        </div>
      </section>

      {/* Tab Navigation Bars */}
      <section className="relative z-20 -mt-8 max-w-4xl mx-auto px-4">
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex gap-2">
          
          <button 
            onClick={() => { setActiveTab("Live"); setExpandedRosterId(null); }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "Live" 
                ? "bg-[#7A1E2D] text-white shadow-md" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live ({matchStats.liveCount})
          </button>

          <button 
            onClick={() => { setActiveTab("Upcoming"); setExpandedRosterId(null); }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "Upcoming" 
                ? "bg-[#7A1E2D] text-white shadow-md" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
            }`}
          >
            Upcoming ({matchStats.upcomingCount})
          </button>

          <button 
            onClick={() => { setActiveTab("Completed"); setExpandedRosterId(null); }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "Completed" 
                ? "bg-[#7A1E2D] text-white shadow-md" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
            }`}
          >
            Completed ({matchStats.completedCount})
          </button>

        </div>
      </section>

      {/* Filtering Filters */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            {/* Sport Selector */}
            <div className="flex-1 sm:flex-initial">
              <label htmlFor="sport-filter" className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">Sport</label>
              <select 
                id="sport-filter"
                value={selectedSport}
                onChange={(e) => { setSelectedSport(e.target.value); setExpandedRosterId(null); }}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7A1E2D] bg-white text-[#0F172A] font-semibold"
              >
                {SPORTS.map(sport => <option key={sport} value={sport}>{sport}</option>)}
              </select>
            </div>

            {/* Department Selector */}
            <div className="flex-1 sm:flex-initial">
              <label htmlFor="dept-filter" className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">Department Team</label>
              <select 
                id="dept-filter"
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setExpandedRosterId(null); }}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7A1E2D] bg-white text-[#0F172A] font-semibold"
              >
                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
          </div>

          {(selectedSport !== "All" || selectedDept !== "All") && (
            <button 
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#7A1E2D] hover:underline whitespace-nowrap self-end sm:self-center"
            >
              Clear Filters
            </button>
          )}

        </div>
      </section>

      {/* Content Render lists */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#7A1E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-[#64748B] font-semibold">Loading Matches...</p>
          </div>
        )}

        {/* Empty States */}
        {!loading && filteredMatches.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
            <span className="text-3xl block mb-2">🗓️</span>
            <h3 className="text-sm font-bold text-[#0F172A] mb-1">No Matches Listed</h3>
            <p className="text-xs text-[#64748B] mb-4">No {activeTab.toLowerCase()} matches fit your current selected filter.</p>
            <button onClick={handleResetFilters} className="px-4 py-2 bg-[#7A1E2D] text-white text-xs font-bold rounded-lg hover:bg-[#8B1F2F]">
              Reset Filters
            </button>
          </div>
        )}

        {/* Matches lists Grid */}
        {!loading && filteredMatches.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {filteredMatches.map((match) => {
              const isExpanded = expandedRosterId === match._id;
              
              // Helper to check if sport is solo (disable MVPs for Chess, Badminton, Table Tennis)
              const isSoloSport = ["Chess", "Badminton", "Table Tennis"].includes(match.sport);

              return (
                <div key={match._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                  
                  {/* Top Header Panel */}
                  <div className="bg-slate-50/50 border-b border-gray-100 p-4 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold text-[#7A1E2D] bg-red-50 px-2.5 py-1 rounded uppercase tracking-wider">
                        {match.sport}
                      </span>
                      <span className="text-[#64748B] ml-2 font-bold uppercase tracking-wider text-[10px]">
                        {match.tournament || "Friendly Match"}
                      </span>
                    </div>
                    <span className="font-semibold text-[#64748B]">📍 {match.venue}</span>
                  </div>

                  {/* Core Match Versus Panel */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                      
                      {/* Team A Details */}
                      <div className="flex-1 space-y-1">
                        <h4 className="font-black text-base md:text-lg text-[#0F172A]">{match.teamA}</h4>
                        {match.status !== "Upcoming" && (
                          <p className="font-bold text-lg md:text-xl text-[#7A1E2D]">{match.scoreA}</p>
                        )}
                      </div>

                      {/* VS Badge */}
                      <div className="bg-[#EAF2FA] border border-[#7A1E2D]/10 text-[#7A1E2D] text-xs font-extrabold px-3 py-1.5 rounded-full">
                        VS
                      </div>

                      {/* Team B Details */}
                      <div className="flex-grow flex-shrink-0 w-full sm:w-auto sm:flex-1 text-center sm:text-right space-y-1">
                        <h4 className="font-black text-base md:text-lg text-[#0F172A]">{match.teamB}</h4>
                        {match.status !== "Upcoming" && (
                          <p className="font-bold text-lg md:text-xl text-[#7A1E2D]">{match.scoreB}</p>
                        )}
                      </div>

                    </div>

                    {/* Status commentary text */}
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-xs text-[#64748B] font-semibold italic">
                        📢 {match.statusDetail || "No live commentary available."}
                      </p>
                      
                      {/* Drawer Trigger Button */}
                      <button 
                        onClick={() => toggleRoster(match._id)}
                        className="text-xs font-bold text-[#7A1E2D] hover:text-[#8B1F2F] flex items-center gap-1 shrink-0"
                      >
                        <span>{isExpanded ? "Hide Lineups" : "View Lineups"}</span>
                        <svg className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                  </div>

                  {/* Dynamic Accordion Drawer (Roster Lists & MVP Highlight Spotlights) */}
                  {isExpanded && (
                    <div className="bg-slate-50/50 border-t border-gray-100 p-6 space-y-6 animate-fade-in">
                      
                      {/* Roster lists side-by-side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Roster A */}
                        <div className="space-y-3">
                          <h5 className="font-extrabold text-xs text-[#7A1E2D] uppercase tracking-wider pb-1 border-b border-[#7A1E2D]/10">
                            {match.teamA} Lineup
                          </h5>
                          {match.teamA_roster?.length > 0 ? (
                            <div className="space-y-2">
                              {match.teamA_roster.map((player, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#0F172A]">{player.name}</span>
                                    {player.isCaptain && (
                                      <span className="text-[9px] font-extrabold uppercase bg-[#F2B84B] text-[#7A1E2D] px-2 py-0.5 rounded shadow-sm">
                                        Captain
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[#64748B] font-semibold">{player.rollNo}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-[#64748B] italic">Roster details pending release.</p>
                          )}
                        </div>

                        {/* Roster B */}
                        <div className="space-y-3">
                          <h5 className="font-extrabold text-xs text-[#7A1E2D] uppercase tracking-wider pb-1 border-b border-[#7A1E2D]/10">
                            {match.teamB} Lineup
                          </h5>
                          {match.teamB_roster?.length > 0 ? (
                            <div className="space-y-2">
                              {match.teamB_roster.map((player, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#0F172A]">{player.name}</span>
                                    {player.isCaptain && (
                                      <span className="text-[9px] font-extrabold uppercase bg-[#F2B84B] text-[#7A1E2D] px-2 py-0.5 rounded shadow-sm">
                                        Captain
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[#64748B] font-semibold">{player.rollNo}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-[#64748B] italic">Roster details pending release.</p>
                          )}
                        </div>

                      </div>

                      {/* Best Performers MVP spotlight container (Only if Completed & not a Solo game) */}
                      {match.status === "Completed" && !isSoloSport && match.bestPerformers?.length > 0 && (
                        <div className="bg-white border-2 border-[#F2B84B] p-4 rounded-xl shadow-sm space-y-3">
                          <h5 className="text-xs font-extrabold text-[#7A1E2D] uppercase tracking-wider flex items-center gap-1.5">
                            <span>🏆</span> Matchday MVP Spotlight
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {match.bestPerformers.map((mvp, idx) => (
                              <div key={idx} className="p-3 bg-red-50/50 rounded-lg border border-[#7A1E2D]/5">
                                <h6 className="font-bold text-xs text-[#0F172A]">{mvp.name}</h6>
                                <p className="text-[10px] text-[#64748B] font-bold mt-0.5">Dept: {mvp.department}</p>
                                <span className="inline-block mt-2 text-[10px] font-extrabold text-[#7A1E2D] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#7A1E2D]/10">
                                  {mvp.statHighlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Bottom action bar */}
                  <div className="bg-slate-50 border-t border-gray-100 px-6 py-3 flex justify-between items-center text-xs">
                    <span className="text-[#64748B] font-semibold">
                      📅 {match.date} • {match.time}
                    </span>
                    
                    {match.status === "Live" && (
                      <span className="bg-[#7A1E2D] text-white px-3 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                        Live Score
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
}