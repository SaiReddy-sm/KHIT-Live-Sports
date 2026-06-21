import React from 'react';

function MatchCard({
  sport = 'Cricket',
  status = 'upcoming', // 'live' | 'upcoming' | 'completed'
  teamA = 'CSE',
  teamB = 'ECE',
  scoreA = '',
  scoreB = '',
  time = '10:00 AM',
  venue = 'Main Ground',
  gender = 'Boys',
  result = ''
}) {
  return (
    <div className="khit-card relative cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      
      {/* Header Area */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          {sport} ({gender})
        </span>
        
        {/* Status indicator wrapper */}
        <span className="flex items-center space-x-1.5">
          {status === 'live' && (
            <>
              <span className="khit-live-indicator">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="match-live text-xs uppercase tracking-wider">Live</span>
            </>
          )}
          {status === 'upcoming' && (
            <span className="match-upcoming text-xs uppercase tracking-wider text-[#7A1E2D]">Upcoming</span>
          )}
          {status === 'completed' && (
            <span className="match-completed text-xs uppercase tracking-wider text-green-600">Completed</span>
          )}
        </span>
      </div>

      {/* Team & Score Section */}
      <div className="p-5">
        <div className="space-y-4">
          
          {/* Team A Row */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">
              {teamA}
            </span>
            <span className="font-mono text-sm font-semibold text-slate-700">
              {status === 'live' || status === 'completed' ? scoreA : 'VS'}
            </span>
          </div>

          {/* Team B Row */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">
              {teamB}
            </span>
            <span className="font-mono text-sm font-semibold text-slate-700">
              {status === 'live' || status === 'completed' ? scoreB : 'VS'}
            </span>
          </div>

        </div>

        {/* Footer Area with Location/Schedule Context */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span className="truncate max-w-[150px]">{venue}</span>
          {status === 'upcoming' && time && (
            <span className="font-semibold text-[#7A1E2D]">{time}</span>
          )}
          {status === 'completed' && result && (
            <span className="font-semibold text-green-600 truncate max-w-[150px]">{result}</span>
          )}
        </div>
      </div>

    </div>
  );
}

export default MatchCard;