import React from 'react';

function AchievementCard({
  title = 'Inter-Departmental Trophy Winners',
  sport = 'Volleyball (Boys)',
  year = '2024',
  description = 'CSE branch secured Gold Medal in the annual institutional sports tournament.',
  department = 'KHIT Physical Education Dept.',
  achievementType = '1st Prize' // Prepared for future dynamic filtering
}) {
  return (
    <div className="khit-card p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-amber-100">
      <div>
        {/* Header Tags */}
        <div className="flex justify-between items-center gap-4 mb-4">
          <span className="khit-badge-gold shrink-0">
            🏆 KHIT Achievement
          </span>
          <span className="text-xs font-semibold text-slate-400 text-right truncate">
            {sport} • {year}
          </span>
        </div>
        
        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] sm:text-xs text-slate-400">
        <span className="font-medium tracking-wide">{department}</span>
        {achievementType && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
            {achievementType}
          </span>
        )}
      </div>
    </div>
  );
}

export default AchievementCard;