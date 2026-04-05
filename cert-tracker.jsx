import { useState, useEffect, useMemo } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#f7f6f3; --bg2:#efede8; --white:#ffffff;
    --border:#e2ddd6; --border2:#cdc8be;
    --text:#1c1a17; --text-mid:#4a4540; --text-soft:#8c867c; --text-xsoft:#b5b0a8;
    --green:#2d7a4f; --green-bg:#eaf6f0; --green-border:#b8e0cc;
    --amber:#9a6200; --amber-bg:#fef8ec; --amber-border:#f5d98a;
    --orange:#b84e00; --orange-bg:#fff3eb; --orange-border:#f5c4a0;
    --red:#b91c1c; --red-bg:#fef2f2; --red-border:#fbc8c8;
    --blue:#1d4ed8; --blue-bg:#eff6ff; --blue-border:#bfdbfe;
    --shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);
    --shadow-lg:0 12px 32px rgba(0,0,0,0.12),0 4px 8px rgba(0,0,0,0.06);
    --r:10px; --rs:6px;
  }
  body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; -webkit-font-smoothing:antialiased; }
  .app { display:flex; flex-direction:column; min-height:100vh; }

  /* NAV */
  .nav { background:var(--white); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 32px; height:60px; position:sticky; top:0; z-index:200; box-shadow:var(--shadow-sm); }
  .nav-brand { display:flex; align-items:center; gap:10px; }
  .nav-logo { width:32px; height:32px; background:var(--text); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; }
  .nav-name { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--text); letter-spacing:-0.01em; }
  .nav-tagline { font-size:12px; color:var(--text-soft); margin-top:1px; }

  /* PAGE */
  .page { max-width:1180px; margin:0 auto; padding:32px 24px; width:100%; }
  .page-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:700; color:var(--text); letter-spacing:-0.02em; }
  .page-sub { font-size:14px; color:var(--text-soft); margin-top:4px; }
  .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; gap:16px; }

  /* STATS */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
  .stat-card { background:var(--white); border:1px solid var(--border); border-radius:var(--r); padding:20px 22px; cursor:pointer; transition:box-shadow 0.15s,border-color 0.15s; box-shadow:var(--shadow-sm); }
  .stat-card:hover { box-shadow:var(--shadow-md); border-color:var(--border2); }
  .stat-card.active { border-color:var(--text); box-shadow:var(--shadow-md); }
  .stat-label { font-size:11.5px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; color:var(--text-soft); margin-bottom:10px; }
  .stat-num { font-family:'Syne',sans-serif; font-size:38px; font-weight:800; line-height:1; letter-spacing:-0.02em; }
  .cn-all{color:var(--text)} .cn-green{color:var(--green)} .cn-amber{color:var(--amber)} .cn-red{color:var(--red)}
  .stat-desc { font-size:12px; color:var(--text-xsoft); margin-top:6px; }

  /* TABS */
  .tabs { display:flex; gap:2px; border-bottom:1px solid var(--border); margin-bottom:24px; }
  .tab { padding:10px 18px; font-size:14px; font-weight:500; color:var(--text-soft); border:none; background:none; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:color 0.15s; font-family:'DM Sans',sans-serif; display:flex; align-items:center; gap:7px; }
  .tab:hover { color:var(--text-mid); }
  .tab.active { color:var(--text); border-bottom-color:var(--text); font-weight:600; }
  .tbadge { background:var(--red-bg); color:var(--red); font-size:11px; font-weight:700; padding:1px 6px; border-radius:99px; border:1px solid var(--red-border); }

  /* TOOLBAR */
  .toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
  .toolbar-left { display:flex; gap:8px; flex:1; }
  .sw { position:relative; flex:1; max-width:320px; }
  .sw svg { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--text-soft); }
  .si { width:100%; background:var(--white); border:1px solid var(--border); border-radius:var(--rs); padding:8px 12px 8px 34px; font-size:14px; font-family:'DM Sans',sans-serif; color:var(--text); outline:none; transition:border-color 0.15s; }
  .si:focus { border-color:var(--border2); }
  .si::placeholder { color:var(--text-xsoft); }
  .fsel { background:var(--white); border:1px solid var(--border); border-radius:var(--rs); padding:8px 12px; font-size:13.5px; font-family:'DM Sans',sans-serif; color:var(--text-mid); outline:none; cursor:pointer; }
  .rc { font-size:13px; color:var(--text-soft); white-space:nowrap; }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; font-size:13.5px; font-weight:600; font-family:'DM Sans',sans-serif; border-radius:var(--rs); border:none; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .bp { background:var(--text); color:#fff; } .bp:hover { background:#333; }
  .bo { background:var(--white); color:var(--text-mid); border:1px solid var(--border); } .bo:hover { background:var(--bg); }
  .bg { background:transparent; color:var(--text-soft); } .bg:hover { background:var(--bg); color:var(--text-mid); }
  .bsm { padding:5px 11px; font-size:12.5px; }
  .bd { background:var(--red-bg); color:var(--red); border:1px solid var(--red-border); } .bd:hover { background:#fee2e2; }

  /* TABLE */
  .tc { background:var(--white); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; box-shadow:var(--shadow-sm); }
  .thead { display:grid; grid-template-columns:2.2fr 2fr 1.4fr 1.1fr 130px 96px; background:var(--bg); border-bottom:1px solid var(--border); padding:0 20px; }
  .th { padding:11px 10px; font-size:11px; font-weight:600; letter-spacing:0.09em; text-transform:uppercase; color:var(--text-soft); }
  .trow { display:grid; grid-template-columns:2.2fr 2fr 1.4fr 1.1fr 130px 96px; padding:0 20px; border-bottom:1px solid var(--border); align-items:center; transition:background 0.1s; animation:fi 0.2s ease; }
  @keyframes fi { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  .trow:last-child { border-bottom:none; }
  .trow:hover { background:var(--bg); }
  .td { padding:13px 10px; font-size:13.5px; }
  .tdn { font-weight:600; color:var(--text); }
  .tdt { font-size:11.5px; color:var(--text-soft); margin-top:2px; }
  .tdc { color:var(--text-mid); font-weight:500; }
  .tdi { color:var(--text-soft); font-size:13px; }
  .tdd { font-family:'Fira Code',monospace; font-size:12.5px; color:var(--text-mid); }
  .tda { display:flex; gap:6px; justify-content:flex-end; }

  /* PILL */
  .pill { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:99px; font-size:12px; font-weight:600; border:1px solid transparent; white-space:nowrap; font-family:'Fira Code',monospace; }
  .pill.valid   { background:var(--green-bg);  color:var(--green);  border-color:var(--green-border); }
  .pill.warn30  { background:var(--amber-bg);  color:var(--amber);  border-color:var(--amber-border); }
  .pill.warn14  { background:var(--orange-bg); color:var(--orange); border-color:var(--orange-border); }
  .pill.warn7,.pill.today,.pill.expired { background:var(--red-bg); color:var(--red); border-color:var(--red-border); }
  .pill.missing { background:var(--blue-bg); color:var(--blue); border-color:var(--blue-border); }
  .pd { width:6px; height:6px; border-radius:50%; background:currentColor; }

  /* PEOPLE */
  .pg { display:flex; flex-direction:column; gap:12px; }
  .pc { background:var(--white); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; box-shadow:var(--shadow-sm); transition:box-shadow 0.15s; }
  .pc:hover { box-shadow:var(--shadow-md); }
  .pch { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; cursor:pointer; gap:16px; }
  .pav { width:38px; height:38px; background:var(--bg2); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; color:var(--text-mid); font-family:'Syne',sans-serif; flex-shrink:0; border:1px solid var(--border); }
  .pi { flex:1; }
  .pname { font-weight:600; font-size:15px; color:var(--text); }
  .pmeta { font-size:12.5px; color:var(--text-soft); margin-top:2px; }
  .ps { display:flex; align-items:center; gap:10px; }
  .ab { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:99px; font-size:12px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; }
  .ab.authorized    { background:var(--green-bg); color:var(--green); border:1px solid var(--green-border); }
  .ab.warning       { background:var(--amber-bg); color:var(--amber); border:1px solid var(--amber-border); }
  .ab.non-compliant { background:var(--red-bg);   color:var(--red);   border:1px solid var(--red-border); }
  .ab.missing-docs  { background:var(--blue-bg);  color:var(--blue);  border:1px solid var(--blue-border); }
  .adot { width:7px; height:7px; border-radius:50%; background:currentColor; }
  .chev { font-size:12px; color:var(--text-soft); transition:transform 0.2s; }
  .chev.open { transform:rotate(180deg); }
  .pccerts { border-top:1px solid var(--border); background:var(--bg); }
  .pcrow { display:flex; align-items:center; padding:10px 20px 10px 76px; border-bottom:1px solid var(--border); gap:14px; font-size:13.5px; }
  .pcrow:last-child { border-bottom:none; }
  .pcc { flex:1; color:var(--text-mid); font-weight:500; }
  .pci { width:130px; color:var(--text-soft); font-size:13px; }
  .pcd { width:110px; font-family:'Fira Code',monospace; font-size:12.5px; color:var(--text-soft); }
  .pcactions { display:flex; gap:6px; padding:12px 20px; border-top:1px solid var(--border); background:var(--white); }

  /* ALERTS */
  .asec { margin-bottom:24px; }
  .atitle { font-family:'Syne',sans-serif; font-size:12.5px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-soft); margin-bottom:8px; }
  .acard { background:var(--white); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; box-shadow:var(--shadow-sm); }
  .aitem { display:flex; align-items:center; padding:13px 18px; border-bottom:1px solid var(--border); gap:14px; transition:background 0.1s; }
  .aitem:last-child { border-bottom:none; }
  .aitem:hover { background:var(--bg); }
  .aicon { font-size:18px; flex-shrink:0; }
  .abody { flex:1; }
  .atxt { font-size:14px; font-weight:600; color:var(--text); }
  .asub { font-size:12.5px; color:var(--text-soft); margin-top:2px; }
  .aright { display:flex; align-items:center; gap:10px; }
  .no-alerts { text-align:center; padding:40px; color:var(--text-soft); font-size:14px; }

  /* EMPTY */
  .empty { text-align:center; padding:60px 32px; }
  .empty-icon { font-size:40px; margin-bottom:14px; opacity:0.4; }
  .empty h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--text-mid); margin-bottom:6px; }
  .empty p { font-size:13.5px; color:var(--text-soft); }

  /* MODAL */
  .ov { position:fixed; inset:0; background:rgba(28,26,23,0.45); display:flex; align-items:center; justify-content:center; z-index:999; backdrop-filter:blur(3px); }
  .modal { background:var(--white); border:1px solid var(--border); border-radius:14px; width:540px; max-width:calc(100vw - 32px); max-height:calc(100vh - 48px); overflow-y:auto; box-shadow:var(--shadow-lg); animation:pop 0.18s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .mhead { padding:22px 24px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .mtitle { font-family:'Syne',sans-serif; font-size:19px; font-weight:700; }
  .mclose { background:none; border:none; font-size:18px; cursor:pointer; color:var(--text-soft); padding:4px 8px; border-radius:6px; transition:all 0.15s; }
  .mclose:hover { background:var(--bg); color:var(--text); }
  .mbody { padding:22px 24px; }
  .mfoot { padding:14px 24px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:8px; }

  /* FORM */
  .fgrid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .fg { display:flex; flex-direction:column; gap:6px; }
  .fg.full { grid-column:1/-1; }
  .fl { font-size:12px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; color:var(--text-soft); }
  .fi,.fs,.fta { background:var(--bg); border:1px solid var(--border); border-radius:var(--rs); padding:9px 12px; font-size:14px; font-family:'DM Sans',sans-serif; color:var(--text); outline:none; transition:border-color 0.15s; width:100%; }
  .fi:focus,.fs:focus,.fta:focus { border-color:var(--border2); background:var(--white); }
  .fi::placeholder,.fta::placeholder { color:var(--text-xsoft); }
  .mtoggle { display:flex; align-items:center; gap:8px; padding:10px 12px; background:var(--blue-bg); border:1px solid var(--blue-border); border-radius:var(--rs); cursor:pointer; font-size:13.5px; color:var(--blue); font-weight:500; user-select:none; }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }
`;

/* helpers */
const todayMs = () => { const d=new Date(); d.setHours(0,0,0,0); return d.getTime(); };
const daysUntil = s => { if(!s) return null; const e=new Date(s); e.setHours(0,0,0,0); return Math.round((e.getTime()-todayMs())/86400000); };
const fmtDate = s => { if(!s) return "—"; return new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
const off = n => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
const statusOf = d => { if(d===null) return "missing"; if(d<0) return "expired"; if(d===0) return "today"; if(d<=7) return "warn7"; if(d<=14) return "warn14"; if(d<=30) return "warn30"; return "valid"; };
const pillLabel = d => { if(d===null) return "Not Submitted"; if(d<0) return `Expired ${Math.abs(d)}d ago`; if(d===0) return "Expires Today"; return `${d}d left`; };

function Pill({ dateStr, missing }) {
  const d = missing ? null : daysUntil(dateStr);
  const st = statusOf(d);
  return <span className={`pill ${st}`}><span className="pd"/>{pillLabel(d)}</span>;
}

const personAuth = certs => {
  if(!certs.length) return "missing-docs";
  const ss = certs.map(c=>statusOf(c.missing?null:daysUntil(c.expiry)));
  if(ss.some(s=>["expired","today","missing"].includes(s))) return "non-compliant";
  if(ss.some(s=>["warn7","warn14","warn30"].includes(s))) return "warning";
  return "authorized";
};
const AUTH_LABELS = { authorized:"Authorized", warning:"Expiring Soon", "non-compliant":"Non-Compliant", "missing-docs":"Missing Docs" };

const CERT_TYPES = ["Insurance Certificate","Food Safety Permit","Forklift License","CPR / First Aid","Background Check","Site Access Pass","Driver's License","OSHA Certification","Electrical License","Plumbing License","Business License","Workers Comp Certificate","Other"];

const SAMPLE = [
  {id:"1",name:"Marcus Webb",    type:"Employee",   cert:"OSHA Certification",    issuer:"OSHA",       expiry:off(62),  missing:false,notes:""},
  {id:"2",name:"Marcus Webb",    type:"Employee",   cert:"Forklift License",      issuer:"NCCCO",      expiry:off(12),  missing:false,notes:""},
  {id:"3",name:"Sandra Reyes",   type:"Employee",   cert:"CPR / First Aid",       issuer:"Red Cross",  expiry:off(-5),  missing:false,notes:""},
  {id:"4",name:"Sandra Reyes",   type:"Employee",   cert:"Background Check",      issuer:"Sterling",   expiry:"",       missing:true, notes:"Requested — not yet received"},
  {id:"5",name:"Cleaning Co.",   type:"Vendor",     cert:"Insurance Certificate", issuer:"State Farm", expiry:off(6),   missing:false,notes:""},
  {id:"6",name:"Cleaning Co.",   type:"Vendor",     cert:"Business License",      issuer:"City Clerk", expiry:off(180), missing:false,notes:""},
  {id:"7",name:"ProServ HVAC",   type:"Vendor",     cert:"Insurance Certificate", issuer:"Employers",  expiry:off(3),   missing:false,notes:""},
  {id:"8",name:"Dana Flores",    type:"Contractor", cert:"Background Check",      issuer:"Sterling",   expiry:off(95),  missing:false,notes:""},
  {id:"9",name:"James Okoro",    type:"Employee",   cert:"Forklift License",      issuer:"NCCCO",      expiry:off(28),  missing:false,notes:""},
  {id:"10",name:"James Okoro",   type:"Employee",   cert:"OSHA Certification",    issuer:"OSHA",       expiry:"",       missing:true, notes:"Pending course completion"},
];

const blankForm = (pre={}) => ({name:"",type:"Employee",cert:"Insurance Certificate",issuer:"",expiry:"",missing:false,notes:"",...pre});

function Modal({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial?{...initial}:blankForm());
  const set = (k,v) => setF(x=>({...x,[k]:v}));
  const ok = f.name.trim() && f.cert && (f.missing||f.expiry);
  return (
    <div className="ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="mhead">
          <span className="mtitle">{initial?"Edit Record":"Add Certificate / License"}</span>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="fgrid">
            <div className="fg full">
              <label className="fl">Person or Company Name *</label>
              <input className="fi" placeholder="e.g. John Smith or Acme Corp" value={f.name} onChange={e=>set("name",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="fl">Record Type</label>
              <select className="fs" value={f.type} onChange={e=>set("type",e.target.value)}>
                {["Employee","Contractor","Vendor"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="fl">Certificate / License *</label>
              <select className="fs" value={f.cert} onChange={e=>set("cert",e.target.value)}>
                {CERT_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="fl">Issuing Authority</label>
              <input className="fi" placeholder="e.g. OSHA, Red Cross" value={f.issuer} onChange={e=>set("issuer",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="fl">Expiry Date {!f.missing&&"*"}</label>
              <input className="fi" type="date" value={f.expiry} onChange={e=>set("expiry",e.target.value)} disabled={f.missing} style={f.missing?{opacity:0.4}:{}}/>
            </div>
            <div className="fg full">
              <label className="mtoggle" onClick={()=>set("missing",!f.missing)}>
                <input type="checkbox" checked={f.missing} onChange={()=>{}} style={{accentColor:"var(--blue)"}}/>
                Document not yet submitted — mark as missing
              </label>
            </div>
            <div className="fg full">
              <label className="fl">Notes</label>
              <textarea className="fta" rows={2} placeholder="Optional notes…" value={f.notes} onChange={e=>set("notes",e.target.value)}/>
            </div>
          </div>
        </div>
        <div className="mfoot">
          <button className="btn bo" onClick={onClose}>Cancel</button>
          <button className="btn bp" onClick={()=>ok&&onSave(f)} style={{opacity:ok?1:0.4}}>
            {initial?"Save Changes":"Add Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [records, setRecords] = useState([]);
  const [loaded,  setLoaded]  = useState(false);
  const [tab,     setTab]     = useState("records");
  const [filter,  setFilter]  = useState("all");
  const [typef,   setTypef]   = useState("all");
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(null);
  const [open,    setOpen]    = useState({});

  useEffect(()=>{
    (async()=>{
      try { const r=await window.storage.get("cw3"); setRecords(r?.value?JSON.parse(r.value):SAMPLE); }
      catch { setRecords(SAMPLE); }
      setLoaded(true);
    })();
  },[]);
  useEffect(()=>{ if(loaded) window.storage.set("cw3",JSON.stringify(records)).catch(()=>{}); },[records,loaded]);

  const add  = f => { setRecords(r=>[...r,{...f,id:Date.now().toString()}]); setModal(null); };
  const edit = f => { setRecords(r=>r.map(x=>x.id===modal.data.id?{...f,id:x.id}:x)); setModal(null); };
  const del  = id => setRecords(r=>r.filter(x=>x.id!==id));

  const stats = useMemo(()=>({
    all:     records.length,
    valid:   records.filter(r=>!r.missing&&daysUntil(r.expiry)>30).length,
    expiring:records.filter(r=>{ const d=daysUntil(r.expiry); return !r.missing&&d!==null&&d>=0&&d<=30; }).length,
    expired: records.filter(r=>!r.missing&&daysUntil(r.expiry)<0).length,
  }),[records]);

  const alerts = useMemo(()=>
    records.map(r=>({...r,days:r.missing?null:daysUntil(r.expiry)}))
      .filter(r=>r.days===null||r.days<0||r.days<=30)
      .sort((a,b)=>(a.days??-9999)-(b.days??-9999))
  ,[records]);

  const filtered = useMemo(()=>
    records
      .filter(r=>{
        if(filter==="expiring"){const d=daysUntil(r.expiry);return !r.missing&&d!==null&&d>=0&&d<=30;}
        if(filter==="expired") {const d=daysUntil(r.expiry);return !r.missing&&d!==null&&d<0;}
        if(filter==="valid")   {const d=daysUntil(r.expiry);return !r.missing&&d!==null&&d>30;}
        if(filter==="missing") return r.missing;
        return true;
      })
      .filter(r=>typef==="all"||r.type===typef)
      .filter(r=>!search||[r.name,r.cert,r.issuer||""].some(s=>s.toLowerCase().includes(search.toLowerCase())))
      .sort((a,b)=>(a.missing?-9999:daysUntil(a.expiry))-(b.missing?-9999:daysUntil(b.expiry)))
  ,[records,filter,typef,search]);

  const people = useMemo(()=>{
    const m={};
    records.forEach(r=>{ if(!m[r.name])m[r.name]={name:r.name,type:r.type,certs:[]}; m[r.name].certs.push(r); });
    const order={authorized:3,warning:2,"non-compliant":0,"missing-docs":1};
    return Object.values(m).sort((a,b)=>order[personAuth(a.certs)]-order[personAuth(b.certs)]);
  },[records]);

  const alertGroups = [
    { label:"📄 Not Submitted / Missing",     fn:a=>a.days===null },
    { label:"🔴 Expired",                     fn:a=>a.days!==null&&a.days<0 },
    { label:"🟠 Expiring within 7 days",      fn:a=>a.days!==null&&a.days>=0&&a.days<=7 },
    { label:"🟡 Expiring within 14 days",     fn:a=>a.days!==null&&a.days>7&&a.days<=14 },
    { label:"🟡 Expiring within 30 days",     fn:a=>a.days!==null&&a.days>14&&a.days<=30 },
  ];

  if(!loaded) return <><style>{STYLE}</style><div className="app" style={{alignItems:"center",justifyContent:"center",color:"var(--text-soft)"}}>Loading…</div></>;

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">

        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-logo">📋</div>
            <div><div className="nav-name">CertWatch</div><div className="nav-tagline">Compliance Tracker</div></div>
          </div>
          <button className="btn bp" onClick={()=>setModal({mode:"add"})}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Record
          </button>
        </nav>

        <div className="page">
          <div className="page-header">
            <div>
              <div className="page-title">Compliance Dashboard</div>
              <div className="page-sub">Certificates, licenses and work authorizations — all in one place</div>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            {[
              {key:"all",     label:"Total Records",  val:stats.all,      cls:"cn-all",   desc:"All tracked documents"},
              {key:"valid",   label:"Fully Valid",    val:stats.valid,    cls:"cn-green", desc:"More than 30 days out"},
              {key:"expiring",label:"Expiring Soon",  val:stats.expiring, cls:"cn-amber", desc:"Within 30 days"},
              {key:"expired", label:"Expired",        val:stats.expired,  cls:"cn-red",   desc:"Immediate action needed"},
            ].map(s=>(
              <div key={s.key} className={`stat-card${filter===s.key&&tab==="records"?" active":""}`}
                onClick={()=>{setFilter(f=>f===s.key?"all":s.key);setTab("records");}}>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-num ${s.cls}`}>{s.val}</div>
                <div className="stat-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="tabs">
            {[
              {key:"records",label:"All Records"},
              {key:"people", label:"People & Authorization"},
              {key:"alerts", label:"Alerts", badge:alerts.length},
            ].map(t=>(
              <button key={t.key} className={`tab${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)}>
                {t.label}
                {t.badge>0 && <span className="tbadge">{t.badge}</span>}
              </button>
            ))}
          </div>

          {/* RECORDS */}
          {tab==="records" && <>
            <div className="toolbar">
              <div className="toolbar-left">
                <div className="sw">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input className="si" placeholder="Search name, cert, issuer…" value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <select className="fsel" value={typef} onChange={e=>setTypef(e.target.value)}>
                  <option value="all">All Types</option>
                  {["Employee","Contractor","Vendor"].map(t=><option key={t}>{t}</option>)}
                </select>
                {filter!=="all" && <button className="btn bg bsm" onClick={()=>setFilter("all")}>Clear filter ✕</button>}
              </div>
              <span className="rc">{filtered.length} record{filtered.length!==1?"s":""}</span>
            </div>
            <div className="tc">
              <div className="thead">
                {["Name","Certificate / License","Issuer","Expiry","Status",""].map((h,i)=>(
                  <div key={i} className="th" style={i===5?{textAlign:"right"}:{}}>{h}</div>
                ))}
              </div>
              <div>
                {filtered.length===0
                  ? <div className="empty"><div className="empty-icon">📄</div><h3>No records found</h3><p>{records.length===0?"Add your first certificate to get started.":"Try adjusting your search or filters."}</p></div>
                  : filtered.map(r=>(
                    <div key={r.id} className="trow">
                      <div className="td"><div className="tdn">{r.name}</div><div className="tdt">{r.type}</div></div>
                      <div className="td tdc">{r.cert}</div>
                      <div className="td tdi">{r.issuer||"—"}</div>
                      <div className="td tdd">{r.missing?"—":fmtDate(r.expiry)}</div>
                      <div className="td"><Pill dateStr={r.expiry} missing={r.missing}/></div>
                      <div className="td tda">
                        <button className="btn bo bsm" onClick={()=>setModal({mode:"edit",data:r})}>Edit</button>
                        <button className="btn bd bsm" onClick={()=>del(r.id)}>✕</button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </>}

          {/* PEOPLE */}
          {tab==="people" && (
            <div className="pg">
              {people.length===0
                ? <div className="empty"><div className="empty-icon">👥</div><h3>No people yet</h3><p>Add records to see authorization status here.</p></div>
                : people.map(p=>{
                  const auth=personAuth(p.certs);
                  const isOpen=open[p.name];
                  const init=p.name.split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase();
                  return (
                    <div key={p.name} className="pc">
                      <div className="pch" onClick={()=>setOpen(o=>({...o,[p.name]:!o[p.name]}))}>
                        <div className="pav">{init}</div>
                        <div className="pi">
                          <div className="pname">{p.name}</div>
                          <div className="pmeta">{p.type} · {p.certs.length} cert{p.certs.length!==1?"s":""}</div>
                        </div>
                        <div className="ps">
                          <span className={`ab ${auth}`}><span className="adot"/>{AUTH_LABELS[auth]}</span>
                          <span className={`chev${isOpen?" open":""}`}>▼</span>
                        </div>
                      </div>
                      {isOpen && <>
                        <div className="pccerts">
                          {p.certs.map(c=>(
                            <div key={c.id} className="pcrow">
                              <div className="pcc">{c.cert}</div>
                              <div className="pci">{c.issuer||"—"}</div>
                              <div className="pcd">{c.missing?"Not submitted":fmtDate(c.expiry)}</div>
                              <Pill dateStr={c.expiry} missing={c.missing}/>
                            </div>
                          ))}
                        </div>
                        <div className="pcactions">
                          <button className="btn bo bsm" onClick={()=>setModal({mode:"add",prefill:{name:p.name,type:p.type}})}>
                            + Add Certificate
                          </button>
                        </div>
                      </>}
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* ALERTS */}
          {tab==="alerts" && (
            alerts.length===0
              ? <div className="acard"><div className="no-alerts"><div style={{fontSize:36,marginBottom:10}}>✅</div><div style={{fontWeight:600,color:"var(--text-mid)",marginBottom:4}}>All clear</div><div>No certificates expiring soon or missing.</div></div></div>
              : alertGroups.map(g=>{
                  const items=alerts.filter(g.fn);
                  if(!items.length) return null;
                  return (
                    <div key={g.label} className="asec">
                      <div className="atitle">{g.label}</div>
                      <div className="acard">
                        {items.map(r=>(
                          <div key={r.id} className="aitem">
                            <div className="abody">
                              <div className="atxt">{r.name} — {r.cert}</div>
                              <div className="asub">
                                {r.type}{r.issuer?` · ${r.issuer}`:""}{r.notes?` · ${r.notes}`:""}
                                {!r.missing&&r.expiry?` · Expiry: ${fmtDate(r.expiry)}`:""}
                              </div>
                            </div>
                            <div className="aright">
                              <Pill dateStr={r.expiry} missing={r.missing}/>
                              <button className="btn bo bsm" onClick={()=>setModal({mode:"edit",data:r})}>
                                {r.missing?"Submit":"Renew"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
          )}

        </div>
      </div>

      {modal && (
        <Modal
          initial={modal.mode==="edit"?modal.data:(modal.prefill?blankForm(modal.prefill):null)}
          onSave={modal.mode==="edit"?edit:add}
          onClose={()=>setModal(null)}
        />
      )}
    </>
  );
}
