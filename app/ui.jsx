"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, AppWindow, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, BookOpen, Bot, BriefcaseBusiness, Building2, Check, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Command, Download,
  ExternalLink, FileImage, FileSearch, FileText, Globe2, Headphones, History,
  Home, Image as ImageIcon, Languages, Link2, LockKeyhole, Map, Menu, Mic,
  Moon, Network, QrCode, Search, Settings, Shield, ShieldAlert, ShieldCheck,
  Smartphone, Sparkles, Sun, Upload, UserRound, Users, Wallet, X, Zap
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar
} from "recharts";

const trendData = [
  { day: "Aug 1", web: 8, social: 4, app: 3, domain: 2 },
  { day: "Aug 4", web: 12, social: 7, app: 4, domain: 5 },
  { day: "Aug 7", web: 9, social: 5, app: 6, domain: 3 },
  { day: "Aug 10", web: 18, social: 8, app: 5, domain: 7 },
  { day: "Aug 13", web: 14, social: 10, app: 7, domain: 6 },
  { day: "Aug 16", web: 27, social: 13, app: 9, domain: 8 },
  { day: "Aug 19", web: 17, social: 9, app: 11, domain: 5 },
  { day: "Aug 22", web: 21, social: 15, app: 8, domain: 10 },
  { day: "Aug 25", web: 15, social: 11, app: 7, domain: 6 },
  { day: "Aug 28", web: 24, social: 14, app: 12, domain: 9 },
  { day: "Aug 31", web: 19, social: 12, app: 10, domain: 8 },
];

const navGroups = [
  { label: "WORKSPACE", items: [
    ["Dashboard", Home], ["Brand Profile", Building2], ["Live Threat Map", Globe2],
    ["Social Monitoring", Users], ["App Monitoring", Smartphone], ["Domain Monitoring", Network]
  ]},
  { label: "PROTECTION TOOLS", items: [
    ["URL Analyzer", Link2], ["Screenshot-to-Safety", FileImage], ["QR Code Scanner", QrCode],
    ["Message Analyzer", ShieldAlert], ["Scam Before You Pay", Wallet], ["Voice Guardian", Mic],
    ["Scam Tactic Translator", Languages]
  ]},
  { label: "INTELLIGENCE", items: [
    ["Investigations", FileSearch], ["Threat Memory", History], ["Relationship Map", Network],
    ["Alerts", Bell], ["Reports", FileText], ["Settings", Settings]
  ]}
];

const alerts = [
  { title: "Suspicious website detected", detail: "abc-fake-offer.com", level: "High", time: "2 hours ago", icon: Globe2 },
  { title: "Fake social media profile", detail: "ABC Technologies Support", level: "Medium", time: "4 hours ago", icon: Users },
  { title: "Suspicious payment request", detail: "Urgent payment message", level: "High", time: "8 hours ago", icon: Wallet },
  { title: "Look-alike domain detected", detail: "abc-tech-career.com", level: "Medium", time: "10 hours ago", icon: Link2 },
];

const historyRows = [
  ["Aug 28, 2026", "Suspicious URL detected", "abc-payments-secure.com", "High"],
  ["Aug 26, 2026", "Fake social media profile", "ABC Tech Support", "Medium"],
  ["Aug 22, 2026", "Suspicious app listing", "ABC Wallet · Fake App", "High"],
  ["Aug 18, 2026", "Look-alike domain detected", "abc-tech-career.com", "Medium"],
  ["Aug 15, 2026", "Screenshot scam analysis", "Bank OTP message", "High"],
];

const features = [
  { name: "Screenshot-to-Safety AI", desc: "Analyze screenshots and messages", icon: FileImage, color: "violet", action: "Screenshot-to-Safety" },
  { name: "Scam Before You Pay", desc: "Check payment requests for scam indicators", icon: Wallet, color: "blue", action: "Scam Before You Pay" },
  { name: "QR Code Safety Scanner", desc: "Inspect QR destinations before opening", icon: QrCode, color: "green", action: "QR Code Scanner" },
  { name: "Scam Tactic Translator", desc: "Explain suspicious messages simply", icon: Languages, color: "purple", action: "Scam Tactic Translator" },
  { name: "Voice Guardian", desc: "Speak, upload, or listen to guidance", icon: Mic, color: "cyan", action: "Voice Guardian" },
];

function BrandMark() {
  return <div className="brand-mark"><ShieldCheck size={25} strokeWidth={2.6}/></div>;
}

function RiskBadge({ level }) {
  return <span className={`risk-badge ${level.toLowerCase()}`}>{level}</span>;
}

function SectionTitle({ icon: Icon, title, action }) {
  return <div className="section-title"><div className="section-title-name">{Icon && <Icon size={16}/>}<h3>{title}</h3></div>{action}</div>;
}

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [simpleMode, setSimpleMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [scanType, setScanType] = useState("Check Link");
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [language, setLanguage] = useState("Telugu");
  const [scanBusy, setScanBusy] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");

  const visibleAlerts = useMemo(() => alerts.filter(a => `${a.title} ${a.detail}`.toLowerCase().includes(search.toLowerCase())), [search]);

  async function runLocalAnalysis() {
    const value = scanInput.trim();
    if (!value) {
      setScanResult({ level: "Needs input", score: null, title: "Add something to analyze", explanation: "Paste a URL or message. Screenshot OCR and QR decoding are not configured in this starter." });
      return;
    }
    setScanBusy(true);
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const input_type = scanType === "Check Link" ? "url" : scanType === "Message" ? "message" : scanType === "QR Code" ? "qr" : "screenshot";
    try {
      const response = await fetch(`${api}/scans`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_type, input_value: value })
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        setScanResult({ level: "Unverified", score: null, title: "Scan request recorded — result unverified", explanation: "The request was stored in Supabase. No threat-intelligence provider was queried, so this result does not determine whether the item is safe or malicious." });
      } else {
        const localPatterns = /(otp|password|blocked|urgent|pay now|verify immediately|claim reward|free prize|secure-account|bit\\.ly|tinyurl|login-verify)/i.test(value);
        setScanResult({
          level: localPatterns ? "Caution" : "Unverified",
          score: null,
          title: localPatterns ? "Potential warning signs found" : "No definitive verdict available",
          explanation: `${localPatterns ? "This text matches a few common scam patterns. " : ""}Supabase scan storage is unavailable (${payload.error || response.statusText}). This is a limited local pattern check, not a live threat scan. Verify independently and never share OTPs or passwords.`
        });
      }
    } catch (_error) {
      const suspicious = /(otp|password|blocked|urgent|pay now|verify immediately|claim reward|free prize|secure-account|bit\\.ly|tinyurl|login-verify)/i.test(value);
      setScanResult({
        level: suspicious ? "Caution" : "Unverified",
        score: null,
        title: suspicious ? "Potential warning signs found" : "No definitive verdict available",
        explanation: `${suspicious ? "The text contains patterns commonly associated with scams. " : ""}The API is offline, so this is only a local pattern check—not a verified scan. No conclusion about the item's safety can be made.`
      });
    } finally {
      setScanBusy(false);
    }
  }

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    let cancelled = false;
    fetch(`${api}/health`)
      .then(async r => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || "API health check failed");
        return data;
      })
      .then(data => {
        if (!cancelled) setApiStatus(data.database === "configured" ? "connected" : "database-not-configured");
      })
      .catch(() => { if (!cancelled) setApiStatus("offline"); });
    return () => { cancelled = true; };
  }, []);

  const pageTitle = active === "Dashboard" ? "Good Morning, Analyst 👋" : active;
  const pageDescription = active === "Dashboard" ? "Here's what's happening with your digital world today." : `Explore ${active.toLowerCase()} in your DigitalShield AI workspace.`;

  return (
    <main className={`app-shell ${darkMode ? "dark-theme" : "light-theme"} ${simpleMode ? "simple-mode" : ""}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <BrandMark/>
          <div><div className="brand-name">DigitalShield AI</div><div className="brand-subtitle">Smart Protection for a Safer Digital World</div></div>
        </div>
        <button className="icon-button menu-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={21}/></button>
        <div className="global-search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand, domain, URL, report or feature..."/><kbd>⌘ K</kbd></div>
        <div className="top-actions">
          <button className={`simple-toggle ${simpleMode ? "selected" : ""}`} onClick={() => setSimpleMode(!simpleMode)}><span className="toggle-dot"/>{simpleMode ? "Simple Mode On" : "Simple Mode"}</button>
          <button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">{darkMode ? <Sun size={19}/> : <Moon size={19}/>}</button>
          <div className="popover-wrap"><button className="icon-button notification-button" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications"><Bell size={19}/><span className="notification-dot">3</span></button>{showNotifications && <div className="small-popover"><b>Recent notifications</b><p>Review suspicious website finding.</p><p>Monitoring source status changed.</p><p>Report export is ready when configured.</p></div>}</div>
          <div className="popover-wrap"><button className="profile-button" onClick={() => setShowProfile(!showProfile)}><div className="avatar">A</div><div className="profile-copy"><b>Analyst</b><span>analyst@abc.com</span></div><ChevronDown size={15}/></button>{showProfile && <div className="small-popover profile-pop"><b>Analyst workspace</b><p>Demo account · local UI</p><button onClick={() => {setActive("Settings");setShowProfile(false)}}>Open settings</button></div>}</div>
        </div>
      </header>

      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="sidebar-scroll">
          {navGroups.map(group => <div className="nav-group" key={group.label}><div className="nav-group-label">{group.label}</div>{group.items.map(([label, Icon]) => <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => {setActive(label);setMobileNav(false);setScanResult(null)}}><Icon size={17}/><span>{label}</span>{label === "Alerts" && <i className="nav-count">3</i>}</button>)}</div>)}
        </div>
        <div className="upgrade-card"><div className="upgrade-crown">✦</div><b>DigitalShield AI</b><strong>Protection Workspace</strong><p>Connect trusted sources to enable verified monitoring.</p><button onClick={() => setActive("Settings")}>Configure workspace <ArrowRight size={14}/></button></div>
      </aside>

      <section className="main-content">
        <div className="page-heading">
          <div><h1>{pageTitle}</h1><p>{pageDescription}</p></div>
          <div className="heading-tools"><span className={`api-status ${apiStatus}`} title="API/database connection status"><i/>{apiStatus === "connected" ? "API + DB connected" : apiStatus === "offline" ? "API offline" : apiStatus === "database-not-configured" ? "DB setup needed" : "Checking API"}</span><button className="date-control"><Clock3 size={14}/> Aug 1, 2026 – Aug 31, 2026 <ChevronDown size={14}/></button><div className="mini-avatar">A</div></div>
        </div>

        {active === "Dashboard" ? (
          <>
            <div className="stats-grid">
              <div className="stat-card red"><div className="stat-icon"><ShieldAlert size={18}/></div><div><strong>24</strong><span>Total detections</span><small><ArrowUpRight size={12}/> 12% <em>sample trend</em></small></div></div>
              <div className="stat-card orange"><div className="stat-icon"><AlertTriangle size={18}/></div><div><strong>6</strong><span>High risk</span><small><ArrowUpRight size={12}/> 3% <em>sample trend</em></small></div></div>
              <div className="stat-card blue"><div className="stat-icon"><Users size={18}/></div><div><strong>12</strong><span>Potential brands</span><small><ArrowUpRight size={12}/> 8% <em>sample trend</em></small></div></div>
              <div className="stat-card green"><div className="stat-icon"><CheckCircle2 size={18}/></div><div><strong>18</strong><span>Resolved</span><small><ArrowUpRight size={12}/> 20% <em>sample trend</em></small></div></div>
            </div>

            <div className="hero-grid">
              <section className="panel threat-map-panel">
                <SectionTitle icon={Globe2} title="Live Threat Map" action={<button className="text-action" onClick={() => setActive("Live Threat Map")}>Explore <ArrowRight size={13}/></button>}/>
                <div className="map-scene">
                  <div className="map-grid-lines"/>
                  <div className="globe"><div className="globe-lat lat1"/><div className="globe-lat lat2"/><div className="globe-lon lon1"/><div className="globe-lon lon2"/><div className="globe-core"><BrandMark/><b>Your Brand</b><span>ABC Technologies</span></div>
                    <span className="map-node node1"><i/>abc-tech-offer.com<small>Possible fake website</small></span>
                    <span className="map-node node2"><i/>@abc_official123<small>Look-alike profile</small></span>
                    <span className="map-node node3"><i/>ABC Wallet<small>App listing review</small></span>
                    <span className="map-node node4"><i/>abc-updates.net<small>Unverified domain</small></span>
                    <span className="map-node node5"><i/>ABC Technologies<small>Official reference</small></span>
                  </div>
                  <div className="map-legend"><span><i className="official-dot"/> Official</span><span><i className="suspect-dot"/> Suspicious</span><span><i className="related-dot"/> Related</span></div>
                </div>
                <div className="map-footer"><span><Activity size={13}/> Monitoring overview</span><span className="muted">Illustrative map · not live telemetry</span></div>
              </section>

              <section className="panel assistant-panel">
                <div className="assistant-banner"><div className="assistant-orb"><Bot size={38}/><span/></div><div><div className="eyebrow"><Sparkles size={13}/> AI THREAT ASSISTANT</div><h2>Scan something suspicious</h2><p>Check a URL or message and understand the warning signs.</p></div></div>
                <div className="scan-tabs">{[["Check Link",Link2],["Screenshot",ImageIcon],["QR Code",QrCode],["Message",FileText]].map(([name, Icon]) => <button key={name} className={scanType === name ? "selected" : ""} onClick={() => {setScanType(name);setScanResult(null)}}><Icon size={14}/>{name}</button>)}</div>
                <textarea className="scan-input" value={scanInput} onChange={e => setScanInput(e.target.value)} placeholder={scanType === "Check Link" ? "Paste a URL to inspect..." : scanType === "Message" ? "Paste the suspicious message here..." : `For this ${scanType.toLowerCase()} demo, paste any available text here...`}/>
                <button className="primary-button analyze-button" onClick={runLocalAnalysis} disabled={scanBusy}>{scanBusy ? "Analyzing locally..." : "Analyze Now"} <ArrowRight size={16}/></button>
                {scanResult && <div className={`scan-result ${scanResult.level === "Caution" ? "warning-result" : ""}`}><div className="result-heading"><AlertTriangle size={16}/><b>{scanResult.title}</b><span>{scanResult.level}</span></div><p>{scanResult.explanation}</p></div>}
                <div className="example-row"><span>Try an example:</span>{["Suspicious Link","Payment Message","Job Offer","QR Code"].map((x,i)=><button key={x} onClick={() => {setScanType(i===3?"QR Code":i===1?"Message":"Check Link");setScanInput(["https://secure-account-check.example/login","Your account will be blocked. Share your OTP to verify.","Pay a registration fee immediately to confirm your job offer.","QR destination: https://unknown-payment.example"][i]);setScanResult(null)}}><Zap size={11}/>{x}</button>)}</div>
              </section>
            </div>

            <div className="analytics-grid">
              <section className="panel chart-panel trend-panel"><SectionTitle icon={Activity} title="Threat Trends" action={<span className="sample-pill">Sample data</span>}/><div className="chart-legend"><span><i className="legend-blue"/>Website</span><span><i className="legend-cyan"/>Social</span><span><i className="legend-red"/>Apps</span><span><i className="legend-purple"/>Domains</span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData}><defs><linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#168bff" stopOpacity={0.28}/><stop offset="95%" stopColor="#168bff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#18314e" strokeDasharray="3 5"/><XAxis dataKey="day" tick={{fill:"#8ea7c8",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#8ea7c8",fontSize:10}} axisLine={false} tickLine={false} width={24}/><Tooltip contentStyle={{background:"#07162b",border:"1px solid #24466e",borderRadius:10,color:"#e7f1ff"}}/><Area type="monotone" dataKey="web" stroke="#268dff" fill="url(#blueFill)" strokeWidth={2}/><Area type="monotone" dataKey="social" stroke="#16d7e8" fill="transparent" strokeWidth={1.6}/><Area type="monotone" dataKey="app" stroke="#ff657d" fill="transparent" strokeWidth={1.6}/><Area type="monotone" dataKey="domain" stroke="#a17bff" fill="transparent" strokeWidth={1.6}/></AreaChart></ResponsiveContainer></div></section>
              <section className="panel platform-panel"><SectionTitle icon={Globe2} title="Detection by Platform"/><div className="donut-wrap"><div className="donut"><div><b>24</b><span>Total</span></div></div><div className="donut-legend"><span><i className="legend-blue"/>Website <b>40%</b></span><span><i className="legend-coral"/>Social media <b>25%</b></span><span><i className="legend-cyan"/>Mobile apps <b>20%</b></span><span><i className="legend-purple"/>Domains <b>10%</b></span><span><i className="legend-green"/>Others <b>5%</b></span></div></div><p className="chart-note">Illustrative distribution</p></section>
              <section className="panel risk-chart-panel"><SectionTitle icon={ShieldAlert} title="Risk Level Distribution"/><div className="bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:"High",count:6},{name:"Medium",count:12},{name:"Low",count:18}]}><CartesianGrid stroke="#18314e" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="name" tick={{fill:"#8ea7c8",fontSize:11}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip contentStyle={{background:"#07162b",border:"1px solid #24466e",borderRadius:10,color:"#e7f1ff"}}/><Bar dataKey="count" radius={[5,5,0,0]} fill="#248cff"/></BarChart></ResponsiveContainer></div><p className="chart-note">Illustrative distribution</p></section>
              <section className="panel alerts-panel"><SectionTitle icon={Bell} title="Recent Alerts" action={<button className="text-action" onClick={() => setActive("Alerts")}>View all <ArrowRight size={13}/></button>}/><div className="alert-list">{visibleAlerts.map((a,i)=><div className="alert-row" key={a.title}><div className={`alert-icon ${a.level.toLowerCase()}`}><a.icon size={15}/></div><div className="alert-copy"><b>{a.title}</b><span>{a.detail}</span><small>{a.time}</small></div><RiskBadge level={a.level}/></div>)}</div></section>
            </div>

            <div className="feature-grid">{features.map(f=>{const Icon=f.icon;return <button className={`feature-card ${f.color}`} key={f.name} onClick={()=>setActive(f.action)}><div className="feature-icon"><Icon size={20}/></div><div className="feature-copy"><b>{f.name}</b><span>{f.desc}</span><em>Open tool <ArrowRight size={12}/></em></div></button>})}</div>

            <div className="bottom-grid">
              <section className="panel memory-panel"><SectionTitle icon={History} title="Digital Risk Memory" action={<button className="text-action" onClick={()=>setActive("Threat Memory")}>View all <ArrowRight size={13}/></button>}/><div className="history-list">{historyRows.slice(0,4).map((r,i)=><div className="history-row" key={r[0]+r[1]}><i className={`timeline-dot dot-${i}`}/><div><small>{r[0]}</small><b>{r[1]}</b><span>{r[2]}</span></div><RiskBadge level={r[3]}/></div>)}</div></section>
              <section className="panel relationship-panel"><SectionTitle icon={Network} title="AI Impersonation Relationship Map" action={<button className="icon-button small" onClick={()=>setActive("Relationship Map")}><ExternalLink size={14}/></button>}/><div className="relationship-graph"><div className="graph-lines"><svg viewBox="0 0 500 230" preserveAspectRatio="none"><line x1="250" y1="115" x2="75" y2="35"/><line x1="250" y1="115" x2="420" y2="34"/><line x1="250" y1="115" x2="72" y2="180"/><line x1="250" y1="115" x2="420" y2="185"/><line x1="250" y1="115" x2="250" y2="12"/><line x1="250" y1="115" x2="250" y2="220"/></svg></div><div className="graph-center"><BrandMark/><b>ABC</b><span>Technologies</span></div><div className="graph-node gn1"><Globe2/><b>abc-fake.com</b><span>Possible fake site</span></div><div className="graph-node gn2"><Users/><b>@abc_official123</b><span>Look-alike profile</span></div><div className="graph-node gn3"><Link2/><b>abc-career.net</b><span>Look-alike domain</span></div><div className="graph-node gn4"><Smartphone/><b>ABC Wallet</b><span>App listing</span></div><div className="graph-node gn5"><Building2/><b>Official brand</b><span>Reference profile</span></div><div className="graph-node gn6"><Globe2/><b>abc-updates.net</b><span>Unverified domain</span></div></div><div className="graph-legend"><span><i className="legend-green"/>Official</span><span><i className="legend-purple"/>Potentially related</span><span><i className="legend-red"/>Suspicious</span></div><p className="chart-note">Illustrative relationships; links require evidence before confirmation.</p></section>
              <section className="panel report-panel"><SectionTitle icon={FileText} title="Evidence-First Threat Report" action={<button className="download-button" onClick={()=>setActive("Reports")}><Download size={13}/> Report details</button>}/><div className="report-preview"><div className="report-sheet"><BrandMark/><b>Threat Analysis Report</b><div className="report-mini-chart"><span/><span/><span/><span/><span/><span/></div><div className="report-mini-donut"/><small>Evidence summary · sample</small></div><div className="report-data"><span>Target URL <b>abc-bank-secure.example</b></span><span>Risk assessment <RiskBadge level="High"/></span><span>Evidence <b>5 indicators · sample</b></span><span>Recommendation <b>Verify via official channel</b></span><button className="primary-button" onClick={()=>setActive("Reports")}>Open report <ArrowRight size={13}/></button></div></div></section>
            </div>
            <div className="disclaimer"><CircleHelp size={14}/> Dashboard values, alerts, and relationships are illustrative demo data. No live monitoring or external threat checks are running in this UI preview.</div>
          </>
        ) : (
          <ToolPage active={active} scanInput={scanInput} setScanInput={setScanInput} runLocalAnalysis={runLocalAnalysis} scanResult={scanResult} scanType={scanType} setScanType={setScanType} language={language} setLanguage={setLanguage} />
        )}
      </section>
    </main>
  );
}

function ToolPage({ active, scanInput, setScanInput, runLocalAnalysis, scanResult, scanType, setScanType, language, setLanguage }) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [uploadedName, setUploadedName] = useState("");
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState("");
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (["URL Analyzer", "Screenshot-to-Safety", "QR Code Scanner", "Message Analyzer", "Scam Before You Pay", "Voice Guardian", "Scam Tactic Translator"].includes(active)) return;
    let cancelled = false;
    setItemsLoading(true);
    setItemsError("");
    fetch(`${apiBase}/items`)
      .then(async response => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Could not load workspace items.");
        return payload;
      })
      .then(payload => {
        if (cancelled) return;
        setItems((payload.items || []).map(item => ({
          ...item,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—",
          risk: item.risk || "Unverified",
          status: item.status || "Saved to Supabase",
          source: item.source || "User entered",
          recommendation: item.recommendation || "Verify through an official source. This entry is not an independently verified threat finding."
        })));
      })
      .catch(error => { if (!cancelled) setItemsError(error.message); })
      .finally(() => { if (!cancelled) setItemsLoading(false); });
    return () => { cancelled = true; };
  }, [active, apiBase]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({ type: active === "Brand Profile" ? "Brand profile" : "Finding", name: "", target: "", risk: "Unverified", description: "", evidence: "" });
  const [formError, setFormError] = useState("");
  const toolDescriptions = {
    "Brand Profile": "Manage the brand details used as the reference for investigations.",
    "Live Threat Map": "Explore illustrative relationships between a brand and possible threats.",
    "Social Monitoring": "Review sample social accounts and their verification status.",
    "App Monitoring": "Review sample app-store listings and risk indicators.",
    "Domain Monitoring": "Review possible look-alike domains and domain evidence.",
    "URL Analyzer": "Inspect a URL using a local demonstration check.",
    "Screenshot-to-Safety": "Upload a screenshot and prepare it for analysis. OCR/AI services are not connected in this starter.",
    "QR Code Scanner": "Select a QR image. A decoding library and destination reputation source must be connected for real scanning.",
    "Message Analyzer": "Review a message for simple suspicious language patterns.",
    "Scam Before You Pay": "Review payment-related text for common scam warning signs.",
    "Voice Guardian": "Use text guidance and browser voice features when available.",
    "Scam Tactic Translator": "View an illustrative simple-language explanation. Connect a translation service for reliable translations.",
    "Investigations": "Organize findings into cases and track their status.",
    "Threat Memory": "Review historical findings. Current entries are illustrative.",
    "Relationship Map": "View potentially related domains and profiles; associations need evidence.",
    "Alerts": "Review the sample alert queue.",
    "Reports": "Review report evidence and recommendations.",
    "Settings": "Workspace settings and integration setup.",
  };
  const showScan = ["URL Analyzer","Screenshot-to-Safety","QR Code Scanner","Message Analyzer","Scam Before You Pay","Voice Guardian","Scam Tactic Translator"].includes(active);
  const Icon = active.includes("QR") ? QrCode : active.includes("Screenshot") ? FileImage : active.includes("Voice") ? Mic : active.includes("Translator") ? Languages : active.includes("Pay") ? Wallet : active.includes("Report") ? FileText : active.includes("Map") ? Network : active.includes("Domain") ? Globe2 : active.includes("App") ? Smartphone : active.includes("Social") ? Users : active.includes("Brand") ? Building2 : active.includes("Setting") ? Settings : active.includes("Alert") ? Bell : active.includes("Investigation") ? FileSearch : active.includes("Memory") ? History : ShieldCheck;

  return <div className="tool-page">
    <section className="panel tool-intro"><div className="tool-intro-icon"><Icon size={25}/></div><div><div className="eyebrow">DIGITALSHIELD AI WORKSPACE</div><h2>{active}</h2><p>{toolDescriptions[active] || `Review ${active.toLowerCase()} in your protection workspace.`}</p></div><span className="sample-pill">Starter UI</span></section>
    {showScan ? <div className="tool-columns">
      <section className="panel tool-form"><SectionTitle icon={Sparkles} title="Analyze an item"/>{active==="Scam Tactic Translator" && <label className="field-label">Explanation language<select value={language} onChange={e=>setLanguage(e.target.value)}><option>Telugu</option><option>English</option><option>Hindi</option></select></label>}
        {active==="Voice Guardian" && <div className="voice-circle"><Mic size={35}/><b>Voice Guardian</b><span>Enter text below or use your device's voice features.</span></div>}
        {active==="Screenshot-to-Safety" && <label className="upload-box"><Upload size={26}/><b>Choose screenshot</b><span>PNG, JPG or WEBP · upload selection only in this starter</span><input type="file" accept="image/*" onChange={e=>setUploadedName(e.target.files?.[0]?.name || "")}/>{uploadedName && <small>Selected: {uploadedName}</small>}</label>}
        {active==="QR Code Scanner" && <label className="upload-box"><QrCode size={28}/><b>Select QR image</b><span>Real QR decoding is not yet connected</span><input type="file" accept="image/*" onChange={e=>setUploadedName(e.target.files?.[0]?.name || "")}/>{uploadedName && <small>Selected: {uploadedName}</small>}</label>}
        <label className="field-label">{active==="URL Analyzer" ? "Website URL" : active==="Scam Before You Pay" ? "Payment request or message" : active==="Scam Tactic Translator" ? "Message to explain" : "Text to analyze"}<textarea value={scanInput} onChange={e=>setScanInput(e.target.value)} placeholder={active==="URL Analyzer"?"https://example.com": "Paste the suspicious text here..."}/></label>
        <button className="primary-button wide" onClick={runLocalAnalysis}>Run local demo check <ArrowRight size={15}/></button>
        <p className="fine-print">This starter uses a few local text-pattern checks only. It does not verify websites, decode uploaded QR images, perform OCR, contact threat feeds, or confirm fraud.</p>
      </section>
      <section className="panel tool-results"><SectionTitle icon={FileSearch} title="Analysis result"/>{scanResult ? <div className="result-card"><RiskBadge level={scanResult.level}/><h3>{scanResult.title}</h3><p>{scanResult.explanation}</p><div className="recommendation"><b>Recommended next steps</b><ul><li>Do not share passwords, PINs, or OTPs.</li><li>Verify using an official app or website you open yourself.</li><li>Report suspected fraud through the relevant official channel.</li></ul></div></div> : <div className="empty-state"><div className="empty-icon"><ShieldCheck size={34}/></div><h3>Ready for your input</h3><p>Submit text to see a local demonstration result. An unavailable check is not evidence that an item is safe.</p></div>}</section>
    </div> : <section className="panel generic-tool">
      <div className="toolbar"><div className="search-control"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${active.toLowerCase()}...`}/></div><button className="secondary-button" onClick={()=>setNotice("This starter UI has no live source connected. Configure an authorized data source to enable monitoring.")}>Check source status</button><button className="primary-button" onClick={()=>{setForm({type: active === "Brand Profile" ? "Brand profile" : active === "Social Monitoring" ? "Social profile" : active === "App Monitoring" ? "Mobile app" : active === "Domain Monitoring" ? "Domain" : "Finding", name: "", target: "", risk: "Unverified", description: "", evidence: ""});setFormError("");setShowAddModal(true)}}>+ Add Item</button></div>
      {active==="Settings" ? <div className="settings-grid"><div className="settings-card"><ShieldCheck/><h3>Security & access</h3><p>Configure authentication, session policy, and role-based access when connecting your auth provider.</p><span className="status-muted">Not connected</span></div><div className="settings-card"><DatabaseIcon/><h3>Supabase integration</h3><p>Add environment variables and implement database tables and row-level security policies.</p><span className="status-muted">Setup required</span></div><div className="settings-card"><Activity/><h3>Monitoring sources</h3><p>Connect authorized APIs and display source freshness and failure status.</p><span className="status-muted">Not connected</span></div></div> :
      active==="Relationship Map" || active==="Live Threat Map" ? <div className="large-map"><div className="map-scene"><div className="globe"><div className="globe-core"><BrandMark/><b>ABC Technologies</b><span>Reference brand · sample</span></div><span className="map-node node1"><i/>abc-fake.example<small>Unverified domain</small></span><span className="map-node node2"><i/>@abc_support<small>Possible look-alike</small></span><span className="map-node node3"><i/>ABC Wallet<small>App listing</small></span><span className="map-node node4"><i/>abc-career.example<small>Similar name</small></span></div></div><p className="fine-print">Illustrative relationships only. Shared names or visual similarity do not prove common ownership or malicious activity.</p></div> :
      <>{itemsLoading && <div className="inline-notice">Loading saved items from the backend…</div>}{itemsError && <div className="inline-notice"><CircleHelp size={15}/>{itemsError}</div>}<div className="data-table-wrap"><table><thead><tr><th>Finding</th><th>Target</th><th>Source status</th><th>Risk</th><th>Action</th></tr></thead><tbody>{items.filter(item=>`${item.type} ${item.name || item.target} ${item.target} ${item.risk}`.toLowerCase().includes(query.toLowerCase())).map(item=><tr key={item.id}><td><b>{item.name || item.type}</b><small>{item.date}</small></td><td>{item.target || "—"}</td><td><span className="status-muted">{item.status}</span></td><td><RiskBadge level={item.risk}/></td><td><button className="secondary-button" onClick={()=>setSelectedItem(item)}>View details</button></td></tr>)}</tbody></table></div><div className="table-footer">{items.length ? `${items.length} saved workspace item(s) loaded from the backend.` : "No saved items yet. Use Add Item to create your first record. Records are not verified threat findings."}</div></>}
      {notice && <div className="inline-notice"><CircleHelp size={15}/>{notice}<button onClick={()=>setNotice("")}><X size={14}/></button></div>}
      {showAddModal && <div className="ds-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowAddModal(false)}}><section className="ds-modal" role="dialog" aria-modal="true" aria-labelledby="add-item-title"><div className="ds-modal-heading"><div><span className="eyebrow">DIGITALSHIELD AI</span><h2 id="add-item-title">Add Item</h2><p>Add a record to this workspace view.</p></div><button className="icon-button" aria-label="Close" onClick={()=>setShowAddModal(false)}><X size={18}/></button></div><form onSubmit={async e=>{e.preventDefault();if(!form.name.trim()||!form.target.trim()){setFormError("Please enter both a name and a URL or target.");return;}setFormError("");try{const response=await fetch(`${apiBase}/items`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:form.type,name:form.name.trim(),target:form.target.trim(),risk:form.risk,description:form.description.trim(),evidence:form.evidence.trim()})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||"Could not save item.");const saved={...payload.item,date:payload.item.created_at?new Date(payload.item.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"Today",status:payload.item.status||"Saved to Supabase",source:"User entered",recommendation:"Verify through an official source. This record is not an independently verified threat finding."};setItems(prev=>[saved,...prev.filter(item=>item.id!==saved.id)]);setSelectedItem(null);setShowAddModal(false);setQuery("");setNotice("Item saved to the backend and Supabase.");}catch(error){setFormError(`${error.message} Check that the backend is running and Supabase is configured.`);}}}><label className="ds-field">Item type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Brand profile</option><option>Social profile</option><option>Mobile app</option><option>Domain</option><option>URL</option><option>Finding</option><option>Other</option></select></label><label className="ds-field">Name or title *<input autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Example brand" required/></label><label className="ds-field">Website, profile, app URL, or target *<input value={form.target} onChange={e=>setForm({...form,target:e.target.value})} placeholder="https://example.com" required/></label><label className="ds-field">Risk status<select value={form.risk} onChange={e=>setForm({...form,risk:e.target.value})}><option>Unverified</option><option>Low</option><option>Medium</option><option>High</option></select></label><label className="ds-field">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Add notes about this item"/></label><label className="ds-field">Evidence / notes<textarea value={form.evidence} onChange={e=>setForm({...form,evidence:e.target.value})} placeholder="Optional evidence or context"/></label>{formError&&<p className="ds-form-error">{formError}</p>}<div className="ds-modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowAddModal(false)}>Cancel</button><button type="submit" className="primary-button">Save Item <Check size={15}/></button></div></form></section></div>}
      {selectedItem && <div className="ds-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedItem(null)}}><section className="ds-modal ds-details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title"><div className="ds-modal-heading"><div><span className="eyebrow">RECORD DETAILS</span><h2 id="details-title">{selectedItem.name || selectedItem.type}</h2><p>{selectedItem.target}</p></div><button className="icon-button" aria-label="Close details" onClick={()=>setSelectedItem(null)}><X size={18}/></button></div><div className="ds-details-grid"><div><span>Type</span><b>{selectedItem.type}</b></div><div><span>Risk status</span><RiskBadge level={selectedItem.risk}/></div><div><span>Date added</span><b>{selectedItem.date}</b></div><div><span>Source / status</span><b>{selectedItem.status}</b></div></div><div className="ds-detail-section"><h3>Description</h3><p>{selectedItem.description || "No description provided."}</p></div><div className="ds-detail-section"><h3>Evidence and notes</h3><p>{selectedItem.evidence || "No evidence provided."}</p></div><div className="ds-detail-section"><h3>Recommended next action</h3><p>{selectedItem.recommendation || "Verify using an official source."}</p></div><p className="ds-detail-footnote">Risk labels and notes are displayed as entered or stored in this UI. They are not proof of a verified threat scan.</p><div className="ds-modal-actions"><button className="secondary-button" onClick={()=>setSelectedItem(null)}>Close details</button>{/^https?:\/\//i.test(selectedItem.target||"")&&<a className="secondary-button ds-open-link" href={selectedItem.target} target="_blank" rel="noopener noreferrer">Open target <ExternalLink size={14}/></a>}</div></section></div>}
    </section>}
  </div>;
}

function DatabaseIcon() {
  return <LockKeyhole size={22}/>;
}
