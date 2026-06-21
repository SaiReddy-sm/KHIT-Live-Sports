import React, { useState, useEffect, useMemo } from 'react';

const SPORTS = ["Cricket", "Volleyball", "Basketball", "Kabaddi", "Badminton", "Table Tennis", "Chess"];

export default function Sports() {
  const [matches, setMatches] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null); // Null shows directory list
  const [loading, setLoading] = useState(true);

  // Points Table & Stats visibility toggles controlled by settings (mocked from database)
  const [pointsTableEnabled, setPointsTableEnabled] = useState(false);
  const [statsEnabled, setStatsEnabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [matchRes, galleryRes] = await Promise.all([
          fetch("http://localhost:5000/api/matches").then(res => res.json()),
          fetch("http://localhost:5000/api/gallery").then(res => res.json())
        ]);
        if (matchRes.success) setMatches(matchRes.data);
        if (galleryRes.success) setGallery(galleryRes.data);
      } catch (err) {
        console.warn("Using offline sport data channels:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filters matching active chosen sport
  const sportMatches = useMemo(() => {
    return matches.filter(m => m.sport === selectedSport);
  }, [matches, selectedSport]);

  const sportGallery = useMemo(() => {
    return gallery.filter(g => g.sport === selectedSport && g.category === "Photos");
  }, [gallery, selectedSport]);

  const sportAchievements = useMemo(() => {
    return gallery.filter(g => g.sport === selectedSport && g.category === "Achievements");
  }, [gallery, selectedSport]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] text-white py-12 px-4 relative overflow-hidden border-b-4 border-[#F2B84B]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-3">
            Sports Hub
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white">
            {selectedSport ? `${selectedSport} Directory` : "Sports Disciplines"}
          </h1>
          <p className="text-xs md:text-sm text-gray-200 mt-2">
            {selectedSport ? `Explore ${selectedSport} matches, achievements, and gallery frames.` : "Select an active campus discipline to view schedules and media."}
          </p>
        </div>
      </section>

      {/* Directory Back navigation */}
      {selectedSport && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <button 
            onClick={() => setSelectedSport(null)}
            className="text-xs font-bold text-[#7A1E2D] hover:underline flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm"
          >
            &larr; Back to Sports Directory
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#7A1E2D] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : !selectedSport ? (
          
          /* VIEW 1: DIRECTORY GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {SPORTS.map((sport) => (
              <div 
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className="bg-white border border-gray-100 rounded-2xl p-6 text-center cursor-pointer shadow-sm hover:shadow-md hover:border-[#7A1E2D] hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-3xl block mb-2 transition-transform duration-300 group-hover:scale-110">🏆</span>
                <h3 className="font-extrabold text-sm text-[#0F172A]">{sport}</h3>
                <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-red-50 text-[#7A1E2D] rounded">
                  Explore Hub
                </span>
              </div>
            ))}
          </div>

        ) : (
          
          /* VIEW 2: INDIVIDUAL SPORT HUB VIEW */
          <div className="space-y-12 animate-fade-in">
            
            {/* Matches Subsection */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-[#7A1E2D] border-b border-gray-200 pb-2">Matches & Fixtures</h2>
              {sportMatches.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No active match records found for {selectedSport}.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sportMatches.map(match => (
                    <div key={match._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-sm text-[#0F172A]">{match.teamA} vs {match.teamB}</h3>
                        <p className="text-xs text-slate-400 mt-1">📍 {match.venue} • {match.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase text-[#7A1E2D] block">{match.status}</span>
                        {match.status !== "Upcoming" && (
                          <span className="text-xs font-bold block mt-1">{match.scoreA} - {match.scoreB}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements Subsection */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-[#7A1E2D] border-b border-gray-200 pb-2">Achievements</h2>
              {sportAchievements.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No trophies or medals logged under this category.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sportAchievements.map(ach => (
                    <div key={ach._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{ach.title}</h4>
                        <p className="text-[10px] text-[#7A1E2D] font-bold uppercase mt-0.5">{ach.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gallery Subsection */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-[#7A1E2D] border-b border-gray-200 pb-2">Action Gallery</h2>
              {sportGallery.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No snapshots uploaded for this category yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {sportGallery.map(photo => (
                    <div key={photo._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <div className="h-32 bg-[#EAF2FA]">
                        <img 
                          src={photo.image.startsWith("http") ? photo.image : `http://localhost:5000${photo.image}`} 
                          alt={photo.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-3 bg-white">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{photo.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

    </div>
  );
}