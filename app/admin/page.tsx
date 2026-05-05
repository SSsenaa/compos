"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import {
  LayoutDashboard, Calendar, Users, UserCircle, Sparkles, Plus, X,
  Loader, AlertCircle, Menu, TrendingUp, Clock, FileText, Edit2,
  Trash2, Eye, BookOpen, Wallet, TrendingDown, ArrowUpRight,
  ArrowDownRight, CheckCircle2, BadgeCheck,
} from "lucide-react";

type Tab = "dashboard" | "events" | "team" | "finance" | "notes" | "profile" | "ai";

interface FirestoreEvent {
  id: string; eventName: string; date: string;
  committee: string; expectedAttendees: number; status?: string;
}
interface FormState { eventName: string; date: string; committee: string; attendees: string; }
interface Transaction {
  id: string; date: string; title: string;
  category: "Income" | "Sponsorship" | "Expense";
  amount: number; addedBy: string;
}

const COMMITTEES = ["Computer Society","WIE","RAS","ACM","Data Science Club","Design Club","IEEE","Core Team"];
const glass = "bg-white/5 border border-white/10 backdrop-blur-md";
const glassHover = `${glass} hover:bg-white/8 transition-all duration-300`;
const MINT = "#6ee7c0"; const PEACH = "#f5b89a"; const BLUE = "#93c5fd";

const YEARS = ["2025–2026 (Current)","2024–2025","2023–2024"];
const TEAM_DATA: Record<string, { name:string; role:string; committee:string; initial:string; color:string; }[]> = {
  "2025–2026 (Current)": [
    { name:"Sena Yakıcılar",  role:"Community Manager",  committee:"Core Team",  initial:"S", color:MINT  },
    { name:"Ahmet Yılmaz",    role:"General Secretary",  committee:"IEEE",        initial:"A", color:BLUE  },
    { name:"Fatima Kaya",     role:"Event Coordinator",  committee:"WIE",         initial:"F", color:PEACH },
    { name:"Burak Çetin",     role:"Tech Lead",          committee:"ACM",         initial:"B", color:BLUE  },
    { name:"Zeynep Arslan",   role:"Content Creator",    committee:"Design Club", initial:"Z", color:PEACH },
    { name:"Emre Doğan",      role:"Vice Chairman",      committee:"RAS",         initial:"E", color:MINT  },
    { name:"Ceren Öztürk",    role:"Finance Officer",    committee:"Core Team",   initial:"C", color:BLUE  },
    { name:"Mert Kılıç",      role:"PR & Outreach Lead", committee:"IEEE",        initial:"M", color:PEACH },
  ],
  "2024–2025": [
    { name:"Kerem Aydın",     role:"Chairman",           committee:"Core Team",  initial:"K", color:MINT  },
    { name:"Lale Şahin",      role:"General Secretary",  committee:"WIE",         initial:"L", color:PEACH },
    { name:"Ozan Demir",      role:"Tech Lead",          committee:"ACM",         initial:"O", color:BLUE  },
    { name:"Gizem Polat",     role:"Event Coordinator",  committee:"IEEE",        initial:"G", color:MINT  },
    { name:"Tarık Uçar",      role:"Finance Officer",    committee:"Core Team",   initial:"T", color:BLUE  },
    { name:"Melis Korkmaz",   role:"Content Creator",    committee:"Design Club", initial:"M", color:PEACH },
  ],
  "2023–2024": [
    { name:"Baran Koç",       role:"Chairman",           committee:"Core Team",  initial:"B", color:MINT  },
    { name:"Elif Yıldız",     role:"General Secretary",  committee:"WIE",         initial:"E", color:PEACH },
    { name:"Serhan Güneş",    role:"Tech Lead",          committee:"RAS",         initial:"S", color:BLUE  },
    { name:"Naz Arslan",      role:"Event Coordinator",  committee:"IEEE",        initial:"N", color:MINT  },
  ],
};

const SEED_TXS: Transaction[] = [
  { id:"1", date:"2026-03-10", title:"Tech Summit Sponsorship", category:"Sponsorship", amount:5000,  addedBy:"S.Y." },
  { id:"2", date:"2026-03-15", title:"Catering Expense – AI Workshop", category:"Expense", amount:-320, addedBy:"F.K." },
  { id:"3", date:"2026-03-22", title:"IEEE HQ Grant", category:"Income", amount:1500, addedBy:"S.Y." },
  { id:"4", date:"2026-04-01", title:"Venue Rental – Bootcamp", category:"Expense", amount:-450, addedBy:"A.Y." },
  { id:"5", date:"2026-04-12", title:"Corporate Partner – WIE", category:"Sponsorship", amount:2000, addedBy:"S.Y." },
  { id:"6", date:"2026-04-20", title:"Printing & Materials", category:"Expense", amount:-180, addedBy:"Z.A." },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormState>({ eventName:"", date:"", committee:COMMITTEES[0], attendees:"" });
  const [profile, setProfile] = useState({ name:"IEEE Student Branch", vision:"To be the leading student community driving technological innovation.", mission:"Empower students through workshops, competitions, and networking.", about:"Founded in 2018, we connect engineering students with industry professionals." });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState("");
  // Team
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  // Finance
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TXS);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txForm, setTxForm] = useState({ title:"", date:"", category:"Income" as Transaction["category"], amount:"", addedBy:"S.Y." });

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        setEvents(snap.docs.map(d => ({ id:d.id, ...(d.data() as Omit<FirestoreEvent,"id">) })));
      } catch(e){ console.error(e); } finally { setLoadingEvents(false); }
    })();
  }, []);

  const resetForm = () => { setForm({ eventName:"", date:"", committee:COMMITTEES[0], attendees:"" }); setSuccessMsg(""); setErrorMsg(""); };
  const closeModal = () => { setModalOpen(false); resetForm(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventName.trim()||!form.date||!form.attendees){ setErrorMsg("Please fill in all fields."); return; }
    const n = parseInt(form.attendees);
    if (isNaN(n)||n<0){ setErrorMsg("Attendees must be a positive number."); return; }
    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db,"events"),{ eventName:form.eventName.trim(), date:form.date, committee:form.committee, expectedAttendees:n, status:"upcoming", createdAt:Timestamp.now() });
      setEvents(prev=>[{ id:ref.id, eventName:form.eventName.trim(), date:form.date, committee:form.committee, expectedAttendees:n, status:"upcoming" },...prev]);
      setSuccessMsg("✓ Event created!"); setTimeout(closeModal,1400);
    } catch(err){ setErrorMsg(err instanceof Error ? err.message : "Failed."); }
    finally { setSubmitting(false); }
  };

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.title||!txForm.date||!txForm.amount) return;
    const amt = parseFloat(txForm.amount);
    const signed = txForm.category==="Expense" ? -Math.abs(amt) : Math.abs(amt);
    setTransactions(prev=>[{ id:Date.now().toString(), date:txForm.date, title:txForm.title, category:txForm.category, amount:signed, addedBy:txForm.addedBy||"S.Y." },...prev]);
    setTxForm({ title:"", date:"", category:"Income", amount:"", addedBy:"S.Y." });
    setTxModalOpen(false);
  };

  const generateAI = () => {
    setIsGenerating(true); setAiReport("");
    setTimeout(() => {
      const total=events.length, attendees=events.reduce((s,e)=>s+(e.expectedAttendees||0),0);
      const committees=[...new Set(events.map(e=>e.committee))];
      setAiReport(`OFFICIAL COMMUNITY REPORT — Spring Semester 2026\n${"─".repeat(52)}\n\nEXECUTIVE SUMMARY\n\nThis semester, our community successfully hosted ${total} event${total!==1?"s":""}, collectively reaching an estimated ${attendees} students across campus. Our programming spanned ${committees.length} active committee${committees.length!==1?"s":""}, demonstrating the breadth and diversity of our organizational capacity.\n\nACTIVITY BREAKDOWN\n\n${events.slice(0,5).map((e,i)=>`  ${i+1}. ${e.eventName}\n     Committee: ${e.committee} | Expected Attendees: ${e.expectedAttendees}\n     Date: ${e.date}`).join("\n\n")}\n\nFINANCIAL SNAPSHOT\n\nTotal Income & Sponsorships: ₺${transactions.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0).toLocaleString()}\nTotal Expenses: ₺${Math.abs(transactions.filter(t=>t.amount<0).reduce((s,t)=>s+t.amount,0)).toLocaleString()}\nNet Balance: ₺${transactions.reduce((s,t)=>s+t.amount,0).toLocaleString()}\n\nKEY OUTCOMES\n\n• Total reach: ${attendees} student interactions\n• Active committees: ${committees.join(", ")}\n• Completed events: ${events.filter(e=>e.status==="completed").length}\n• Upcoming events: ${events.filter(e=>e.status!=="completed").length}\n\nCONCLUSION\n\nThe community continues to grow in scope and impact. Based on current momentum, we project a 20% increase in event attendance next semester.\n\n— Generated by CampOS AI Report Engine`);
      setIsGenerating(false);
    },3000);
  };

  const balance = transactions.reduce((s,t)=>s+t.amount,0);

  const navItems:{id:Tab;label:string;icon:React.ElementType}[] = [
    { id:"dashboard", label:"Dashboard",      icon:LayoutDashboard },
    { id:"events",    label:"Events",          icon:Calendar        },
    { id:"team",      label:"Team & Alumni",   icon:Users           },
    { id:"finance",   label:"Finance",         icon:Wallet          },
    { id:"notes",     label:"Notes",           icon:BookOpen        },
    { id:"profile",   label:"Profile",         icon:UserCircle      },
    { id:"ai",        label:"AI Reports",      icon:Sparkles        },
  ];

  const stats = [
    { label:"Total Events",   value:events.length,                                              icon:Calendar,    color:MINT  },
    { label:"Total Attendees",value:events.reduce((s,e)=>s+(e.expectedAttendees||0),0),          icon:TrendingUp,  color:BLUE  },
    { label:"Upcoming",       value:events.filter(e=>e.status!=="completed").length,             icon:Clock,       color:PEACH },
    { label:"Net Balance",    value:`₺${balance.toLocaleString()}`,                              icon:Wallet,      color:balance>=0?MINT:PEACH },
  ];

  const catColor = (cat:string) => cat==="Income"?{bg:"rgba(110,231,192,0.12)",color:MINT,border:`1px solid ${MINT}30`}:cat==="Sponsorship"?{bg:"rgba(147,197,253,0.12)",color:BLUE,border:`1px solid ${BLUE}30`}:{bg:"rgba(245,184,154,0.12)",color:PEACH,border:`1px solid ${PEACH}30`};

  return (
    <div className="min-h-screen text-white" style={{background:"linear-gradient(135deg,#060b18 0%,#0c1428 50%,#060b18 100%)"}}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full opacity-20" style={{background:`radial-gradient(circle,${MINT},transparent 70%)`}}/>
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full opacity-15" style={{background:`radial-gradient(circle,${BLUE},transparent 70%)`}}/>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl" style={{background:"rgba(6,11,24,0.8)"}}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition">
              {sidebarOpen?<X size={22}/>:<Menu size={22}/>}
            </button>
            <img src="/logo.png" alt="CampOS" className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/10"/>
            <span className="text-xl font-bold bg-gradient-to-r from-[#6ee7c0] to-[#93c5fd] bg-clip-text text-transparent">CampOS Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition"><AlertCircle size={18} className="text-gray-400"/><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#f5b89a]"/></button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border border-[#6ee7c0]/30" style={{background:"rgba(110,231,192,0.15)",color:MINT}}>S</div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className={`${sidebarOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 fixed lg:static w-60 h-full z-20 border-r border-white/10 backdrop-blur-xl transition-transform duration-300 flex flex-col`} style={{background:"rgba(6,11,24,0.85)"}}>
          <nav className="p-5 space-y-1 flex-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">Menu</p>
            {navItems.map(({id,label,icon:Icon})=>(
              <button key={id} onClick={()=>{setTab(id);setSidebarOpen(false);}}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${tab===id?"text-white border border-white/10":"text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                style={tab===id?{background:"rgba(110,231,192,0.1)",color:MINT}:{}}>
                <Icon size={17}/>{label}
              </button>
            ))}
          </nav>
          <div className="p-5 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:"rgba(147,197,253,0.08)",border:"1px solid rgba(147,197,253,0.15)"}}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{background:"rgba(110,231,192,0.15)",color:MINT}}>S</div>
              <div className="min-w-0"><p className="text-sm font-semibold text-white truncate">Sena Yakıcılar</p><p className="text-xs text-gray-500">Community Manager</p></div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">{navItems.find(n=>n.id===tab)?.label}</h2>
            <p className="text-gray-500 text-sm mt-1">CampOS · Community Management System</p>
          </div>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard"&&(
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s,i)=>(
                  <div key={i} className={`${glassHover} rounded-2xl p-5 hover:-translate-y-0.5`}>
                    <div className="flex items-start justify-between mb-3">
                      <div><p className="text-xs text-gray-500 mb-1">{s.label}</p><p className="text-3xl font-bold text-white">{loadingEvents?"—":s.value}</p></div>
                      <div className="p-2 rounded-lg" style={{background:`${s.color}18`,border:`1px solid ${s.color}30`}}><s.icon size={18} style={{color:s.color}}/></div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setModalOpen(true)} className="flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105" style={{background:"rgba(110,231,192,0.15)",border:`1px solid ${MINT}40`,color:MINT}}>
                <Plus size={18}/>Add New Event
              </button>
              <div className={`${glass} rounded-2xl overflow-hidden`}>
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Recent Events</h3>
                  <button onClick={()=>setTab("events")} className="text-xs text-gray-500 hover:text-white transition">View all →</button>
                </div>
                {loadingEvents?<div className="flex items-center justify-center py-12 gap-3 text-gray-500"><Loader size={18} className="animate-spin"/>Loading from Firestore…</div>
                :events.length===0?<p className="text-center text-gray-600 py-12 text-sm">No events yet.</p>
                :<div className="divide-y divide-white/5">{events.slice(0,5).map(ev=>(
                  <div key={ev.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/4 transition">
                    <div><p className="text-sm font-medium text-white">{ev.eventName}</p><p className="text-xs text-gray-500 mt-0.5">{ev.committee} · {ev.date}</p></div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background:`${BLUE}18`,color:BLUE,border:`1px solid ${BLUE}30`}}>{ev.expectedAttendees} pax</span>
                  </div>
                ))}</div>}
              </div>
            </div>
          )}

          {/* ── EVENTS ── */}
          {tab==="events"&&(
            <div className="space-y-6">
              <button onClick={()=>setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105" style={{background:"rgba(110,231,192,0.15)",border:`1px solid ${MINT}40`,color:MINT}}>
                <Plus size={16}/>Add New Event
              </button>
              <div className={`${glass} rounded-2xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                      {["Date","Event Name","Committee","Attendees","Status","Actions"].map(h=>(
                        <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingEvents?<tr><td colSpan={6} className="text-center py-12 text-gray-500"><Loader size={18} className="animate-spin inline mr-2"/>Loading…</td></tr>
                      :events.length===0?<tr><td colSpan={6} className="text-center py-12 text-gray-600 text-sm">No events found.</td></tr>
                      :events.map(ev=>(
                        <tr key={ev.id} className="hover:bg-white/4 transition">
                          <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{ev.date}</td>
                          <td className="px-6 py-4 text-sm text-white font-medium">{ev.eventName}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{ev.committee}</td>
                          <td className="px-6 py-4"><span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background:`${BLUE}18`,color:BLUE,border:`1px solid ${BLUE}30`}}>{ev.expectedAttendees}</span></td>
                          <td className="px-6 py-4"><span className="text-xs font-semibold px-3 py-1 rounded-full" style={ev.status==="completed"?{background:"rgba(110,231,192,0.15)",color:MINT,border:`1px solid ${MINT}30`}:{background:"rgba(147,197,253,0.12)",color:BLUE,border:`1px solid ${BLUE}25`}}>{ev.status==="completed"?"✓ Completed":"Upcoming"}</span></td>
                          <td className="px-6 py-4"><div className="flex gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-blue-400"><Eye size={15}/></button>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-amber-400"><Edit2 size={15}/></button>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-red-400"><Trash2 size={15}/></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TEAM & ALUMNI ── */}
          {tab==="team"&&(
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {YEARS.map(y=>(
                  <button key={y} onClick={()=>setSelectedYear(y)} className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                    style={selectedYear===y?{background:"rgba(110,231,192,0.18)",color:MINT,border:`1px solid ${MINT}40`,boxShadow:`0 0 14px ${MINT}25`}:{background:"rgba(255,255,255,0.05)",color:"#6b7280",border:"1px solid rgba(255,255,255,0.1)"}}>
                    {y}
                  </button>
                ))}
              </div>
              {selectedYear!==YEARS[0]&&(
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{background:"rgba(147,197,253,0.08)",border:`1px solid ${BLUE}20`}}>
                  <BadgeCheck size={18} style={{color:BLUE}}/>
                  <p className="text-sm text-gray-400">Viewing <span className="text-white font-semibold">{selectedYear}</span> alumni — these officers have graduated to mentor status.</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(TEAM_DATA[selectedYear]||[]).map((m,i)=>(
                  <div key={i} className={`${glassHover} rounded-2xl p-6 text-center hover:-translate-y-1 relative overflow-hidden`}>
                    {selectedYear!==YEARS[0]&&(
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:`${BLUE}18`,color:BLUE,border:`1px solid ${BLUE}30`}}>
                        <BadgeCheck size={11}/>Alumni
                      </div>
                    )}
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold" style={{background:`${m.color}18`,color:m.color,border:`2px solid ${m.color}35`,boxShadow:`0 0 20px ${m.color}20`}}>{m.initial}</div>
                    <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    <p className="text-xs mt-1" style={{color:m.color}}>{m.role}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{m.committee}</p>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 rounded-lg text-xs font-semibold transition hover:brightness-125" style={{background:`${m.color}15`,color:m.color,border:`1px solid ${m.color}30`}}>{selectedYear===YEARS[0]?"Edit":"View"}</button>
                      {selectedYear===YEARS[0]&&<button className="flex-1 py-2 rounded-lg text-xs font-semibold text-gray-500 border border-white/10 hover:bg-white/10 transition">Remove</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FINANCE ── */}
          {tab==="finance"&&(
            <div className="space-y-6">
              <div className="rounded-3xl p-8 border backdrop-blur-md" style={{background:"linear-gradient(135deg,rgba(110,231,192,0.07),rgba(147,197,253,0.07))",borderColor:balance>=0?`${MINT}30`:`${PEACH}30`,boxShadow:balance>=0?`0 0 40px ${MINT}15`:`0 0 40px ${PEACH}15`}}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Current Balance</p>
                    <p className="text-5xl font-bold" style={{color:balance>=0?MINT:PEACH}}>₺{balance.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-2">{transactions.length} transactions recorded</p>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} style={{color:MINT}}/><p className="text-xs text-gray-500">Income</p></div>
                      <p className="text-xl font-bold" style={{color:MINT}}>₺{transactions.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0).toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 mb-1"><ArrowDownRight size={14} style={{color:PEACH}}/><p className="text-xs text-gray-500">Expense</p></div>
                      <p className="text-xl font-bold" style={{color:PEACH}}>₺{Math.abs(transactions.filter(t=>t.amount<0).reduce((s,t)=>s+t.amount,0)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={()=>setTxModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105" style={{background:"rgba(110,231,192,0.15)",border:`1px solid ${MINT}40`,color:MINT}}>
                <Plus size={16}/>Add Transaction
              </button>
              <div className={`${glass} rounded-2xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                      {["Date","Title","Category","Amount","Added By"].map(h=><th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map(tx=>(
                        <tr key={tx.id} className="hover:bg-white/4 transition">
                          <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{tx.date}</td>
                          <td className="px-6 py-4 text-sm text-white font-medium">{tx.title}</td>
                          <td className="px-6 py-4"><span className="text-xs font-semibold px-3 py-1 rounded-full" style={catColor(tx.category)}>{tx.category}</span></td>
                          <td className="px-6 py-4"><span className="text-sm font-bold" style={{color:tx.amount>=0?MINT:PEACH}}>{tx.amount>=0?`+₺${tx.amount.toLocaleString()}`:`-₺${Math.abs(tx.amount).toLocaleString()}`}</span></td>
                          <td className="px-6 py-4 text-xs text-gray-400">{tx.addedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTES / INSTITUTIONAL MEMORY ── */}
          {tab==="notes"&&(
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Institutional Memory & Playbook</h3>
                  <p className="text-sm text-gray-500 mt-1">Document past experiences, rules, and lessons learned for future management boards.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all hover:scale-105" style={{background:"rgba(110,231,192,0.15)",border:`1px solid ${MINT}40`,color:MINT}}>
                  <Plus size={16}/>Add New Note
                </button>
              </div>

              {/* Notes grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { tag:"Logistics",   color:MINT,  title:"Event Booth Guidelines",         date:"Dec 2026", author:"S.Y.", body:"When setting up a booth to represent the community, assign specific shifts and duties to a limited number of people beforehand. Open-ended volunteer calls lead to either overcrowding or no-shows." },
                  { tag:"Communication", color:PEACH, title:"Announcement Timing Rule",       date:"Nov 2026", author:"S.Y.", body:"Send event announcements at least 10 days in advance. Last-minute posts result in low registration even for high-quality events — always schedule posts in advance." },
                  { tag:"Venue",       color:BLUE,  title:"Room Capacity Buffer",           date:"Oct 2026", author:"A.Y.", body:"Always book a venue with 20% extra capacity. Confirmed RSVPs translate to roughly 70% actual attendance, but walk-ins regularly push numbers over limit." },
                  { tag:"Speakers",    color:PEACH, title:"Speaker Confirmation Protocol",  date:"Oct 2026", author:"F.K.", body:"Get written confirmation from external speakers at least 2 weeks before the event and send a reminder 48 hours prior. Two events were disrupted by last-minute cancellations." },
                  { tag:"Budget",      color:MINT,  title:"Catering Contingency",           date:"Sep 2026", author:"S.Y.", body:"Reserve 15% of the catering budget as a contingency. Vendor price changes between booking and event date have caused budget overruns twice this year." },
                  { tag:"Documentation", color:BLUE, title:"Post-Event Report Deadline",    date:"Sep 2026", author:"Z.A.", body:"Submit the official post-event report within 72 hours. Memories fade fast — photos, attendance numbers, and feedback all need to be captured while fresh." },
                ].map((note,i)=>(
                  <div key={i} className={`${glassHover} rounded-2xl p-6 hover:-translate-y-0.5 border-l-2`} style={{borderLeftColor:note.color}}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:`${note.color}18`,color:note.color,border:`1px solid ${note.color}30`}}>{note.tag}</span>
                      <span className="text-xs text-gray-600">{note.date}</span>
                    </div>
                    <h4 className="font-bold text-white mb-2">{note.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{note.body}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
                      <span className="text-xs text-gray-600">Added by {note.author}</span>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-amber-400"><Edit2 size={14}/></button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-red-400"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab==="profile"&&(
            <div className="space-y-5 max-w-2xl">
              {([{label:"Community Name",key:"name",type:"input",placeholder:"e.g. IEEE Student Branch"},{label:"Vision",key:"vision",type:"textarea",placeholder:"Long-term vision…"},{label:"Mission",key:"mission",type:"textarea",placeholder:"Mission statement…"},{label:"About Us",key:"about",type:"textarea",placeholder:"Brief description…"}] as const).map(({label,key,type,placeholder})=>(
                <div key={key} className={`${glass} rounded-2xl p-6`}>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">{label}</label>
                  {type==="input"?<input value={profile[key]} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#6ee7c0]/50 transition"/>:<textarea rows={3} value={profile[key]} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#6ee7c0]/50 transition resize-none"/>}
                </div>
              ))}
              <button className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105" style={{background:"rgba(110,231,192,0.18)",color:MINT,border:`1px solid ${MINT}40`}}>Save Profile</button>
            </div>
          )}

          {/* ── AI REPORTS ── */}
          {tab==="ai"&&(
            <div className="space-y-6 max-w-3xl">
              <div className={`${glass} rounded-3xl p-10 text-center`} style={{background:"linear-gradient(135deg,rgba(110,231,192,0.06),rgba(147,197,253,0.06))"}}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{background:"rgba(110,231,192,0.15)",border:`1px solid ${MINT}35`}}><Sparkles size={28} style={{color:MINT}}/></div>
                <h3 className="text-xl font-bold text-white mb-2">AI Report Generator</h3>
                <p className="text-gray-400 text-sm mb-7 max-w-md mx-auto">Generate an official executive summary from your real Firestore event data — ready for SKS and sponsor submissions.</p>
                <button onClick={generateAI} disabled={isGenerating||loadingEvents} className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{background:`linear-gradient(135deg,${MINT},${BLUE})`,color:"#060b18",boxShadow:isGenerating?`0 0 35px ${MINT}55`:"none"}}>
                  {isGenerating?<><Loader size={18} className="animate-spin"/>AI is analyzing community data…</>:<><Sparkles size={18}/>Generate SKS / Sponsor Report</>}
                </button>
              </div>
              {aiReport&&(
                <div className={`${glass} rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><FileText size={16} style={{color:MINT}}/><span className="text-sm font-semibold text-white">Generated Report</span></div>
                    <button onClick={()=>navigator.clipboard?.writeText(aiReport)} className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition">Copy</button>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono rounded-xl p-5 border border-white/8" style={{background:"rgba(255,255,255,0.03)"}}>{aiReport}</pre>
                </div>
              )}
              <div className={`${glass} rounded-2xl p-5`}>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">Data Sources</p>
                <div className="flex flex-wrap gap-2">
                  {[`${events.length} Firestore Events`,`₺${balance.toLocaleString()} Net Balance`,"Team Members","Community Profile"].map(src=>(
                    <span key={src} className="text-xs px-3 py-1 rounded-full" style={{background:"rgba(147,197,253,0.1)",color:BLUE,border:`1px solid ${BLUE}25`}}>{src}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── ADD EVENT MODAL ── */}
      {modalOpen&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)"}}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 overflow-hidden" style={{background:"linear-gradient(145deg,#0d1830,#0a1525)"}}>
            <div className="px-7 py-6 border-b border-white/10 flex items-center justify-between" style={{background:"rgba(110,231,192,0.06)"}}>
              <h2 className="text-xl font-bold text-white">Add New Event</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-7 space-y-4">
              {successMsg&&<div className="text-center text-sm font-semibold py-3 rounded-xl" style={{background:"rgba(110,231,192,0.1)",color:MINT,border:`1px solid ${MINT}30`}}>{successMsg}</div>}
              {errorMsg&&<div className="text-center text-sm font-semibold py-3 rounded-xl" style={{background:"rgba(245,184,154,0.1)",color:PEACH,border:`1px solid ${PEACH}30`}}>⚠ {errorMsg}</div>}
              {[{label:"Event Name",name:"eventName",type:"text",placeholder:"e.g. AI Workshop"},{label:"Date",name:"date",type:"date",placeholder:""},{label:"Expected Attendees",name:"attendees",type:"number",placeholder:"e.g. 50"}].map(f=>(
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} disabled={submitting} value={form[f.name as keyof FormState]} onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#6ee7c0]/50 transition disabled:opacity-50"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Committee</label>
                <select value={form.committee} disabled={submitting} onChange={e=>setForm(p=>({...p,committee:e.target.value}))} className="w-full bg-[#0d1830] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6ee7c0]/50 transition disabled:opacity-50">
                  {COMMITTEES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeModal} disabled={submitting} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 border border-white/10 hover:bg-white/8 transition disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2" style={{background:"rgba(110,231,192,0.18)",color:MINT,border:`1px solid ${MINT}40`}}>
                  {submitting?<><Loader size={16} className="animate-spin"/>Creating…</>:<><Plus size={16}/>Create Event</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD TRANSACTION MODAL ── */}
      {txModalOpen&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)"}}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 overflow-hidden" style={{background:"linear-gradient(145deg,#0d1830,#0a1525)"}}>
            <div className="px-7 py-6 border-b border-white/10 flex items-center justify-between" style={{background:"rgba(245,184,154,0.06)"}}>
              <h2 className="text-xl font-bold text-white">Log Transaction</h2>
              <button onClick={()=>setTxModalOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleTxSubmit} className="p-7 space-y-4">
              {[{label:"Title",key:"title",type:"text",placeholder:"e.g. Tech Summit Sponsorship"},{label:"Date",key:"date",type:"date",placeholder:""},{label:"Amount (₺)",key:"amount",type:"number",placeholder:"e.g. 1500"},{label:"Added By",key:"addedBy",type:"text",placeholder:"e.g. S.Y."}].map(f=>(
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={txForm[f.key as keyof typeof txForm]} onChange={e=>setTxForm(p=>({...p,[f.key]:e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#6ee7c0]/50 transition"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <div className="flex gap-2">
                  {(["Income","Sponsorship","Expense"] as Transaction["category"][]).map(cat=>(
                    <button key={cat} type="button" onClick={()=>setTxForm(p=>({...p,category:cat}))} className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={txForm.category===cat?catColor(cat):{background:"rgba(255,255,255,0.05)",color:"#6b7280",border:"1px solid rgba(255,255,255,0.1)"}}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={()=>setTxModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 border border-white/10 hover:bg-white/8 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110" style={{background:"rgba(110,231,192,0.18)",color:MINT,border:`1px solid ${MINT}40`}}>
                  <CheckCircle2 size={16}/>Log Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
