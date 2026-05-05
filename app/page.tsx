"use client";

import { useState } from "react";
import { ChevronDown, Calendar, Users, Search } from "lucide-react";

export default function Home() {
  const [selectedDate] = useState("Tümü");
  const [selectedClub] = useState("Tümü");
  const [selectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for communities
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

  // Mock data for events
  const events = [
    {
      id: 1,
      name: "AI Workshop: Başlangıçtan İleri Seviyeye",
      club: "Data Science Club",
      date: "2026",
      category: "Workshop",
    },
    {
      id: 2,
      name: "Web Development Bootcamp",
      club: "ACM",
      date: "2026",
      category: "Bootcamp",
    },
    {
      id: 3,
      name: "Robotik Yarışması Ön Eleme",
      club: "RAS",
      date: "2026",
      category: "Yarışma",
    },
    {
      id: 4,
      name: "Design Thinking Workshop",
      club: "Design Club",
      date: "2026",
      category: "Workshop",
    },
    {
      id: 5,
      name: "IEEE Talks: Geleceğin Teknolojileri",
      club: "IEEE",
      date: "2026",
      category: "Konferans",
    },
    {
      id: 6,
      name: "WIE Networking Event",
      club: "WIE",
      date: "2026",
      category: "Networking",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "mint":
        return "bg-pastel-mint border-l-4 border-pastel-mint-dark";
      case "peach":
        return "bg-pastel-peach border-l-4 border-pastel-peach-dark";
      case "blue":
        return "bg-pastel-blue border-l-4 border-pastel-blue-dark";
      default:
        return "bg-pastel-mint";
    }
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
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f3] to-[#f5f3f0] text-[#2d2d2d]">
      {/* Header/Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="CampOS Logo"
              className="h-12 w-12 rounded-lg object-cover"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3d9b7e] to-[#4a7ba7] bg-clip-text text-transparent">
              CampOS
            </h1>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-[#d4f1e8] to-[#b8e6d8] text-[#3d9b7e] font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            Topluluk Girişi
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Kampüsün
            <br />
            <span className="bg-gradient-to-r from-[#3d9b7e] via-[#a86f47] to-[#4a7ba7] bg-clip-text text-transparent">
              Dijital İşletim Sistemi
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tüm üniversite topluluklarını bir platform&apos;da keşfedin, etkinliklere kayıt olun ve
            benzersiz bir akademik deneyim yaşayın.
          </p>

          {/* Search Bar with Filters */}
          <div className="mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-lg px-4 py-3">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Topluluk veya etkinlik ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <button
                    onClick={() => { }}
                    className="w-full sm:w-auto flex items-center justify-between gap-2 bg-pastel-blue text-pastel-blue-dark px-4 py-3 rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    <Calendar size={18} />
                    Tarih: {selectedDate}
                    <ChevronDown size={18} />
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => { }}
                    className="w-full sm:w-auto flex items-center justify-between gap-2 bg-pastel-peach text-pastel-peach-dark px-4 py-3 rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    <Users size={18} />
                    Topluluk: {selectedClub}
                    <ChevronDown size={18} />
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => { }}
                    className="w-full sm:w-auto flex items-center justify-between gap-2 bg-pastel-mint text-pastel-mint-dark px-4 py-3 rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    Kategori: {selectedCategory}
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Topluluklarımız</h3>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Binlerce öğrencinin bir araya geldiği, bilgi paylaştığı ve profesyonel ağ kurduğu
          toplulukları keşfedin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div
              key={community.id}
              className={`${getColorClasses(
                community.color
              )} p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-2xl font-bold text-gray-800">{community.name}</h4>
                <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                  <Users size={20} className="text-gray-600" />
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-2">{community.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/40">
                <span className="text-sm font-semibold text-gray-700">
                  {community.members} üye
                </span>
                <button className="text-sm font-semibold px-4 py-1 bg-white/40 hover:bg-white/60 rounded-full transition-colors">
                  Detaylar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Yaklaşan Etkinlikler</h3>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Kampüste gerçekleşecek olan en son etkinlikleri takip edin ve hemen katılımcı olmak için
          kaydolun.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                    <Users size={16} />
                    {event.club}
                  </p>
                </div>
                <span className="inline-block px-3 py-1 bg-pastel-mint text-pastel-mint-dark text-xs font-semibold rounded-full whitespace-nowrap">
                  {event.category}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <Calendar size={18} className="text-pastel-peach-dark" />
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-[#d4f1e8] to-[#b8e6d8] text-pastel-mint-dark font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                Kayıt Ol
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#d4f1e8] via-[#d4e8f7] to-[#f5d7c8] rounded-2xl p-12 text-center shadow-lg">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Topluluğunuzu Kurun
          </h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Kendi toplumluğunuzu oluşturmak ve harika insanlarla bir araya gelmek istiyorsanız,
            CampOS&apos;ta topluluğunuzu açın.
          </p>
          <button className="px-8 py-3 bg-white text-gray-800 font-bold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            Topluluk Kurulumunu Başlat
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4f1e8] to-[#b8e6d8] flex items-center justify-center font-bold text-[#3d9b7e]">
                  C
                </div>
                <h4 className="font-bold text-lg">CampOS</h4>
              </div>
              <p className="text-sm text-gray-600">
                Kampüsün dijital işletim sistemi.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-800 transition">Topluluklarımız</a></li>
                <li><a href="#" className="hover:text-gray-800 transition">Etkinlikler</a></li>
                <li><a href="#" className="hover:text-gray-800 transition">Hakkımızda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Destek</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-800 transition">İletişim</a></li>
                <li><a href="#" className="hover:text-gray-800 transition">SSS</a></li>
                <li><a href="#" className="hover:text-gray-800 transition">Geri Bildirim</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-800 transition">Gizlilik</a></li>
                <li><a href="#" className="hover:text-gray-800 transition">Kullanım Şartları</a></li>
                <li><a href="#" className="hover:text-gray-800 transition">Çerez Politikası</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 CampOS. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
