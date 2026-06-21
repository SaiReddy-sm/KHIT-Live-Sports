import React from 'react';

function TeamCard({
  teamName = 'CSE Strikers',
  sport = 'Cricket',
  department = 'Computer Science & Engineering',
  captain = 'K. Rajesh',
  teamImage = '',
  titles = 3 // Standardized as a numerical prop for easier database binding
}) {
  const activeImage = teamImage;

  return (
    <div className="khit-card group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#7A1E2D]/20 flex flex-col h-full">
      
      {/* Team Image Section with Gradient Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={activeImage}
          alt={`${teamName} - Team`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Dynamic SVG placeholder fallback if image fails or is missing
            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'><rect width='100%' height='100%' fill='%237A1E2D'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23F2B84B' font-weight='bold'>KHIT ATHLETES</text></svg>";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none"></div>

        {/* Sport Indicator Tag */}
        <span className="absolute top-3 left-3 bg-[#7A1E2D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md border border-[#F2B84B]/20">
          {sport}
        </span>
      </div>

      {/* Team Information Details */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        
        <div>
          {/* Department */}
          <span className="text-[10px] font-extrabold text-[#7A1E2D] uppercase tracking-wider block mb-1">
            {department}
          </span>
          {/* Team Name with Line Clamp */}
          <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-[#7A1E2D] transition-colors duration-150 line-clamp-2">
            {teamName}
          </h3>
        </div>

        {/* Captain & Roster Summary */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Team Captain:</span>
            <span className="font-bold text-slate-800">{captain}</span>
          </div>
        </div>

        {/* Achievements / Badge */}
        {titles > 0 && (
          <div className="pt-1 flex items-center">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-[#D9A441] border border-amber-100 shadow-sm">
              🏆 {titles} {titles === 1 ? 'Title' : 'Titles'}
            </span>
          </div>
        )}

      </div>

    </div>
  );
}

export default TeamCard;