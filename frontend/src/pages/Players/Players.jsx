import React, { useState, useEffect, useMemo } from 'react';

// Static Filter Options
const DEPARTMENTS = ["All", "CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"];
const SPORTS = ["All", "Cricket", "Volleyball", "Basketball", "Kabaddi", "Athletics", "Badminton", "Throwball", "Chess", "Carroms", "Table Tennis"];
const YEARS = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];
const GENDERS = ["All", "Boys", "Girls"];

export default function Players() {
  // Dynamic Roster States
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");

  // Fetch players from backend on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/players');
        const result = await response.json();

        if (result.success) {
          setPlayers(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch players');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Filter Logic Implementation
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesDept = selectedDept === "All" || player.department === selectedDept;
      const matchesSport = selectedSport === "All" || player.sport === selectedSport;
      const matchesYear = selectedYear === "All" || player.year === selectedYear;
      const matchesGender = selectedGender === "All" || player.gender === selectedGender;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        player.name.toLowerCase().includes(searchLower) ||
        player.rollNo.toLowerCase().includes(searchLower) ||
        player.sport.toLowerCase().includes(searchLower) ||
        player.department.toLowerCase().includes(searchLower);

      return matchesDept && matchesSport && matchesYear && matchesGender && matchesSearch;
    });
  }, [players, searchQuery, selectedDept, selectedSport, selectedYear, selectedGender]);

  // Performance Snapshots aggregated metrics
  const snapshotMetrics = useMemo(() => {
    return filteredPlayers.reduce(
      (acc, curr) => {
        acc.matches += curr.matchesPlayed || 0;
        acc.wins += curr.wins || 0;
        acc.medals += curr.medalsCount || 0;
        acc.mvp += curr.mvpCount || 0;
        return acc;
      },
      { matches: 0, wins: 0, medals: 0, mvp: 0 }
    );
  }, [filteredPlayers]);

  const featuredAthletes = useMemo(() => {
    return players.filter(player => player.isFeatured);
  }, [players]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDept("All");
    setSelectedSport("All");
    setSelectedYear("All");
    setSelectedGender("All");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      
      {/* Section 1 — Hero */}
      <section className="khit-hero-gradient relative text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="khit-container relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-4">
            KHIT Athletes
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            KHIT Sports <span className="text-[#F2B84B]">Players</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Meet the dedicated sportspersons of KHIT who showcase exceptional discipline, athletic capability, and teamwork across local and zonal matches.
          </p>
        </div>
      </section>

      {/* Section 2 — Statistics Overview */}
      <section className="relative z-20 -mt-10 max-w-5xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden border border-gray-100">
          <div className="p-6 text-center hover:bg-slate-50 transition-colors">
            <span className="block text-3xl md:text-4xl font-extrabold text-[#7A1E2D]">500+</span>
            <span className="block text-xs text-[#64748B] font-semibold uppercase tracking-wider mt-1">Active Players</span>
          </div>
          <div className="p-6 text-center hover:bg-slate-50 transition-colors">
            <span className="block text-3xl md:text-4xl font-extrabold text-[#7A1E2D]">10+</span>
            <span className="block text-xs text-[#64748B] font-semibold uppercase tracking-wider mt-1">Sports Played</span>
          </div>
          <div className="p-6 text-center hover:bg-slate-50 transition-colors">
            <span className="block text-3xl md:text-4xl font-extrabold text-[#7A1E2D]">50+</span>
            <span className="block text-xs text-[#64748B] font-semibold uppercase tracking-wider mt-1">Medal Winners</span>
          </div>
          <div className="p-6 text-center hover:bg-slate-50 transition-colors">
            <span className="block text-3xl md:text-4xl font-extrabold text-[#7A1E2D]">25+</span>
            <span className="block text-xs text-[#64748B] font-semibold uppercase tracking-wider mt-1">Team Captains</span>
          </div>
        </div>
      </section>

      {/* Section 3 — Search & Filters */}
      <section className="khit-section max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="player-search" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Search Roster
              </label>
              <input
                id="player-search"
                type="text"
                placeholder="Search by name, roll no, sport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label htmlFor="dept-filter" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Department
              </label>
              <select
                id="dept-filter"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] bg-white"
              >
                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>

            {/* Sport Filter */}
            <div>
              <label htmlFor="sport-filter" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Sport
              </label>
              <select
                id="sport-filter"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] bg-white"
              >
                {SPORTS.map(sport => <option key={sport} value={sport}>{sport}</option>)}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label htmlFor="year-filter" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Year
              </label>
              <select
                id="year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] bg-white"
              >
                {YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label htmlFor="gender-filter" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Gender
              </label>
              <select
                id="gender-filter"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] bg-white"
              >
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

          </div>

          {(searchQuery !== "" || selectedDept !== "All" || selectedSport !== "All" || selectedYear !== "All" || selectedGender !== "All") && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-[#64748B]">
                Filtered {filteredPlayers.length} athletes.
              </span>
              <button onClick={handleResetFilters} className="text-xs font-bold text-[#7A1E2D] hover:underline">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Loading & Error Blocks */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-[#7A1E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#64748B] font-semibold">Loading Live KHIT Roster...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 max-w-md mx-auto text-center">
            <span className="text-3xl block mb-2">⚠️</span>
            <h4 className="font-bold text-lg mb-1">Connection Error</h4>
            <p className="text-xs">{error}. Please make sure your backend server is running.</p>
          </div>
        )}

        {/* Players Grid */}
        {!loading && !error && filteredPlayers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">No Athletes Found</h3>
            <p className="text-sm text-[#64748B] mb-4">Try clearing active parameters or widening your search.</p>
            <button onClick={handleResetFilters} className="btn-maroon px-4 py-2 text-xs font-bold rounded-lg">
              Show All Athletes
            </button>
          </div>
        ) : (
          !loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlayers.map((player) => (
                <div key={player._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
                  
                  {/* Avatar Frame */}
                  <div className="h-44 bg-[#EAF2FA] relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                    
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md relative z-10 text-[#7A1E2D]">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    <div className="absolute top-4 left-4 z-20 flex gap-1.5 flex-wrap">
                      <span className="bg-[#7A1E2D] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {player.sport}
                      </span>
                      {player.isCaptain && (
                        <span className="bg-[#F2B84B] text-[#7A1E2D] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                          Captain
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-3 right-3 text-[11px] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-gray-700 font-medium z-20">
                      {player.year}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-extrabold text-xl text-[#0F172A] group-hover:text-[#7A1E2D] transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-xs text-[#64748B] font-mono mt-0.5">{player.rollNo}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm border-t border-gray-100 pt-4">
                      <div>
                        <span className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Department</span>
                        <span className="font-semibold text-[#0F172A]">{player.department}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Position</span>
                        <span className="font-semibold text-[#0F172A]">{player.position || 'Player'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="p-4 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between text-xs text-[#64748B]">
                    <span>Matches: <b>{player.matchesPlayed || 0}</b></span>
                    <span>Medals: <b>{player.medalsCount || 0}</b></span>
                    <span>Wins: <b>{player.wins || 0}</b></span>
                  </div>

                </div>
              ))}
            </div>
          )
        )}
      </section>

      {/* Section 5 — Featured Athletes */}
      {!loading && !error && featuredAthletes.length > 0 && (
        <section className="bg-white py-16 border-y border-gray-100 mt-12">
          <div className="khit-container max-w-7xl mx-auto px-4">
            
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Top Performers</span>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Featured Athletes</h2>
              <p className="text-[#64748B] text-sm mt-1 max-w-lg mx-auto">
                Highlighting exceptional sportspersons who have consistent tracks of championship and leadership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredAthletes.map((athlete) => (
                <div key={athlete._id} className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                  
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#EAF2FA] rounded-bl-full -z-0 transition-all group-hover:scale-110" />

                  <div className="relative z-10 flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-[#7A1E2D] flex-shrink-0">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2-s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-[#0F172A]">{athlete.name}</h3>
                      <span className="text-xs bg-[#EAF2FA] text-[#7A1E2D] px-2 py-0.5 rounded font-bold">{athlete.sport}</span>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3 mt-4 text-sm">
                    <p className="text-gray-600 italic">"{athlete.achievementText || 'Core team player'}"</p>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 text-[#64748B]">
                      <span>Total Medal Counts</span>
                      <span className="font-bold text-[#0F172A]">{athlete.medalsCount || 0} Medals</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#64748B]">
                      <span>Regional MVPs</span>
                      <span className="font-bold text-[#0F172A]">{athlete.mvpCount || 0} Awards</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Section 6 — Performance Snapshot */}
      {!loading && !error && (
        <section className="khit-section max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <div className="text-center mb-10 max-w-xl mx-auto">
              <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Current Filter Roster</span>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Performance Snapshot</h2>
              <p className="text-[#64748B] text-sm mt-1">
                Consolidated, live metrics tracking current filter-group matches, wins, achievements, and player standings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-2xl text-center">
                <span className="text-3xl font-extrabold text-[#7A1E2D]">{snapshotMetrics.matches}</span>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-1">Matches Played</p>
              </div>

              <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-2xl text-center">
                <span className="text-3xl font-extrabold text-[#7A1E2D]">{snapshotMetrics.wins}</span>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-1">Wins Logged</p>
              </div>

              <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-2xl text-center">
                <span className="text-3xl font-extrabold text-[#7A1E2D]">{snapshotMetrics.medals}</span>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-1">Medals Captured</p>
              </div>

              <div className="bg-[#F8FAFC] border border-gray-100 p-6 rounded-2xl text-center">
                <span className="text-3xl font-extrabold text-[#7A1E2D]">{snapshotMetrics.mvp}</span>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-1">MVP Accolades</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 7 — Recruitment / Trials CTA */}
      <section className="text-center max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Ready to Represent?</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-3">
            Want to represent KHIT?
          </h2>
          <p className="text-[#64748B] text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Join the upcoming seasonal trials, practice squads, and selection sessions to secure your spot inside your department squad roster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-maroon px-6 py-3 font-bold rounded-lg text-sm w-full sm:w-auto">
              View Trials
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-[#0F172A] px-6 py-3 font-bold rounded-lg text-sm w-full sm:w-auto transition-colors">
              Contact Sports Department
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}