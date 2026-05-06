"use client";
import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Calendar, Users, Search, ArrowRight, LayoutDashboard, X, MapPin, BookOpen, Hash } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG = "#0B1120";
const CARD = "bg-[#1E293B]/40 backdrop-blur-md border border-[#334155]/50";
const TEAL = "#0D9488";
const TEAL_DIM = "#0F766E";
const EVENT_CATEGORIES = ["Tümü", "Teknoloji", "Eğitim", "Sağlık", "Bilim", "Spor", "Eğlence", "Psikoloji"];

// ── Mock logged-in user ───────────────────────────────────────────────────────
const currentUser = { city: "Aydın", university: "Adnan Menderes Üniversitesi" };

// ── Helpers ───────────────────────────────────────────────────────────────────
const today = new Date(); today.setHours(0, 0, 0, 0);
const d = (s: string) => { const dt = new Date(s); dt.setHours(0, 0, 0, 0); return dt; };

export default function Home() {
  // Preserved states
  const [selectedDate] = useState("Tümü");
  const [selectedClub, setSelectedClub] = useState("Tümü");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  // Registration modal
  const [regOpen, setRegOpen] = useState(false);
  const [reg, setReg] = useState({ name: "", surname: "", university: "", department: "", city: "", age: "", studentNo: "" });

  // Mock communities (preserved structure)
  const communities = [
    { id: 1, name: "IEEE", description: "Elektrik ve elektronik mühendisliği topluluğu", members: 1250, color: "mint" },
    { id: 2, name: "WIE", description: "Kadın mühendisler için ağ ve gelişim platformu", members: 845, color: "peach" },
    { id: 3, name: "RAS", description: "Robot ve otomasyon sistemleri topluluğu", members: 620, color: "blue" },
    { id: 4, name: "ACM", description: "Bilgisayar bilimi ve yazılım geliştirme topluluğu", members: 1050, color: "mint" },
    { id: 5, name: "Design Club", description: "Grafik ve ürün tasarımı topluluğu", members: 430, color: "peach" },
    { id: 6, name: "Data Science", description: "Veri bilimi ve machine learning araştırma grubu", members: 520, color: "blue" },
  ];

  // Mock events — enriched with real dates, city, university, category
  const MOCK_EVENTS = [
    { id: 1, name: "AI Workshop: Başlangıçtan İleri Seviyeye", club: "Data Science Club", date: "2026-06-15", category: "Teknoloji", city: "Aydın", university: "Adnan Menderes Üniversitesi" },
    { id: 2, name: "Web Development Bootcamp", club: "ACM", date: "2026-07-01", category: "Teknoloji", city: "Aydın", university: "Adnan Menderes Üniversitesi" },
    { id: 3, name: "Robotik Yarışması Ön Eleme", club: "RAS", date: "2026-08-10", category: "Bilim", city: "Aydın", university: "Adnan Menderes Üniversitesi" },
    { id: 4, name: "Design Thinking Workshop", club: "Design Club", date: "2025-03-01", category: "Eğitim", city: "Van", university: "Van Yüzüncü Yıl Üniversitesi" },
    { id: 5, name: "IEEE Talks: Geleceğin Teknolojileri", club: "IEEE", date: "2026-09-20", category: "Teknoloji", city: "İzmir", university: "Ege Üniversitesi" },
    { id: 6, name: "WIE Networking Event", club: "WIE", date: "2025-01-15", category: "Eğitim", city: "Ankara", university: "ODTÜ" },
    { id: 7, name: "Psikoloji ve Teknoloji Sempozyumu", club: "IEEE", date: "2026-10-05", category: "Psikoloji", city: "Aydın", university: "Adnan Menderes Üniversitesi" },
    { id: 8, name: "Sağlıklı Kampüs Koşusu", club: "RAS", date: "2026-06-25", category: "Spor", city: "Aydın", university: "Adnan Menderes Üniversitesi" },
  ];

  // Ana etkinlik state'imiz (Başlangıçta MOCK_EVENTS ile dolu)
  const [allEvents, setAllEvents] = useState<any[]>(MOCK_EVENTS);

  // Firebase'den gerçek verileri çekip melez yapıyı kuruyoruz
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const firebaseEvents = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.eventName || "İsimsiz Etkinlik",
            club: data.committee || "Genel Topluluk",
            date: data.date || "2026-05-15",
            category: data.category || "Teknoloji",
            city: data.city || "Aydın",
            university: data.university || "Adnan Menderes Üniversitesi"
          };
        });

        // HİBRİT GÜÇ: Firebase'den gelenleri EN ÜSTE, eskileri ALTINA ekliyoruz!
        setAllEvents([...firebaseEvents, ...MOCK_EVENTS]);
      } catch (error) {
        console.error("Firebase'den etkinlikler çekilemedi:", error);
      }
    };
    fetchEvents();
  }, []); // Bağımlılık dizisi boş olduğu için sayfa yüklenince 1 kez çalışır.

  // Time-based: only upcoming events visible on landing
  const upcomingEvents = useMemo(() => allEvents.filter(e => d(e.date) >= today), [allEvents]);

  // Location-based: split into recommended vs others
  const recommended = useMemo(() => upcomingEvents.filter(
    e => e.city === currentUser.city || e.university === currentUser.university
  ), [upcomingEvents]);

  const otherEvents = useMemo(() => upcomingEvents.filter(
    e => e.city !== currentUser.city && e.university !== currentUser.university
  ), [upcomingEvents]);

  // Apply search + filters to a list
  const applyFilters = (list: typeof allEvents) => list.filter(e => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.club.toLowerCase().includes(q);
    const matchCat = selectedCategory === "Tümü" || e.category === selectedCategory;
    const matchClub = selectedClub === "Tümü" || e.club === selectedClub;
    return matchSearch && matchCat && matchClub;
  });

  const filteredRec = applyFilters(recommended);
  const filteredOther = applyFilters(otherEvents);

  const accentFor = (color: string) =>
    color === "mint" ? "#6ee7c0" : color === "peach" ? "#f5b89a" : "#93c5fd";

  const allClubs = ["Tümü", ...Array.from(new Set(allEvents.map(e => e.club)))];

  const inputCls = "w-full bg-[#0f172a]/60 border border-[#334155]/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-[#0D9488]/60 transition";

  return (
    <div className="min-h-screen text-slate-100" style={{ background: `radial-gradient(ellipse at top, #111827 0%, ${BG} 60%)` }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[#334155]/30 bg-[#0B1120]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${TEAL_DIM}20`, borderColor: `${TEAL_DIM}50` }}>
              <img src="/logo.png" alt="CampOS" className="h-7 w-7 object-cover rounded-md" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">CampOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-[#1E293B]/40 border border-[#334155]/50 hover:bg-[#1E293B]/70 transition-all">
                <LayoutDashboard size={16} style={{ color: TEAL }} /> Admin Paneli
              </button>
            </Link>
            <button onClick={() => setRegOpen(true)} className="px-6 py-2 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95" style={{ background: TEAL_DIM, color: "#f0fdfa" }}>
              Kayıt Ol
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero + Search ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-bold leading-tight text-slate-100">
            Kampüsün<br />
            <span className="bg-gradient-to-r from-slate-100 to-slate-500 bg-clip-text text-transparent">Dijital İşletim Sistemi</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Tüm üniversite topluluklarını tek platformda keşfedin, etkinliklere kayıt olun.
          </p>

          {/* Search + Filters */}
          <div className="mt-8 p-2 rounded-3xl max-w-4xl mx-auto flex flex-col gap-3"
            style={{ background: "rgba(30,41,59,0.3)", border: "1px solid rgba(51,65,85,0.4)" }}>
            {/* Search row */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all"
                style={{ background: "rgba(11,17,32,0.5)", borderColor: "rgba(51,65,85,0.3)" }}>
                <Search size={18} className="text-slate-500 shrink-0" />
                <input type="text" placeholder="Topluluk veya etkinlik ara..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm placeholder-slate-600 text-slate-200" />
              </div>
              <button className="px-8 py-3 rounded-2xl text-sm font-bold transition-all hover:brightness-110"
                style={{ background: TEAL_DIM, color: "#f0fdfa" }}>ARA</button>
            </div>
            {/* Filter dropdowns row */}
            <div className="flex flex-wrap gap-2 px-1">
              {/* Date filter (display only, preserved) */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 border border-[#334155]/40 bg-[#1E293B]/40 cursor-default">
                <Calendar size={15} /> Tarih: {selectedDate} <ChevronDown size={14} />
              </div>
              {/* Category filter */}
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 border border-[#334155]/40 bg-[#1E293B]/40 outline-none hover:bg-[#1E293B]/70 transition-all cursor-pointer appearance-none">
                {EVENT_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1E293B]">{c === "Tümü" ? `Kategori: ${c}` : c}</option>)}
              </select>
              {/* Community filter */}
              <select value={selectedClub} onChange={e => setSelectedClub(e.target.value)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 border border-[#334155]/40 bg-[#1E293B]/40 outline-none hover:bg-[#1E293B]/70 transition-all cursor-pointer appearance-none">
                {allClubs.map(c => <option key={c} value={c} className="bg-[#1E293B]">{c === "Tümü" ? `Topluluk: ${c}` : c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommended Section ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <MapPin size={18} style={{ color: TEAL }} />
          <h3 className="text-xl font-bold text-slate-100">Sana Özel Önerilenler</h3>
          <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: `${TEAL_DIM}20`, color: TEAL, border: `1px solid ${TEAL_DIM}30` }}>
            {currentUser.city} · {currentUser.university}
          </span>
          <div className="flex-1 h-px bg-[#334155]/30" />
        </div>
        {filteredRec.length === 0
          ? <p className="text-slate-600 text-sm py-6">Filtreye uyan yaklaşan öneri bulunamadı.</p>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRec.map(event => <EventCard key={event.id} event={event} teal={TEAL} tealDim={TEAL_DIM} card={CARD} bg={BG} />)}
          </div>
        }
      </section>

      {/* ── Communities ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-bold text-slate-100">Topluluklarımız</h3>
            <div className="h-0.5 w-12 mt-2 rounded-full" style={{ background: TEAL }} />
          </div>
          <button className="text-sm font-bold flex items-center gap-1 transition-all hover:gap-2" style={{ color: TEAL }}>
            Tümünü Gör <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map(c => {
            const accent = accentFor(c.color);
            return (
              <div key={c.id} className={`${CARD} rounded-2xl p-6 cursor-pointer group transition-all duration-300 hover:bg-[#1E293B]/60`} style={{ borderLeft: `3px solid ${accent}40` }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                    <Users size={20} style={{ color: accent }} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aktif Üye</p>
                    <p className="text-base font-bold text-slate-200">{c.members.toLocaleString()}</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-100 mb-2">{c.name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{c.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── All Upcoming Events ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-20">
        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-2xl font-bold text-slate-100 whitespace-nowrap">Yaklaşan Etkinlikler</h3>
          <div className="flex-1 h-px bg-[#334155]/30" />
        </div>
        {filteredOther.length === 0 && filteredRec.length === 0
          ? <p className="text-slate-600 text-sm py-6">Filtreye uyan etkinlik bulunamadı.</p>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOther.map(event => <EventCard key={event.id} event={event} teal={TEAL} tealDim={TEAL_DIM} card={CARD} bg={BG} />)}
          </div>
        }
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#334155]/30 mt-10 py-16" style={{ background: "rgba(11,17,32,0.6)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: `${TEAL_DIM}20`, border: `1px solid ${TEAL_DIM}40`, color: TEAL }}>C</div>
                <h4 className="font-bold text-lg text-slate-100">CampOS</h4>
              </div>
              <p className="text-sm text-slate-500">Kampüsün dijital işletim sistemi.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-300 mb-4 text-sm uppercase tracking-widest">Hızlı Linkler</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {["Topluluklarımız", "Etkinlikler", "Hakkımızda"].map(l => <li key={l}><a href="#" className="hover:text-slate-200 transition-colors">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-300 mb-4 text-sm uppercase tracking-widest">Destek</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {["İletişim", "SSS", "Geri Bildirim"].map(l => <li key={l}><a href="#" className="hover:text-slate-200 transition-colors">{l}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#334155]/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">&copy; 2026 CampOS. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* ── Registration Modal ─────────────────────────────────────────────── */}
      {regOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-lg rounded-3xl border border-[#334155]/60 overflow-hidden" style={{ background: "linear-gradient(145deg, #0d1830, #0a1525)" }}>
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-[#334155]/40 flex items-center justify-between" style={{ background: `${TEAL_DIM}10` }}>
              <div>
                <h2 className="text-xl font-bold text-white">Üye Kaydı</h2>
                <p className="text-xs text-slate-500 mt-0.5">Bilgilerini doldur, topluluğa katıl.</p>
              </div>
              <button onClick={() => setRegOpen(false)} className="p-2 rounded-xl hover:bg-white/10 transition text-slate-400"><X size={20} /></button>
            </div>
            {/* Modal Form */}
            <form className="p-8 space-y-4 overflow-y-auto max-h-[70vh]" onSubmit={e => { e.preventDefault(); setRegOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ad</label>
                  <input type="text" placeholder="Adınız" value={reg.name} onChange={e => setReg(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Soyad</label>
                  <input type="text" placeholder="Soyadınız" value={reg.surname} onChange={e => setReg(p => ({ ...p, surname: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><BookOpen size={11} /> Okul</label>
                <input type="text" placeholder="Üniversiteniz" value={reg.university} onChange={e => setReg(p => ({ ...p, university: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Bölüm</label>
                <input type="text" placeholder="Bölümünüz" value={reg.department} onChange={e => setReg(p => ({ ...p, department: e.target.value }))} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={11} /> Şehir</label>
                  <input type="text" placeholder="Şehriniz" value={reg.city} onChange={e => setReg(p => ({ ...p, city: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Yaş</label>
                  <input type="number" min={17} max={35} placeholder="Yaşınız" value={reg.age} onChange={e => setReg(p => ({ ...p, age: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Hash size={11} /> Okul No</label>
                <input type="text" placeholder="Öğrenci numaranız" value={reg.studentNo} onChange={e => setReg(p => ({ ...p, studentNo: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setRegOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-400 border border-[#334155]/50 hover:bg-white/5 transition">İptal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110" style={{ background: TEAL_DIM, color: "#f0fdfa" }}>Kayıt Ol</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Event Card Sub-component ───────────────────────────────────────────────────
function EventCard({ event, teal, tealDim, card, bg }: {
  event: { id: string | number; name: string; club: string; date: string; category: string; city: string };
  teal: string; tealDim: string; card: string; bg: string;
}) {
  return (
    <div className={`${card} rounded-2xl p-5 flex gap-5 group transition-all duration-300 hover:bg-[#1E293B]/60`}>
      <div className="w-20 h-20 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-all"
        style={{ background: bg, borderColor: "rgba(51,65,85,0.5)" }}>
        <Calendar size={22} style={{ color: teal }} className="mb-1" />
        <span className="text-[9px] font-black text-slate-500 uppercase text-center leading-tight px-1">
          {new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: `${tealDim}15`, color: teal, border: `1px solid ${tealDim}30` }}>
            {event.category}
          </span>
          <span className="text-xs text-slate-500">{event.club}</span>
          <span className="text-xs text-slate-600 flex items-center gap-1"><MapPin size={10} />{event.city}</span>
        </div>
        <h4 className="text-base font-bold text-slate-100 leading-snug">{event.name}</h4>
        <button className="self-start text-xs font-bold transition-colors flex items-center gap-1" style={{ color: teal }}>
          Kayıt Ol <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}