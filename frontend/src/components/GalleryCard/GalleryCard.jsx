import React from 'react';

function GalleryCard({
  imageUrl = '',
  title = 'Tournament Match',
  sport = 'Cricket',
  date = '2026',
  event = 'Annual Sports Meet' // Dynamic event grouping prop
}) {
  const activeImage = imageUrl || "/gallery-placeholder.jpg";

  return (
    <div className="group relative rounded-xl overflow-hidden aspect-video md:aspect-square bg-slate-100 border border-slate-100 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md">
      
      {/* Gallery Image */}
      <img
        src={activeImage}
        alt={`${sport} - ${title}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          // Inline dynamic SVG fallback if image resolution fails
          e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23F1F5F9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%2394A3B8'>Image Error</text></svg>";
        }}
      />

      {/* Hover Information Overlay (Desktop / Large Screens) */}
      <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <span className="text-[10px] font-bold text-[#F2B84B] uppercase tracking-widest mb-1">
          {sport} {event && `• ${event}`} • {date}
        </span>
        <h4 className="text-white text-xs sm:text-sm font-bold leading-snug truncate">
          {title}
        </h4>
      </div>

      {/* Static Mobile Information Overlay (Always Visible on Mobile / Touch Screens) */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] p-2.5 md:hidden">
        <p className="text-white text-[11px] font-bold truncate leading-tight">
          {title}
        </p>
        <p className="text-[#F2B84B] text-[9px] uppercase tracking-wider font-extrabold mt-0.5">
          {sport}
        </p>
      </div>

      {/* Static top-left label (Hidden when hover is active on desktop) */}
      <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm md:group-hover:opacity-0 transition-opacity duration-200">
        {sport}
      </div>

    </div>
  );
}

export default GalleryCard;