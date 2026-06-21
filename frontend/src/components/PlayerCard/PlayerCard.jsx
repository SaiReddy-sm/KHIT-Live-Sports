import React from 'react';

function PlayerCard({
  playerName = 'K. Rajesh',
  role = 'All-Rounder',
  branch = 'CSE',
  jerseyNumber = '7',
  playerImage = '',
  matchesPlayed = 15,
  specialStatLabel = 'Runs',
  specialStatValue = '432'
}) {
  const activeImage = playerImage || "";

  return (
    <div className="khit-card group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#7A1E2D]/20 flex flex-col h-full overflow-hidden">
      
      {/* Player Image & Jersey Number Badge */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={activeImage}
          alt={`${playerName} - Player`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Dynamic SVG silhouette placeholder fallback if image fails or is missing
            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='200' viewBox='0 0 150 200'><rect width='100%' height='100%' fill='%23F1F5F9'/><path d='M75 90a30 30 0 100-60 30 30 0 000 60zm0 10c-25 0-45 15-45 35v15h90v-15c0-20-20-35-45-35z' fill='%2394A3B8'/></svg>";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>

        {/* Jersey Number Tag */}
        {jerseyNumber && (
          <span className="absolute top-3 right-3 bg-[#F2B84B] text-slate-900 text-xs font-black h-8 w-8 rounded-full flex items-center justify-center shadow-md border border-white/25">
            #{jerseyNumber}
          </span>
        )}

        {/* Branch / Department Label Over Image */}
        <span className="absolute bottom-3 left-3 bg-[#7A1E2D]/90 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
          {branch}
        </span>
      </div>

      {/* Player Details & Stats Card Area */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        
        <div>
          {/* Role */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {role}
          </span>
          {/* Name with Line Clamp 2 */}
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-[#7A1E2D] transition-colors duration-150 line-clamp-2 mt-0.5">
            {playerName}
          </h3>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 p-1.5 rounded">
            <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Matches
            </span>
            <span className="text-xs font-extrabold text-[#7A1E2D]">
              {matchesPlayed}
            </span>
          </div>
          {specialStatLabel && (
            <div className="bg-slate-50 p-1.5 rounded">
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                {specialStatLabel}
              </span>
              <span className="text-xs font-extrabold text-[#7A1E2D]">
                {specialStatValue}
              </span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default PlayerCard;