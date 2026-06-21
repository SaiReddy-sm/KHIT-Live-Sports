import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Static Filter Options
const DEPARTMENTS = [
  "All", "CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"
];

const SPORTS = [
  "All", "Cricket", "Volleyball", "Basketball", "Kabaddi", "Athletics", "Badminton", "Throwball", "Chess", "Carroms", "Table Tennis"
];

// Department League Stats (Kept static on frontend for dashboard visuals)
const DEPARTMENT_STANDINGS = [
  { rank: 1, department: "CSE", played: 15, wins: 12, losses: 3, points: 120, winPct: "80%" },
  { rank: 2, department: "ECE", played: 14, wins: 9, losses: 5, points: 95, winPct: "64%" },
  { rank: 3, department: "AIML", played: 12, wins: 8, losses: 4, points: 80, winPct: "66%" },
  { rank: 4, department: "IT", played: 11, wins: 7, losses: 4, points: 70, winPct: "63%" },
  { rank: 5, department: "EEE", played: 13, wins: 6, losses: 7, points: 60, winPct: "46%" }
];

export default function Teams() {
  // Sync state with URL parameters using React Router
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDept = searchParams.get('dept') || 'All';
  const selectedSport = searchParams.get('sport') || 'All';
  const searchQuery = searchParams.get('q') || '';

  // Dynamic state for backend data
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSquad, setActiveSquad] = useState(null);

  // Fetch teams from backend API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/teams');
        const result = await response.json();

        if (result.success) {
          setTeams(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch teams');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Escape key modal closer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveSquad(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update URL parameters
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter processing for dynamic backend teams
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesDept = selectedDept === "All" || team.department === selectedDept;
      const matchesSport = selectedSport === "All" || team.sport === selectedSport;
      const matchesSearch = 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        team.captain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.sport.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSport && matchesSearch;
    });
  }, [teams, selectedDept, selectedSport, searchQuery]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      
      {/* Section 1 — Hero */}
      <section className="khit-hero-gradient text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="khit-container relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-3">
            Campus Squads
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            KHIT Sports <span className="text-[#F2B84B]">Teams</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Meet the formidable squads representing their departments across various outdoor and indoor sports disciplines.
          </p>
        </div>
      </section>

      {/* Section 2 — Filters */}
      <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            
            {/* Search Input */}
            <div>
              <label htmlFor="team-search" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Search Teams
              </label>
              <div className="relative">
                <input
                  id="team-search"
                  type="text"
                  placeholder="Search by team, captain, sport..."
                  value={searchQuery}
                  onChange={(e) => updateFilter('q', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => updateFilter('q', '')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="dept-select" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Department
              </label>
              <select
                id="dept-select"
                value={selectedDept}
                onChange={(e) => updateFilter('dept', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent bg-white transition-all"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Sport */}
            <div>
              <label htmlFor="sport-select" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Sport Discipline
              </label>
              <select
                id="sport-select"
                value={selectedSport}
                onChange={(e) => updateFilter('sport', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent bg-white transition-all"
              >
                {SPORTS.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

          </div>

          {(selectedDept !== "All" || selectedSport !== "All" || searchQuery !== "") && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-[#64748B]">
                Showing {filteredTeams.length} of {teams.length} squads matching criteria.
              </span>
              <button 
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#7A1E2D] hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Loading & Error Indicators */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-[#7A1E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#64748B] font-semibold">Loading Live KHIT Teams...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 max-w-md mx-auto text-center">
            <span className="text-3xl block mb-2">⚠️</span>
            <h4 className="font-bold text-lg mb-1">Connection Error</h4>
            <p className="text-xs">{error}. Please make sure your backend server is running.</p>
          </div>
        )}

        {/* Teams Grid */}
        {!loading && !error && filteredTeams.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">No Squads Found</h3>
            <p className="text-sm text-[#64748B] mb-4">No team entries matching your criteria currently exist in the database.</p>
            <button onClick={handleResetFilters} className="btn-maroon px-4 py-2 text-xs font-bold rounded-lg">
              View All Teams
            </button>
          </div>
        ) : (
          !loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeams.map((team) => (
                <div key={team._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between transition-shadow animate-fade-in">
                  
                  {/* Header */}
                  <div className={`p-6 bg-gradient-to-r ${team.colorTheme || 'from-[#7A1E2D] to-[#8B1F2F]'} text-white relative`}>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {team.category}
                    </div>
                    <span className="text-xs text-[#F2B84B] uppercase font-bold tracking-widest block mb-1">
                      {team.department} • {team.sport}
                    </span>
                    <h3 className="text-xl font-extrabold tracking-tight">{team.name}</h3>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">Captain</span>
                        <span className="text-sm font-semibold text-[#0F172A] truncate block">{team.captain}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">Vice-Captain</span>
                        <span className="text-sm font-semibold text-[#0F172A] truncate block">{team.viceCaptain || "N/A"}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#64748B]">Squad Size</span>
                        <span className="font-bold text-[#0F172A] bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">
                          {team.squadSize} Players
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#64748B]">Win Ratio</span>
                          <span className="font-bold text-[#0F172A]">{team.winRatio}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#F2B84B] h-full rounded-full transition-all duration-500" 
                            style={{ width: `${team.winRatio}%` }}
                          />
                        </div>
                      </div>

                      {team.achievement && (
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-2">
                          <span className="text-[#F2B84B] mt-0.5 flex-shrink-0">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <p className="text-xs font-semibold text-[#7A1E2D] italic bg-red-50/50 px-2 py-1 rounded">
                            {team.achievement}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between gap-4">
                    <span className="text-xs text-[#64748B] italic">Roster Verified</span>
                    <button 
                      onClick={() => setActiveSquad(team)}
                      className="text-white bg-[#7A1E2D] hover:bg-[#8B1F2F] px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
                    >
                      View Squad
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )
        )}
      </section>

      {/* Section 5 — Standings & Register Instruction */}
      <section className="khit-section max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Standings */}
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">
                  Annual Scoreboard
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Departmental Standings
                </h2>
                <p className="text-[#64748B] text-sm mt-1 leading-relaxed">
                  Interactive scoreboard aggregated across inter-departmental athletic matches.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#0F172A]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-[#64748B] text-xs uppercase font-semibold">
                      <th className="py-3 px-3 text-center">Rank</th>
                      <th className="py-3 px-4">Dept</th>
                      <th className="py-3 px-3 text-center">Played</th>
                      <th className="py-3 px-3 text-center">Wins</th>
                      <th className="py-3 px-3 text-center">Losses</th>
                      <th className="py-3 px-4 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {DEPARTMENT_STANDINGS.map((row) => (
                      <tr key={row.department} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-3 text-center font-bold text-[#64748B]">{row.rank}</td>
                        <td className="py-3.5 px-4 font-bold">{row.department}</td>
                        <td className="py-3.5 px-3 text-center text-[#64748B]">{row.played}</td>
                        <td className="py-3.5 px-3 text-center text-emerald-600 font-semibold">{row.wins}</td>
                        <td className="py-3.5 px-3 text-center text-red-500">{row.losses}</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-[#7A1E2D]">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registration Box */}
            <div className="bg-[#EAF2FA] p-8 rounded-2xl border border-blue-100 flex flex-col justify-between h-full">
              <div>
                <span className="bg-[#7A1E2D] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md inline-block mb-3">
                  Requirements
                </span>
                <h3 className="text-xl font-bold text-[#7A1E2D] mb-3">Want to Register a Team?</h3>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed mb-6">
                  Only Head of Departments or verified Physical Directors can officialize a squad roster on the KHIT Live Sports system. Contact your department's physical education coordinator to finalize team registrations for current tournaments.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#7A1E2D]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="text-xs text-[#0F172A] font-semibold">
                  Roster modifications lock 48 hours prior to tournament launch.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Roster Modal */}
      {activeSquad && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-transform">
            
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${activeSquad.colorTheme || 'from-[#7A1E2D] to-[#8B1F2F]'} text-white relative`}>
              <button 
                onClick={() => setActiveSquad(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-xs text-[#F2B84B] font-bold tracking-widest block uppercase mb-1">
                {activeSquad.department} • {activeSquad.sport} ({activeSquad.category})
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">
                {activeSquad.name}
              </h3>
            </div>

            {/* Roster Contents */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Active Lineup</span>
                <span className="text-xs bg-[#EAF2FA] text-[#7A1E2D] font-bold px-2.5 py-1 rounded-md">
                  {activeSquad.squadSize} Players Registered
                </span>
              </div>

              <div className="space-y-2 pr-1">
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8FAFC] border border-gray-50">
                  <div>
                    <p className="font-semibold text-sm text-[#0F172A]">{activeSquad.captain}</p>
                    <span className="text-[11px] text-[#64748B] font-medium">Captain</span>
                  </div>
                </div>
                {activeSquad.viceCaptain && (
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8FAFC] border border-gray-50">
                    <div>
                      <p className="font-semibold text-sm text-[#0F172A]">{activeSquad.viceCaptain}</p>
                      <span className="text-[11px] text-[#64748B] font-medium">Vice Captain</span>
                    </div>
                  </div>
                )}
                <p className="text-xs text-[#64748B] italic text-center py-4">To view complete student numbers and rosters, navigate to the active Players section.</p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Validated by Physical Education Dept.</span>
                </div>
                <button 
                  onClick={() => setActiveSquad(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0F172A] font-bold text-xs rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}