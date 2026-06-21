import React, { useState, useMemo } from 'react';
import ACHIEVEMENTS_DATA from '../../data/achievements.json';

const SPORTS = ["All", "Cricket", "Volleyball", "Basketball", "Kabaddi", "Athletics", "Badminton", "Throwball", "Chess", "Carroms", "Table Tennis"];
const YEARS = ["All", "2025", "2024", "2023", "2022"];

export default function Achievements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const filteredAchievements = useMemo(() => {
    return (ACHIEVEMENTS_DATA || []).filter((ach) => {
      const matchesSport = selectedSport === "All" || ach.sport === selectedSport;
      const matchesYear = selectedYear === "All" || ach.year === selectedYear;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        ach.title.toLowerCase().includes(searchLower) ||
        ach.sport.toLowerCase().includes(searchLower) ||
        (ach.description || "").toLowerCase().includes(searchLower) ||
        (ach.recipient || "").toLowerCase().includes(searchLower);

      return matchesSport && matchesYear && matchesSearch;
    });
  }, [searchQuery, selectedSport, selectedYear]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      <section className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-3">
            Hall of Fame
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Our <span className="text-[#F2B84B]">Achievements</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Celebrating the victories, medals, and championship runs of the KHIT sports squads.
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
              <label htmlFor="ach-search" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Search Achievements
              </label>
              <input
                id="ach-search"
                type="text"
                placeholder="Search award, recipient, sport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] transition-all"
              />
            </div>
            <div>
              <label htmlFor="sport-select" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Sport
              </label>
              <select
                id="sport-select"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] bg-white transition-all"
              >
                {SPORTS.map((sport) => <option key={sport} value={sport}>{sport}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="year-select" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Year
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] bg-white transition-all"
              >
                {YEARS.map((yr) => <option key={yr} value={yr}>{yr}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-8">
        {filteredAchievements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">No Achievements Found</h3>
            <p className="text-sm text-[#64748B]">Try clearing your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAchievements.map((ach) => (
              <div key={ach.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="h-48 bg-[#EAF2FA] relative overflow-hidden">
                  <img 
                    src={ach.image || "/assets/achievements/logo.jpg"} 
                    alt={ach.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo-full.jpg";
                    }}
                  />
                  <span className="absolute top-4 right-4 bg-[#F2B84B] text-[#7A1E2D] text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    🏆 {ach.year}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-[#7A1E2D] font-bold tracking-widest block mb-1 uppercase">
                    {ach.sport}
                  </span>
                  <h3 className="font-extrabold text-xl text-[#0F172A] mb-2">{ach.title}</h3>
                  <p className="text-sm text-[#64748B] mb-4">{ach.description}</p>
                  <div className="border-t border-gray-50 pt-4 text-xs text-[#64748B]">
                    <p>🎖️ <b>Winner / Recipient:</b> {ach.recipient}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}