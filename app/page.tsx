"use client";

import { useState } from "react";
import { ChevronDown, Calendar, Users, Search, Sparkles } from "lucide-react";

export default function Home() {
  const [selectedDate] = useState("Tümü");
  const [selectedClub] = useState("Tümü");
  const [selectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const communities = [
    {
      id: 1,
      name: "IEEE",
      description: "Elektrik ve elektronik mühendisliği topluluğu",
      members: 1250,
      color: "mint",
    },
    {
      id: 2,
      name: "WIE",
      description: "Kadın mühendisler için ağ ve gelişim platformu",
      members: 845,
      color: "peach",
    },
    {
      id: 3,
      name: "RAS",
      description: "Robot ve otomasyon sistemleri topluluğu",
      members: 620,
      color: "blue",
    },
    {
      id: 4,
      name: "ACM",
      description: "Bilgisayar bilimi ve yazılım geliştirme topluluğu",
      members: 1050,
      color: "mint",
    },
    {
      id: 5,
      name: "Design Club",
      description: "Grafik ve ürün tasarımı topluluğu",
      members: 430,
      color: "peach",
    },
    {
      id: 6,
      name: "Data Science",
      description: "Veri bilimi ve machine learning araştırma grubu",
      members: 520,
      color: "blue",
    },
  ];

  const events = [
    {
      id: 1,
      name: "AI Workshop: Başlangıçtan İleri Seviyeye",
      club: "Data Science Club",
      date: "2026-12-15",
      category: "Workshop",
      color: "mint",
    },
    {
      id: 2,
      name: "Web Development Bootcamp",
      club: "ACM",
      date: "2026-12-18",
      category: "Bootcamp",
      color: "blue",
    },
    {
      id: 3,
      name: "Robotik Yarışması Ön Eleme",
      club: "RAS",
      date: "2026-12-20",
      category: "Yarışma",
      color: "peach",
    },
    {
      id: 4,
      name: "Design Thinking Workshop",
      club: "Design Club",
      date: "2026-12-22",
      category: "Workshop",
      color: "peach",
    },
    {
      id: 5,
      name: "IEEE Talks: Geleceğin Teknolojileri",
      club: "IEEE",
      date: "2026-12-25",
      category: "Konferans",
      color: "mint",
    },
    {
      id: 6,
      name: "WIE Networking Event",
      club: "WIE",
      date: "2026-12-28",
      category: "Networking",
      color: "blue",
    },
  ];

  /* ── Pastel accent config ── */
  const accentText: Record<string, string> = {
    mint:  "text-[#6ee7c0]",
    peach: "text-[#f5b89a]",
    blue:  "text-[#93c5fd]",
  };
  const accentBorder: Record<string, string> = {
    mint:  "border-[#6ee7c0]/30",
    peach: "border-[#f5b89a]/30",
    blue:  "border-[#93c5fd]/30",
  };
  const accentGlow: Record<string, string> = {
    mint:  "shadow-[0_0_24px_0_rgba(110,231,192,0.12)]",
    peach: "shadow-[0_0_24px_0_rgba(245,184,154,0.12)]",
    blue:  "shadow-[0_0_24px_0_rgba(147,197,253,0.12)]",
  };
  const accentPill: Record<string, string> = {
    mint:  "bg-[#6ee7c0]/15 text-[#6ee7c0] border border-[#6ee7c0]/30",
    peach: "bg-[#f5b89a]/15 text-[#f5b89a] border border-[#f5b89a]/30",
    blue:  "bg-[#93c5fd]/15 text-[#93c5fd] border border-[#93c5fd]/30",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #060b18 0%, #0c1428 50%, #060b18 100%)" }}>

      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #3d9b7e 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #4a7ba7 0%, transparent 70%)" }} />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #a86f47 0%, transparent 70%)" }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 border-b border-white/8 backdrop-blur-xl" style={{ background: "rgba(6,11,24,0.75)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CampOS Logo" className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6ee7c0] to-[#93c5fd] bg-clip-text text-transparent">
              CampOS
            </h1>
          </div>
          <button className="px-5 py-2 text-sm font-semibold rounded-full border border-[#6ee7c0]/40 text-[#6ee7c0] backdrop-blur-sm transition-all duration-300 hover:bg-[#6ee7c0]/10 hover:shadow-[0_0_20px_rgba(110,231,192,0.2)]">
            Topluluk Girişi
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-gray-400">
            <Sparkles size={14} className="text-[#6ee7c0]" />
            Üniversite topluluklarının dijital merkezi
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Kampüsün
            <br />
            <span className="bg-gradient-to-r from-[#6ee7c0] via-[#f5b89a] to-[#93c5fd] bg-clip-text text-transparent">
              Dijital İşletim Sistemi
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Tüm üniversite topluluklarını bir platform&apos;da keşfedin, etkinliklere kayıt olun ve
            benzersiz bir akademik deneyim yaşayın.
          </p>

          {/* Search + Filters */}
          <div className="mt-10">
            <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border border-white/10 backdrop-blur-md" style={{ background: "rgba(255,255,255,0.04)" }}>
              {/* Search */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Topluluk veya etkinlik ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-600 text-sm"
                />
              </div>

              {/* Filter pills */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-[#93c5fd]/25 bg-[#93c5fd]/8 text-[#93c5fd] hover:bg-[#93c5fd]/15 transition-all">
                  <Calendar size={16} />
                  Tarih: {selectedDate}
                  <ChevronDown size={15} />
                </button>
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-[#f5b89a]/25 bg-[#f5b89a]/8 text-[#f5b89a] hover:bg-[#f5b89a]/15 transition-all">
                  <Users size={16} />
                  Topluluk: {selectedClub}
                  <ChevronDown size={15} />
                </button>
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-[#6ee7c0]/25 bg-[#6ee7c0]/8 text-[#6ee7c0] hover:bg-[#6ee7c0]/15 transition-all">
                  Kategori: {selectedCategory}
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Communities ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-white">Topluluklarımız</h3>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Binlerce öğrencinin bir araya geldiği, bilgi paylaştığı ve profesyonel ağ kurduğu
          toplulukları keşfedin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((c) => (
            <div
              key={c.id}
              className={`group relative rounded-2xl border p-6 backdrop-blur-md cursor-pointer transition-all duration-300 hover:-translate-y-1 ${accentBorder[c.color]} ${accentGlow[c.color]}`}
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className={`text-2xl font-bold ${accentText[c.color]}`}>{c.name}</h4>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 bg-white/5">
                  <Users size={18} className="text-gray-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-5 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/8">
                <span className="text-sm font-semibold text-gray-400">{c.members.toLocaleString()} üye</span>
                <button className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all hover:brightness-125 ${accentPill[c.color]}`}>
                  Detaylar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Events ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-white">Yaklaşan Etkinlikler</h3>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Kampüste gerçekleşecek olan en son etkinlikleri takip edin ve hemen katılımcı olmak için
          kaydolun.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${accentBorder[ev.color]} ${accentGlow[ev.color]}`}
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-white mb-1">{ev.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Users size={14} />
                    {ev.club}
                  </p>
                </div>
                <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${accentPill[ev.color]}`}>
                  {ev.category}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-5">
                <Calendar size={15} className={accentText[ev.color]} />
                <span className="font-medium">{formatDate(ev.date)}</span>
              </div>

              <button className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 hover:brightness-125 ${accentPill[ev.color]}`}>
                Kayıt Ol
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="rounded-3xl border border-white/10 p-12 text-center backdrop-blur-md"
          style={{ background: "linear-gradient(135deg, rgba(110,231,192,0.08) 0%, rgba(147,197,253,0.08) 50%, rgba(245,184,154,0.08) 100%)" }}
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Topluluğunuzu Kurun
          </h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Kendi topluluğunuzu oluşturmak ve harika insanlarla bir araya gelmek istiyorsanız,
            CampOS&apos;ta topluluğunuzu açın.
          </p>
          <button className="px-8 py-3 rounded-full font-bold text-[#060b18] bg-gradient-to-r from-[#6ee7c0] to-[#93c5fd] hover:shadow-[0_0_30px_rgba(110,231,192,0.35)] transition-all duration-300 hover:scale-105">
            Topluluk Kurulumunu Başlat
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/8 mt-12" style={{ background: "rgba(6,11,24,0.8)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#6ee7c0] border border-[#6ee7c0]/30 bg-[#6ee7c0]/10">
                  C
                </div>
                <h4 className="font-bold text-white">CampOS</h4>
              </div>
              <p className="text-sm text-gray-600">Kampüsün dijital işletim sistemi.</p>
            </div>
            {[
              { title: "Hızlı Linkler", links: ["Topluluklarımız", "Etkinlikler", "Hakkımızda"] },
              { title: "Destek",        links: ["İletişim", "SSS", "Geri Bildirim"] },
              { title: "Yasal",         links: ["Gizlilik", "Kullanım Şartları", "Çerez Politikası"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-gray-300 mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/8 pt-8 text-center text-sm text-gray-700">
            <p>&copy; 2026 CampOS. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
