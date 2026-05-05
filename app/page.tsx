"use client";

import { useState } from "react";
import { ChevronDown, Calendar, Users, Search, Hexagon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [selectedDate] = useState("Tümü");
  const [selectedClub] = useState("Tümü");
  const [selectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  // Senin orijinal verilerin (Aynen korundu!)
  const communities = [
    { id: 1, name: "IEEE", description: "Elektrik ve elektronik mühendisliği topluluğu", members: 1250, color: "blue" },
    { id: 2, name: "WIE", description: "Kadın mühendisler için ağ ve gelişim platformu", members: 845, color: "purple" },
    { id: 3, name: "RAS", description: "Robot ve otomasyon sistemleri topluluğu", members: 620, color: "cyan" },
    { id: 4, name: "ACM", description: "Bilgisayar bilimi ve yazılım geliştirme topluluğu", members: 1050, color: "blue" },
    { id: 5, name: "Design Club", description: "Grafik ve ürün tasarımı topluluğu", members: 430, color: "purple" },
    { id: 6, name: "Data Science", description: "Veri bilimi ve machine learning araştırma grubu", members: 520, color: "cyan" },
  ];

  const events = [
    { id: 1, name: "AI Workshop: Başlangıçtan İleri Seviyeye", club: "Data Science Club", date: "2026", category: "Workshop" },
    { id: 2, name: "Web Development Bootcamp", club: "ACM", date: "2026", category: "Bootcamp" },
    { id: 3, name: "Robotik Yarışması Ön Eleme", club: "RAS", date: "2026", category: "Yarışma" },
    { id: 4, name: "Design Thinking Workshop", club: "Design Club", date: "2026", category: "Workshop" },
    { id: 5, name: "IEEE Talks: Geleceğin Teknolojileri", club: "IEEE", date: "2026", category: "Konferans" },
    { id: 6, name: "WIE Networking Event", club: "WIE", date: "2026", category: "Networking" },
  ];

  // Renkleri karanlık temaya uygun neon parlaklıklara çevirdik
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "border-t-4 border-blue-500 hover:shadow-blue-500/20";
      case "purple": return "border-t-4 border-purple-500 hover:shadow-purple-500/20";
      case "cyan": return "border-t-4 border-cyan-500 hover:shadow-cyan-500/20";
      default: return "border-t-4 border-gray-500 hover:shadow-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans selection:bg-blue-500/30">

      {/* Header/Navbar - Koyu Cam */}
      <nav className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hexagon className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wider">
              CampOS
            </h1>
          </div>
          <Link href="/admin" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105">
            Admin Girişi
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative overflow-hidden">
        {/* Arkaplan parlamaları */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center space-y-8 relative z-10">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Kampüsün <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Dijital İşletim Sistemi
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Tüm üniversite topluluklarını tek platformda keşfet, etkinliklere katıl ve kampüs hayatının merkezinde yer al.
          </p>

          {/* Search Bar - Koyu Cam */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 bg-black/40 rounded-xl px-4 py-3 border border-white/5">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Topluluk veya etkinlik ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-200 placeholder-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topluluklar Grid - Koyu Cam */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h3 className="text-3xl font-bold">Topluluklarımız</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div
              key={community.id}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${getColorClasses(community.color)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-2xl font-bold text-gray-100">{community.name}</h4>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users size={20} className="text-blue-400" />
                </div>
              </div>
              <p className="text-gray-400 mb-6 line-clamp-2 h-12">{community.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-gray-400">
                  {community.members} Üye
                </span>
                <button className="text-sm font-semibold px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                  İncele
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Etkinlikler - Koyu Cam */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-20">
        <div className="flex items-center gap-4 mb-12">
          <h3 className="text-3xl font-bold">Yaklaşan Etkinlikler</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors">{event.name}</h4>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <Users size={14} /> {event.club}
                  </p>
                </div>
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-full whitespace-nowrap">
                  {event.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <Calendar size={16} className="text-purple-400" />
                <span className="text-sm font-medium">{event.date}</span>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300">
                Kayıt Ol
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}