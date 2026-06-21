import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TournamentBanner from '../../components/TournamentBanner/TournamentBanner.jsx';
import MatchCard from '../../components/MatchCard/MatchCard.jsx';
import SportsCard from '../../components/SportsCard/SportsCard.jsx';
import AchievementCard from '../../components/AchievementCard/AchievementCard.jsx';
import GalleryCard from '../../components/GalleryCard/GalleryCard.jsx';

const mockSports = [
  { name: 'Cricket', categories: ['Boys', 'Girls'] },
  { name: 'Volleyball', categories: ['Boys', 'Girls'] },
  { name: 'Kabaddi', categories: ['Boys'] },
  { name: 'Basketball', categories: ['Boys', 'Girls'] },
  { name: 'Badminton', categories: ['Boys', 'Girls'] },
  { name: 'Throwball', categories: ['Girls'] },
  { name: 'Chess', categories: ['Boys', 'Girls'] },
  { name: 'Carroms', categories: ['Boys', 'Girls'] },
  { name: 'Athletics', categories: ['Boys', 'Girls'] },
  { name: 'Table Tennis', categories: ['Boys', 'Girls'] },
];

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [matchRes, noticeRes, galleryRes] = await Promise.all([
          fetch("http://localhost:5000/api/matches").then(res => res.json()),
          fetch("http://localhost:5000/api/notices").then(res => res.json()),
          fetch("http://localhost:5000/api/gallery").then(res => res.json())
        ]);

        if (matchRes.success) {
          setMatches(matchRes.data.slice(0, 3));
        }
        if (noticeRes.success) {
          const activeAlerts = noticeRes.data.filter(n => n.category === "Announcements");
          setAnnouncements(activeAlerts.slice(0, 4));
        }
        if (galleryRes.success) {
          const photosOnly = galleryRes.data.filter(g => g.category === "Photos");
          const achievementsOnly = galleryRes.data.filter(g => g.category === "Achievements");

          setGallery(photosOnly.slice(0, 4));
          setAchievements(achievementsOnly.slice(0, 2));
        }
      } catch (err) {
        console.warn("Using offline views:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Redirect to Sports Hub or specific fixtures tab
  const handleSportCardClick = (sportName) => {
    navigate(`/sports?select=${sportName}`);
  };

  const handleMatchCardClick = () => {
    navigate('/matches');
  };

  return (
    <div className="w-full bg-[#F8FAFC]">
      
      {/* Hero Banner */}
      <section className="w-full bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] text-white py-12 md:py-20 relative overflow-hidden border-b-4 border-[#F2B84B]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl text-center md:text-left space-y-4">
            <span className="bg-[#F2B84B] text-[#7A1E2D] font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block">
              KHIT Live Sports
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Fuel Your Passion, <br/>
              <span className="text-[#F2B84B]">Play To Win</span>
            </h1>
            <p className="text-sm md:text-base text-gray-200 leading-relaxed font-medium">
              Track live scores, team sheets, tournament fixtures, and campus achievements directly from Guntur's sporting hub.
            </p>
          </div>

          <div className="w-full md:w-1/2 max-w-lg bg-white p-3 rounded-2xl shadow-xl border border-white/10 flex items-center justify-center overflow-hidden">
            <img 
              src="/logo-full.jpg" 
              alt="KHIT College Logo Banner" 
              className="w-full h-auto object-contain rounded-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>

      {/* Tournament Banner */}
      <section className="py-6 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <TournamentBanner 
            title="ANNUAL SPORTS MEET 2026"
            subtitle="Register teams across indoor and outdoor games. Show off your branch's athletic skills."
            buttonText="Register Now"
          />
        </div>
      </section>

      {/* Bulletins */}
      <section className="py-10 max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-xl font-extrabold text-[#7A1E2D]">Campus Bulletin</h2>
          <p className="text-xs text-slate-500 mt-1">Instant updates, trial dates, and sports notices</p>
        </div>

        {announcements.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#7A1E2D]/20 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm">
            <span className="text-3xl block mb-2">🏟️</span>
            <h3 className="font-bold text-[#7A1E2D] text-base mb-1">Campus is quiet today!</h3>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto">
              No active selection trials or matches are currently delayed. Check back during tournament weeks for immediate notifications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border-l-4 border-[#7A1E2D] shadow-sm">
                <span className="text-[9px] font-extrabold uppercase bg-red-50 text-[#7A1E2D] px-2 py-0.5 rounded">
                  Alert Update
                </span>
                <h3 className="font-extrabold text-sm text-[#0F172A] mt-2">{ann.title}</h3>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Match Center */}
      <section id="matches" className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#7A1E2D]">Match Center</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time status of KHIT inter-department matches</p>
          </div>
          <button onClick={handleMatchCardClick} className="text-sm font-semibold text-[#7A1E2D] hover:underline hidden sm:block">
            All Matches &rarr;
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-6 text-slate-400 italic">No fixtures currently active.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer">
            {matches.map((match) => (
              <div key={match._id} onClick={handleMatchCardClick}>
                <MatchCard 
                  sport={match.sport}
                  status={match.status}
                  teamA={match.teamA}
                  teamB={match.teamB}
                  scoreA={match.scoreA}
                  scoreB={match.scoreB}
                  time={match.time}
                  venue={match.venue}
                  gender="Boys"
                  result={match.statusDetail}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sports Disciplines */}
      <section id="sports" className="bg-[#EAF2FA] py-16 border-y border-[#7A1E2D]/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#7A1E2D]">Sports Disciplines</h2>
            <p className="text-sm text-slate-600 mt-2">
              We offer multiple indoor and outdoor sports options promoting physical fitness and teamwork among students across all departments.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockSports.map((sport) => (
              <div 
                key={sport.name} 
                onClick={() => handleSportCardClick(sport.name)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <SportsCard 
                  name={sport.name}
                  categories={sport.categories}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wall Of Fame */}
      <section id="achievements" className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#7A1E2D]">Wall of Fame</h2>
          <p className="text-sm text-slate-500 mt-2">Celebrating our branches' achievements and collegiate athletic accomplishments</p>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-6 text-slate-400 italic">No achievements published in the catalog.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {achievements.map((ach) => (
              <AchievementCard 
                key={ach._id}
                title={ach.title}
                sport={ach.sport}
                year="2026"
                description={ach.title}
                achievementType="Champions"
              />
            ))}
          </div>
        )}
      </section>

      {/* Gallery moments */}
      <section id="gallery" className="py-16 bg-[#FFFFFF] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#7A1E2D]">Moments in Action</h2>
              <p className="text-sm text-slate-500 mt-1">Snapshots of tournament highlights and achievements on the ground</p>
            </div>
            <a href="/gallery" className="text-sm font-semibold text-[#7A1E2D] hover:text-[#8B1F2F] hidden sm:block">
              View Gallery &rarr;
            </a>
          </div>

          {gallery.length === 0 ? (
            <div className="text-center py-6 text-slate-400 italic">No visual frames uploaded.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((photo) => (
                <GalleryCard 
                  key={photo._id}
                  imageUrl={photo.image}
                  title={photo.title}
                  sport={photo.sport}
                  date="2026"
                  event={photo.category}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}