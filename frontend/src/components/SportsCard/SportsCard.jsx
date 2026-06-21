import React from 'react';

// Helper to return premium, custom vector icons for each sport
const getSportIcon = (sportName) => {
  const name = sportName.toLowerCase();
  
  // Custom SVG Icons (Maroon & Gold styling)
  if (name.includes('cricket')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM4 19.5l11-11M6 21.5l11-11M5 15.5l3.5 3.5" />
      </svg>
    );
  }
  if (name.includes('volleyball') || name.includes('throwball')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 00-6 6.5M18 15.5a9 9 0 00-6-6.5" />
        <path d="M6 15.5c4-2 8-2 12 0M12 21a9 9 0 01-6-6.5" />
      </svg>
    );
  }
  if (name.includes('kabaddi') || name.includes('athletics')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM4 18l4-4 3 2 5-6 4 3" />
      </svg>
    );
  }
  if (name.includes('basketball')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12a6 6 0 0112 0M12 6a6 6 0 010 12" />
      </svg>
    );
  }
  if (name.includes('badminton')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12a4 4 0 100-8 4 4 0 000 8zm0 0l6 6m1-5l2 2m0-5l-2 2" />
      </svg>
    );
  }
  if (name.includes('chess')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12M9 17h6M8 10a4 4 0 018 0v4H8v-4zM12 4v2m-2-1h4" />
      </svg>
    );
  }
  if (name.includes('carroms')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    );
  }
  if (name.includes('tennis')) {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="16" cy="8" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16l4-4M5 20a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    );
  }

  // Fallback Shield Icon
  return (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
};

function SportsCard({
  name = 'Cricket',
  categories = ['Boys', 'Girls']
}) {
  return (
    <div className="group relative bg-white rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer border border-[#7A1E2D]/10 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#7A1E2D]/30 hover:-translate-y-1">
      
      {/* Decorative Gold Top Edge Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F2B84B] to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Premium Circular Icon Wrapper (Maroon with Gold Border Accent) */}
      <div className="w-16 h-16 rounded-full bg-[#7A1E2D] border-2 border-[#F2B84B] flex items-center justify-center shadow-md mb-4 transform transition-transform duration-300 group-hover:scale-110">
        {getSportIcon(name)}
      </div>
      
      {/* Sport Title */}
      <h3 className="font-extrabold text-[#7A1E2D] text-base leading-tight mb-3 tracking-wide transition-colors duration-150">
        {name}
      </h3>
      
      {/* Categorized Gender Badges */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {categories.map((category) => (
          <span 
            key={category} 
            className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-[#7A1E2D]/5 text-[#7A1E2D] border border-[#7A1E2D]/15 tracking-wider"
          >
            {category}
          </span>
        ))}
      </div>

    </div>
  );
}

export default SportsCard;