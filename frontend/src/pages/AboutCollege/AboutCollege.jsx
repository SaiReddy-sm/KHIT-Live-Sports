import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutCollege() {
  const leadership = [
    {
      name: "Mr. Kallam Haranadhareddy garu",
      role: "Founder Chairman",
      badge: "Legacy Visionary",
      photo: "/logo.jpg",
      description: "Founded the institution to promote accessible technical education. He envisions sports as a crucial element in building focus, health, and athletic discipline among young professionals.",
    },
    {
      name: "Mr. K. Mohan Reddy",
      role: "Chairman",
      badge: "Strategic Director",
      photo: "/logo.jpg",
      description: "Spearheading physical infrastructure expansions. His administrative roadmap prioritizes creating standard training arenas for indoor and outdoor tournament leagues.",
    },
    {
      name: "Dr. M. Uma Sankar Reddy",
      role: "Director",
      badge: "Academic & Sports Mentor",
      photo: "/logo.jpg",
      description: "Integrating balanced training frameworks. He advocates for active athletic involvement alongside rigorous engineering curriculum to nurture leadership.",
    },
    {
      name: "Dr. BSB Reddy",
      role: "Principal",
      badge: "Operational Leader",
      photo: "/logo.jpg",
      description: "Sustaining regular on-ground operations, selections, and tournament discipline. He keeps the athlete student-bodies motivated to represent KHIT at state levels.",
    }
  ];

  const visionMission = [
    {
      type: "Our Vision",
      icon: "🎯",
      text: "To emerge as a premier technical destination where academic milestones are balanced with high-grade athletic discipline, cultivating healthy, responsible, and visionary leaders of tomorrow.",
      accent: "border-[#7A1E2D]"
    },
    {
      type: "Our Mission",
      icon: "🚀",
      text: "To supply student athletes with high-performance coaching, standard facilities, and competitive match exposure across sports, fostering sportsmanship and career-defining team spirit.",
      accent: "border-[#F2B84B]"
    }
  ];

  const facilities = [
    { name: "Cricket Ground", emoji: "🏏", desc: "Premium outfield with professional turf pitch and spectator bays." },
    { name: "Basketball Court", emoji: "🏀", desc: "Standard hard court built for high-speed practice matches and local tournaments." },
    { name: "Volleyball Court", emoji: "🏐", desc: "Lush clay courts equipped with optimal netting and evening lighting systems." },
    { name: "Indoor Stadium", emoji: "🏟️", desc: "Dedicated spaces for tactical board games, carrom matches, and table tennis." },
    { name: "Gymnasium", emoji: "🏋️", desc: "Strength training setups, weights, and conditioning tools for athletes." }
  ];

  const stats = [
    { value: "5000+", label: "Students" },
    { value: "12+", label: "Departments" },
    { value: "15+", label: "Sports Offered" },
    { value: "100+", label: "Achievements" },
    { value: "25+ Yrs", label: "Excellence" }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] antialiased">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-r from-[#7A1E2D] via-[#8B1F2F] to-[#7A1E2D] relative text-white py-20 px-4 md:py-28 overflow-hidden border-b-4 border-[#F2B84B]">
        {/* Animated pattern look */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#F2B84B] opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#D9A441] opacity-5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-black text-xs px-5 py-1.5 rounded-full uppercase tracking-widest shadow-md inline-block">
            KHIT Sports Legacy
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            About <span className="text-[#F2B84B]">KHIT Sports</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Welcome to the home of academic vigor and sporting excellence, where teamwork meets hard training and champion mentalities are forged.
          </p>
        </div>
      </section>

      {/* 2. COLLEGE INTRODUCTION SECTION (Glassmorphic Elements) */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/20 p-8 md:p-12 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Content side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-[#7A1E2D] tracking-widest">
                Our Institution
              </span>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">
                Kallam Haranadhareddy Institute of Technology
              </h2>
            </div>
            
            <p className="text-sm text-[#64748B] leading-relaxed">
              Kallam Haranadhareddy Institute of Technology (KHIT), established by the Kallam Academy, has stood as Guntur's premier engineering destination. We foster academic growth and active sports involvement equally to cultivate leaders who excel in multi-disciplinary fields.
            </p>
            
            <p className="text-sm text-[#64748B] leading-relaxed">
              Our expansive campus houses advanced training grounds, courts, and stadiums. By running annual tournaments, inter-departmental clashes, and fitness programs, our physical departments provide students with standard preparation pathways.
            </p>
          </div>

          {/* Large College Image slot */}
          <div className="lg:col-span-5 bg-white p-4 rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center aspect-video sm:aspect-square overflow-hidden relative group">
            <img 
              src="/logo.jpg" 
              alt="KHIT College Campus Landscape" 
              className="w-full h-full object-contain max-h-64 sm:max-h-80 rounded-xl transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute bottom-6 bg-slate-950/80 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md backdrop-blur-sm">
              Main Campus Arena View
            </div>
          </div>

        </div>
      </section>

      {/* 3. PREMIUM LEADERSHIP SPOTLIGHT (The Centerpiece Attraction) */}
      <section className="py-20 bg-gradient-to-b from-[#EAF2FA]/40 to-[#F8FAFC] border-y border-[#7A1E2D]/5">
        <div className="max-w-5xl mx-auto px-4">
          
          <div className="text-center mb-16 space-y-2">
            <span className="text-[10px] font-extrabold uppercase bg-red-50 text-[#7A1E2D] px-3 py-1 rounded-md">
              Leadership Spotlight
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
              Pillars of Inspiration
            </h2>
            <p className="text-xs md:text-sm text-[#64748B]">Meet the administrators driving our academic and athletic vision.</p>
          </div>

          <div className="space-y-16">
            {leadership.map((member, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[#F2B84B] group ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  
                  {/* Glowing Circular Image Frame */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    {/* Floating background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#7A1E2D] to-[#F2B84B] rounded-full blur opacity-10 group-hover:opacity-20 transition-opacity" />
                    
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full p-1.5 bg-white border-2 border-[#7A1E2D] shadow-[0_0_20px_rgba(242,184,75,0.4)] transition-all duration-300 group-hover:scale-105 relative z-10">
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="w-full h-full object-contain rounded-full bg-slate-50"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Content side */}
                  <div className="flex-grow space-y-3 text-center md:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2">
                      <span className="text-[9px] font-extrabold uppercase bg-red-50 text-[#7A1E2D] border border-[#7A1E2D]/10 px-2.5 py-0.5 rounded-full inline-block self-center">
                        {member.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#7A1E2D]">
                      {member.name}
                    </h3>

                    <p className="text-xs font-bold text-[#D9A441] tracking-wide uppercase">
                      {member.role}
                    </p>

                    <p className="text-xs md:text-sm text-[#64748B] leading-relaxed font-medium">
                      {member.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. VISION & MISSION */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visionMission.map((card, idx) => (
            <div 
              key={idx} 
              className={`bg-white p-8 rounded-3xl border-t-4 ${card.accent} shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-extrabold text-[#0F172A] mb-3">{card.type}</h3>
              <p className="text-xs md:text-sm text-[#64748B] leading-relaxed font-medium">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SPORTS FACILITIES SHOWCASE */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-[10px] font-extrabold uppercase bg-red-50 text-[#7A1E2D] px-2.5 py-1 rounded">
              Campus Arenas
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A]">
              Sports Facilities Showcase
            </h2>
            <p className="text-xs text-[#64748B]">Professional structures maintained to supply optimal training conditions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {facilities.map((fac, idx) => (
              <div 
                key={idx} 
                className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 text-center transition-all duration-300 hover:bg-white hover:border-[#F2B84B] hover:shadow-md hover:-translate-y-1 group"
              >
                <span className="text-3xl block mb-3 transition-transform duration-300 group-hover:scale-110">{fac.emoji}</span>
                <h3 className="font-extrabold text-sm text-[#0F172A] mb-1">{fac.name}</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{fac.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. STATISTICS SECTION */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 text-center">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center"
            >
              <span className="text-2xl md:text-3xl font-black text-[#7A1E2D] block mb-1">
                {stat.value}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl border-b-4 border-[#F2B84B]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-4xl font-black text-white">
              Join the Spirit of KHIT Sports
            </h2>
            <div className="flex justify-center gap-3 text-xs md:text-sm font-bold text-[#F2B84B] uppercase tracking-wider">
              <span>Compete</span> • <span>Lead</span> • <span>Inspire</span> • <span>Achieve</span>
            </div>
            <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-md mx-auto">
              Step onto the fields of KHIT. Build athletic fitness, represent your branch, and write your own legacy.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                to="/sports" 
                className="bg-[#F2B84B] hover:bg-[#D9A441] text-[#7A1E2D] text-xs font-bold px-8 py-3 rounded-lg shadow-md transition-all uppercase tracking-wider w-full sm:w-auto text-center"
              >
                Explore Sports
              </Link>
              <Link 
                to="/notices" 
                className="bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-bold px-8 py-3 rounded-lg transition-all uppercase tracking-wider w-full sm:w-auto text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}