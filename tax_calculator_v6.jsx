// Copyright (c) 2026 Philip Schmiege (pschmiege). All rights reserved.
// Unauthorized copying, modification, or distribution of this software is prohibited.
import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid, Legend, Line } from "recharts";
import { Settings, Briefcase, Building2, CreditCard, TrendingUp, Home, DollarSign, LayoutList, Landmark, BarChart2, Telescope, CheckCircle, AlertTriangle, PiggyBank } from "lucide-react";

const TAX_DATA = {
  2024: {
    std_ded: 14600, medicare: 0.0145, fica: 0.062, fica_base: 168600,
    trs_emp: 0.0825, trs_utsw: 0.0825, orp_emp: 0.0665, orp_utsw: 0.085,
    lim_401k: 23000, lim_ira: 7000,
    fed: [[0,0.10,0],[11600,0.12,1160],[47150,0.22,5426],[100525,0.24,17168.5],[191950,0.32,39110.5],[243725,0.35,55678.5],[609350,0.37,183647.25]],
    states: {
      Texas: {ded:0,b:[]}, Florida: {ded:0,b:[]}, Nevada: {ded:0,b:[]}, Washington: {ded:0,b:[]},
      "New York": {ded:8000,b:[[0,0.04,0],[8500,0.045,340],[11700,0.0525,484],[13900,0.055,600],[80650,0.06,4271],[215400,0.0685,12356],[1077550,0.0965,71413],[5000000,0.103,449929],[25000000,0.109,2509929]]},
      Hawaii: {ded:4400,b:[[0,0.014,0],[2400,0.032,33.6],[4800,0.055,110.4],[9600,0.064,374.4],[14400,0.068,681.6],[19200,0.072,1008],[24000,0.076,1353.6],[36000,0.079,2265.6],[48000,0.0825,3213.6],[150000,0.09,11628.6],[175000,0.1,13878.6],[200000,0.11,16378.6]]},
    }
  },
  2025: {
    std_ded: 15000, medicare: 0.0145, fica: 0.062, fica_base: 176100,
    trs_emp: 0.0825, trs_utsw: 0.0825, orp_emp: 0.0665, orp_utsw: 0.085,
    lim_401k: 23500, lim_ira: 7000,
    fed: [[0,0.10,0],[11925,0.12,1192.5],[48475,0.22,5578.5],[103350,0.24,17651],[197300,0.32,40199],[250525,0.35,57231],[626350,0.37,188769.75]],
    states: {
      Texas: {ded:0,b:[]}, Florida: {ded:0,b:[]}, Nevada: {ded:0,b:[]}, Washington: {ded:0,b:[]},
      "New York": {ded:8000,b:[[0,0.04,0],[8500,0.045,340],[11700,0.0525,484],[13900,0.055,600],[80650,0.06,4271],[215400,0.0685,12356],[1077550,0.0965,71413],[5000000,0.103,449929],[25000000,0.109,2509929]]},
      California: {ded:5540,b:[[0,0.01,0],[10756,0.02,108],[25499,0.04,402],[40245,0.06,992],[55866,0.08,1930],[70606,0.093,3109],[360659,0.103,30084],[432787,0.113,37513],[721314,0.123,70116]]},
      Massachusetts: {ded:4400,b:[[0,0.05,0],[1000000,0.09,50000]]},
      Hawaii: {ded:4400,b:[[0,0.01,0],[2400,0.032,24],[4800,0.055,100.8],[9600,0.064,364.8],[14400,0.068,672],[19200,0.072,998.4],[24000,0.076,1344],[36000,0.079,2256],[48000,0.0825,3204],[150000,0.09,11619],[175000,0.1,13869],[200000,0.11,16369]]},
    }
  },
  2026: {
    std_ded: 16100, medicare: 0.0145, fica: 0.062, fica_base: 184500,
    trs_emp: 0.0825, trs_utsw: 0.0825, orp_emp: 0.0665, orp_utsw: 0.085,
    lim_401k: 24500, lim_ira: 7500,
    fed: [[0,0.10,0],[12400,0.12,1240],[50400,0.22,5800],[105700,0.24,17966],[201775,0.32,41024],[256225,0.35,58448],[640600,0.37,192979.25]],
    states: {
      Texas: {ded:0,b:[]}, Florida: {ded:0,b:[]}, Nevada: {ded:0,b:[]}, Washington: {ded:0,b:[]},
      "New York": {ded:8000,b:[[0,0.04,0],[8500,0.045,340],[11700,0.0525,484],[13900,0.055,600],[80650,0.06,4271],[215400,0.0685,12356],[1077550,0.0965,71413],[5000000,0.103,449929],[25000000,0.109,2509929]]},
      California: {ded:5540,b:[[0,0.01,0],[10756,0.02,108],[25499,0.04,402],[40245,0.06,992],[55866,0.08,1930],[70606,0.093,3109],[360659,0.103,30084],[432787,0.113,37513],[721314,0.123,70116]]},
      Massachusetts: {ded:4400,b:[[0,0.05,0],[1000000,0.09,50000]]},
      Hawaii: {ded:4400,b:[[0,0.01,0],[2400,0.032,24],[4800,0.055,100.8],[9600,0.064,364.8],[14400,0.068,672],[19200,0.072,998.4],[24000,0.076,1344],[36000,0.079,2256],[48000,0.0825,3204],[150000,0.09,11619],[175000,0.1,13869],[200000,0.11,16369]]},
    }
  }
};

const FREQS = { Annually:1, Monthly:12, Semimonthly:24, Biweekly:26, Weekly:52 };
const PAY_FREQS = { "Monthly (12)":12, "Biweekly (26)":26, "Semimonthly (24)":24, "Weekly (52)":52 };

function ann(amt, freq, ppY) {
  if (freq === "Per Paycheck") return Number(amt) * ppY;
  return Number(amt) * (FREQS[freq] || 1);
}

function bracketTax(income, brackets) {
  if (!brackets || !brackets.length || income <= 0) return [0, brackets && brackets[0] ? brackets[0][1] : 0];
  let tax = 0, marg = brackets[0][1];
  for (let i = 0; i < brackets.length; i++) {
    const [floor, rate, offset] = brackets[i];
    if (income <= floor) break;
    marg = rate;
    const next = i + 1 < brackets.length ? brackets[i+1][0] : Infinity;
    if (income <= next) { tax = offset + (income - floor) * rate; break; }
    if (i === brackets.length - 1) tax = offset + (income - floor) * rate;
  }
  return [Math.max(0, tax), marg];
}

function calcAll(s) {
  const td = TAX_DATA[s.year];
  const st = td.states[s.state] || {ded:0,b:[]};
  const ppY = s.ppY;

  const utswEmpPct = s.plan === "TRS" ? td.trs_emp : td.orp_emp;
  const utswErPct  = s.plan === "TRS" ? td.trs_utsw : td.orp_utsw;
  const utswEmp = (s.pGross + s.pLon) * utswEmpPct;
  const utswEr  = s.pGross * utswErPct;

  const preTaxRet = s.trad401k + s.trad457b + s.tradIra + utswEmp + s.workOther;
  const preTaxExp = s.medical + s.dental + s.vision + s.parking + s.fsa + s.pretaxOther;
  const postRet   = s.roth401k + s.roth457b + s.rothIra;
  const postInv   = s.invest + s.posttaxOther;
  const living    = s.rent + s.groceries + s.carIns + s.rentIns + s.internet + s.elec + s.util + s.livOther + (s.customLivTotal||0);

  // ── Primary (taxes calculated independently) ──
  const pAgi = s.pGross + s.pLon - preTaxRet - preTaxExp;
  const pFedTaxable = Math.max(0, pAgi - td.std_ded);
  const [pFedTax, pMargFed] = bracketTax(pFedTaxable, td.fed);
  const pFica = Math.min(s.pGross + s.pLon, td.fica_base) * td.fica;
  const pMediWages = s.pGross + s.pLon;
  const pMedi = pMediWages * td.medicare + Math.max(0, pMediWages - 200000) * 0.009; // +0.9% above $200k
  // addWith is additional withholding — this is extra money withheld toward tax bill
  const pWithheld = pFedTax + pFica + pMedi + s.addWith; // total actually withheld from paychecks
  const [pStateTax, pMargState] = bracketTax(Math.max(0, pAgi - st.ded), st.b);
  const pTotTax = pWithheld + pStateTax;
  const pNet = s.pGross + s.pLon - pTotTax - preTaxExp - preTaxRet;
  const pFinal = pNet - postRet - postInv - living;

  // ── Secondary (taxes calculated independently) ──
  const sG = s.hasSec ? s.sGross : 0;
  const sFedTaxable = Math.max(0, sG - td.std_ded);
  const [sFedTax, sMargFed] = bracketTax(sFedTaxable, td.fed);
  const sFica = Math.min(sG, td.fica_base) * td.fica;
  const sMedi = sG * td.medicare + Math.max(0, sG - 200000) * 0.009; // +0.9% above $200k
  const sTotFedWithheld = sFedTax + sFica + sMedi;
  const [sStateTax] = bracketTax(Math.max(0, sG - st.ded), st.b);
  const sTotTax = sTotFedWithheld + sStateTax;
  const sFinal = sG - sTotTax;

  // ── Combined ──
  // Total withheld across both jobs (what actually came out of paychecks)
  const cTotFedWithheld = pFedTax + sFedTax + pFica + sFica + pMedi + sMedi + s.addWith;
  const cStateTaxWithheld = pStateTax + sStateTax;
  const cTotWithheld = cTotFedWithheld + cStateTaxWithheld;

  // What the IRS actually OWES on combined income (filed as single, taxes computed on total AGI)
  // Per your Excel: "taxes calculated separately" means primary and secondary taxed independently
  // But for the OWED/REFUND calculation, we compute what would actually be owed if filing together
  // (since a second job can push you into higher brackets)
  const cAgi = pAgi + sG;
  const cFedTaxable = Math.max(0, cAgi - td.std_ded);
  const [cFedTaxOwed] = bracketTax(cFedTaxable, td.fed); // actual federal income tax owed on combined income
  const cFicaOwed = Math.min(s.pGross + s.pLon + sG, td.fica_base) * td.fica; // FICA capped across both
  const cMediOwed = (s.pGross + s.pLon + sG) * td.medicare + Math.max(0, s.pGross + s.pLon + sG - 200000) * 0.009; // +0.9% above $200k on combined wages
  const [cStateTaxOwed] = bracketTax(Math.max(0, cAgi - st.ded), st.b);
  const cTotOwed = cFedTaxOwed + cFicaOwed + cMediOwed + cStateTaxOwed;

  // Owed (+) = you owe more at filing | Refund (-) = you get money back
  // Fed income tax: compare what was withheld vs actual owed
  const fedOwedVsWithheld = cFedTaxOwed - (pFedTax + sFedTax); // delta on just income tax
  const addlWithheldTowardBill = s.addWith; // extra withholding intentionally applied
  const fedTaxBalance = fedOwedVsWithheld - addlWithheldTowardBill; // negative = refund, positive = owe
  // State: same logic
  const stateTaxBalance = cStateTaxOwed - cStateTaxWithheld;
  const totalTaxBalance = fedTaxBalance + stateTaxBalance; // + = owe at filing, - = refund

  // For display: "taxes separately" means each job withheld at its own rate
  const cGross = s.pGross + s.pLon + sG;
  const cTotTax = pTotTax + sTotTax; // total money that left paychecks
  const cNet = pNet + sFinal;
  const cFinal = cNet - postRet - postInv - living;

  const pc = v => ppY > 0 ? v / ppY : 0;
  const contribOk = s.trad401k + s.trad457b <= td.lim_401k && s.roth401k + s.roth457b <= td.lim_401k && s.tradIra + s.rothIra <= td.lim_ira;

  // Suggested additional withholding per paycheck to break even
  const addlNeededPerCheck = fedTaxBalance > 0 ? fedTaxBalance / ppY : 0;

  return {
    pGross:s.pGross, pLon:s.pLon, pAgi, pFedTaxable, preTaxRet, utswEmp, utswEr, preTaxExp,
    pFedTax, pFica, pMedi, pWithheld, pMargFed, pEffFed: pAgi>0?pFedTax/pAgi:0,
    pStateTax, pMargState, pTotTax, pEffTotal: pAgi>0?pTotTax/pAgi:0,
    pNet, postRet, postInv, living, pFinal,
    sGross:sG, sFedTaxable, sFedTax, sFica, sMedi, sTotFedWithheld, sMargFed,
    sEffFed: sG>0?sFedTax/sG:0, sStateTax, sTotTax, sFinal,
    cGross, cAgi, cFedTaxable, cFedTaxOwed, cFicaOwed, cMediOwed,
    cTotFedWithheld, cStateTaxOwed, cTotWithheld, cTotOwed,
    fedTaxBalance, stateTaxBalance, totalTaxBalance, addlNeededPerCheck,
    cTotTax, cNet, cFinal,
    cEffTotal: cAgi>0?cTotOwed/cAgi:0,
    totalRet: preTaxRet + postRet,
    totalSaved: preTaxRet + postRet + s.invest,
    addWith: s.addWith, contribOk,
    pc_gross:pc(s.pGross+s.pLon), pc_preTaxRet:pc(preTaxRet), pc_preTaxExp:pc(preTaxExp),
    pc_fedTax:pc(pFedTax), pc_fica:pc(pFica), pc_medi:pc(pMedi),
    pc_withheld:pc(pWithheld), pc_stateTax:pc(pStateTax), pc_totTax:pc(pTotTax),
    pc_net:pc(pNet), pc_postRet:pc(postRet), pc_postInv:pc(postInv),
    pc_living:pc(living), pc_final:pc(pFinal),
    inp: s,
  };
}

const fm = v => { const n = Math.round(Math.abs(v)); return (v < 0 ? "-$" : "$") + n.toLocaleString(); };
const fp = v => (v * 100).toFixed(1) + "%";

const BG="#0f1117",CARD="#161b27",BORDER="#1e2a3a",ACCENT="#818cf8",GREEN="#34d399",RED="#f87171",MUTED="#64748b",TEXT="#e2e8f0",ORANGE="#fb923c",PURPLE="#a78bfa",TEAL="#2dd4bf",YELLOW="#fcd34d";
const inp_style={background:BG,border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 8px",color:TEXT,fontSize:12,width:"100%",boxSizing:"border-box"};
const sel_style={background:BG,border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 6px",color:MUTED,fontSize:11,cursor:"pointer"};
const card_style={background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:14};

function FInput({label,val,freq,setVal,setFreq,ppY}) {
  const opts=["Annually","Monthly","Semimonthly","Biweekly","Weekly"];
  return (
    <div style={{marginBottom:8}}>
      {label&&<div style={{fontSize:10,color:MUTED,marginBottom:2}}>{label}</div>}
      <div style={{display:"flex",gap:4}}>
        <input type="number" min={0} value={val} onChange={e=>setVal(Number(e.target.value))} style={{...inp_style,flex:1}}/>
        <select value={freq} onChange={e=>setFreq(e.target.value)} style={sel_style}>
          <option value="" disabled>Frequency</option>
          {opts.map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}
function SField({label,val,onChange,opts}) {
  return (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:10,color:MUTED,marginBottom:2}}>{label}</div>
      <select value={val} onChange={e=>onChange(e.target.value)} style={{...sel_style,width:"100%",color:TEXT}}>
        {opts.map(o=><option key={String(o)}>{o}</option>)}
      </select>
    </div>
  );
}
function Met({label,val,color,sub}) {
  return (
    <div style={{...card_style,textAlign:"center",flex:1}}>
      <div style={{fontSize:10,color:MUTED,marginBottom:3}}>{label}</div>
      <div style={{fontSize:18,fontWeight:700,color:color||TEXT,fontFamily:"monospace"}}>{val}</div>
      {sub&&<div style={{fontSize:9,color:MUTED,marginTop:2}}>{sub}</div>}
    </div>
  );
}
function RRow({label,val,bold,color,sub}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:`1px solid ${BORDER}33`,paddingLeft:sub?10:0}}>
      <span style={{fontSize:11,color:bold?TEXT:MUTED}}>{label}</span>
      <span style={{fontSize:11,fontFamily:"monospace",fontWeight:bold?700:400,color:color||(bold?TEXT:MUTED)}}>{val}</span>
    </div>
  );
}
function SHead({label}) {
  return <div style={{fontSize:9,color:ACCENT,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"6px 0 2px",marginTop:4,borderBottom:`1px solid ${ACCENT}44`}}>{label}</div>;
}
function TabBtn({id,label,icon,active,onClick}) {
  return <button onClick={()=>onClick(id)} style={{padding:"6px 12px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,background:active?ACCENT:"transparent",color:active?"white":MUTED,display:"flex",alignItems:"center",gap:5}}>{icon}{label}</button>;
}
function SLabel({children}) {
  return <div style={{fontSize:10,color:ACCENT,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",margin:"12px 0 6px",paddingBottom:3,borderBottom:`1px solid ${ACCENT}33`}}>{children}</div>;
}

function calcRetScenario({tradC, rothC, companyAmt, prevTrad, prevRoth, fvFactor, margRate, retEffRate, ltcgRate}) {
  const tradFV    = (tradC + companyAmt) * fvFactor + prevTrad * fvFactor;
  const rothFV    = rothC * fvFactor + prevRoth * fvFactor;
  const taxSavAmt = tradC * margRate;
  const brokFV    = taxSavAmt * fvFactor;
  const brokGain  = Math.max(0, brokFV - taxSavAmt);
  const brokTax   = brokGain * ltcgRate;
  const brokNet   = brokFV - brokTax;
  const tradTax   = tradFV * retEffRate;
  const totalNet  = (tradFV - tradTax) + rothFV + brokNet;
  return { tradFV, rothFV, brokFV, brokNet, brokTax, tradTax, totalNet, monthlyNet: totalNet / 12, taxSavAmt };
}

export default function App() {
  const sv = (() => { try { return JSON.parse(localStorage.getItem('taxCalcSettings') || '{}'); } catch { return {}; } })();
  const [tab,setTab]=useState(sv.tab??"breakdown");
  const [year,setYear]=useState(sv.year??2026);
  const [state,setState]=useState(sv.state??"Texas");
  const [plan,setPlan]=useState(sv.plan??"TRS");
  const [hasSec,setHasSec]=useState(sv.hasSec??false);
  const [ppFreq,setPpFreq]=useState(sv.ppFreq??"Monthly (12)");
  const mk=(k,iv,ifr)=>{const[v,svv]=useState(sv[k+'V']??iv);const[f,sf]=useState(sv[k+'F']??ifr);return[v,svv,f,sf];};
  const[pGrossV,setPGrossV,pGrossF,setPGrossF]=mk('pGross',0,"Annually");
  const[pLonV,setPLonV,pLonF,setPLonF]=mk('pLon',0,"Annually");
  const[addWithV,setAddWithV,addWithF,setAddWithF]=mk('addWith',0,"Monthly");
  const[sGrossV,setSGrossV,sGrossF,setSGrossF]=mk('sGross',0,"Annually");
  const[wOtherV,setWOtherV,wOtherF,setWOtherF]=mk('wOther',0,"Monthly");
  const[t401V,setT401V,t401F,setT401F]=mk('t401',0,"Monthly");
  const[t457V,setT457V,t457F,setT457F]=mk('t457',0,"Monthly");
  const[tIraV,setTIraV,tIraF,setTIraF]=mk('tIra',0,"Annually");
  const[medV,setMedV,medF,setMedF]=mk('med',0,"Monthly");
  const[denV,setDenV,denF,setDenF]=mk('den',0,"Monthly");
  const[visV,setVisV,visF,setVisF]=mk('vis',0,"Monthly");
  const[parkV,setParkV,parkF,setParkF]=mk('park',0,"Monthly");
  const[fsaV,setFsaV,fsaF,setFsaF]=mk('fsa',0,"Annually");
  const[ptOV,setPtOV,ptOF,setPtOF]=mk('ptO',0,"Monthly");
  const[r401V,setR401V,r401F,setR401F]=mk('r401',0,"Monthly");
  const[r457V,setR457V,r457F,setR457F]=mk('r457',0,"Monthly");
  const[rIraV,setRIraV,rIraF,setRIraF]=mk('rIra',0,"Annually");
  const[invV,setInvV,invF,setInvF]=mk('inv',0,"Monthly");
  const[ptO2V,setPtO2V,ptO2F,setPtO2F]=mk('ptO2',0,"Monthly");
  const[rentV,setRentV,rentF,setRentF]=mk('rent',0,"Monthly");
  const[grocV,setGrocV,grocF,setGrocF]=mk('groc',0,"Monthly");
  const[carIV,setCarIV,carIF,setCarIF]=mk('carI',0,"Monthly");
  const[rIV,setRIV,rIF,setRIF]=mk('rI',0,"Monthly");
  const[inetV,setInetV,inetF,setInetF]=mk('inet',0,"Monthly");
  const[elecV,setElecV,elecF,setElecF]=mk('elec',0,"Monthly");
  const[utilV,setUtilV,utilF,setUtilF]=mk('util',0,"Monthly");
  const[livOV,setLivOV,livOF,setLivOF]=mk('livO',0,"Monthly");

  // Net worth
  const[nwCheck,setNwCheck]=useState(sv.nwCheck??0);const[nwHys,setNwHys]=useState(sv.nwHys??0);
  const[nw401,setNw401]=useState(sv.nw401??0);const[nw457,setNw457]=useState(sv.nw457??0);
  const[nwIra,setNwIra]=useState(sv.nwIra??0);const[nwBrok,setNwBrok]=useState(sv.nwBrok??0);
  const[nwHome,setNwHome]=useState(sv.nwHome??0);const[nwCar,setNwCar]=useState(sv.nwCar??0);
  const[nwOA,setNwOA]=useState(sv.nwOA??0);
  const[nwMort,setNwMort]=useState(sv.nwMort??0);const[nwCL,setNwCL]=useState(sv.nwCL??0);
  const[nwStu,setNwStu]=useState(sv.nwStu??0);const[nwCC,setNwCC]=useState(sv.nwCC??0);
  const[nwOD,setNwOD]=useState(sv.nwOD??0);
  const[pYears,setPYears]=useState(sv.pYears??25);const[pRate,setPRate]=useState(sv.pRate??7);const[initBal,setInitBal]=useState(sv.initBal??0);

  // Pension
  const[trsSals,setTrsSals]=useState(sv.trsSals??[0,0,0,0,0]);
  const[trsYears,setTrsYears]=useState(sv.trsYears??0);const[trsMult,setTrsMult]=useState(sv.trsMult??2.3);

  // Retirement predictor
  const[retYear,setRetYear]=useState(sv.retYear??2055);
  const[retAnnRate,setRetAnnRate]=useState(sv.retAnnRate??9);
  const[retEffTax,setRetEffTax]=useState(sv.retEffTax??18);
  const[retLtcg,setRetLtcg]=useState(sv.retLtcg??15);
  const[retCompRate,setRetCompRate]=useState(sv.retCompRate??0);
  const[prevTradBal,setPrevTradBal]=useState(sv.prevTradBal??0);
  const[prevRothBal,setPrevRothBal]=useState(sv.prevRothBal??0);
  const[customSplitPct,setCustomSplitPct]=useState(sv.customSplitPct??50);
  const[nwYears,setNwYears]=useState(sv.nwYears??25);
  const[customLiving,setCustomLiving]=useState(sv.customLiving??[]);

  // Persist all settings to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('taxCalcSettings', JSON.stringify({
        tab,year,state,plan,hasSec,ppFreq,
        pGrossV,pGrossF,pLonV,pLonF,addWithV,addWithF,sGrossV,sGrossF,wOtherV,wOtherF,
        t401V,t401F,t457V,t457F,tIraV,tIraF,medV,medF,denV,denF,visV,visF,
        parkV,parkF,fsaV,fsaF,ptOV,ptOF,r401V,r401F,r457V,r457F,rIraV,rIraF,
        invV,invF,ptO2V,ptO2F,rentV,rentF,grocV,grocF,carIV,carIF,rIV,rIF,
        inetV,inetF,elecV,elecF,utilV,utilF,livOV,livOF,
        nwCheck,nwHys,nw401,nw457,nwIra,nwBrok,nwHome,nwCar,nwOA,
        nwMort,nwCL,nwStu,nwCC,nwOD,pYears,pRate,initBal,
        trsSals,trsYears,trsMult,retYear,retAnnRate,retEffTax,retLtcg,retCompRate,
        prevTradBal,prevRothBal,customSplitPct,nwYears,customLiving,
      }));
    } catch {}
  },[tab,year,state,plan,hasSec,ppFreq,pGrossV,pGrossF,pLonV,pLonF,addWithV,addWithF,sGrossV,sGrossF,wOtherV,wOtherF,t401V,t401F,t457V,t457F,tIraV,tIraF,medV,medF,denV,denF,visV,visF,parkV,parkF,fsaV,fsaF,ptOV,ptOF,r401V,r401F,r457V,r457F,rIraV,rIraF,invV,invF,ptO2V,ptO2F,rentV,rentF,grocV,grocF,carIV,carIF,rIV,rIF,inetV,inetF,elecV,elecF,utilV,utilF,livOV,livOF,nwCheck,nwHys,nw401,nw457,nwIra,nwBrok,nwHome,nwCar,nwOA,nwMort,nwCL,nwStu,nwCC,nwOD,pYears,pRate,initBal,trsSals,trsYears,trsMult,retYear,retAnnRate,retEffTax,retLtcg,retCompRate,prevTradBal,prevRothBal,customSplitPct,nwYears,customLiving]);

  const ppY=PAY_FREQS[ppFreq]||12;
  const td=TAX_DATA[year];
  const states=Object.keys(td.states);
  const customLivTotal=useMemo(()=>customLiving.reduce((s,e)=>s+ann(e.val||0,e.freq,ppY),0),[customLiving,ppY]);

  const scenario=useMemo(()=>({
    year,state,plan,hasSec,ppY,
    pGross:ann(pGrossV,pGrossF,ppY),pLon:ann(pLonV,pLonF,ppY),
    addWith:ann(addWithV,addWithF,ppY),sGross:ann(sGrossV,sGrossF,ppY),
    workOther:ann(wOtherV,wOtherF,ppY),
    trad401k:ann(t401V,t401F,ppY),trad457b:ann(t457V,t457F,ppY),tradIra:ann(tIraV,tIraF,ppY),
    medical:ann(medV,medF,ppY),dental:ann(denV,denF,ppY),vision:ann(visV,visF,ppY),
    parking:ann(parkV,parkF,ppY),fsa:ann(fsaV,fsaF,ppY),pretaxOther:ann(ptOV,ptOF,ppY),
    roth401k:ann(r401V,r401F,ppY),roth457b:ann(r457V,r457F,ppY),rothIra:ann(rIraV,rIraF,ppY),
    invest:ann(invV,invF,ppY),posttaxOther:ann(ptO2V,ptO2F,ppY),
    rent:ann(rentV,rentF,ppY),groceries:ann(grocV,grocF,ppY),
    carIns:ann(carIV,carIF,ppY),rentIns:ann(rIV,rIF,ppY),
    internet:ann(inetV,inetF,ppY),elec:ann(elecV,elecF,ppY),
    util:ann(utilV,utilF,ppY),livOther:ann(livOV,livOF,ppY),
    customLivTotal,
  }),[year,state,plan,hasSec,ppY,pGrossV,pGrossF,pLonV,pLonF,addWithV,addWithF,sGrossV,sGrossF,wOtherV,wOtherF,t401V,t401F,t457V,t457F,tIraV,tIraF,medV,medF,denV,denF,visV,visF,parkV,parkF,fsaV,fsaF,ptOV,ptOF,r401V,r401F,r457V,r457F,rIraV,rIraF,invV,invF,ptO2V,ptO2F,rentV,rentF,grocV,grocF,carIV,carIF,rIV,rIF,inetV,inetF,elecV,elecF,utilV,utilF,livOV,livOF,customLivTotal]);

  const R=useMemo(()=>calcAll(scenario),[scenario]);

  const projData=useMemo(()=>{
    let bal=initBal,balH=initBal,balL=initBal;const rows=[];
    for(let y=1;y<=pYears;y++){
      bal=bal*(1+pRate/100)+R.totalSaved;
      balH=balH*(1+(pRate+3)/100)+R.totalSaved;
      balL=balL*(1+Math.max(0.5,pRate-3)/100)+R.totalSaved;
      rows.push({y,bal:Math.round(bal),contrib:Math.round(initBal+R.totalSaved*y),balH:Math.round(balH),balL:Math.round(balL)});
    }
    return rows;
  },[initBal,pYears,pRate,R.totalSaved]);

  const totalAssets=nwCheck+nwHys+nw401+nw457+nwIra+nwBrok+nwHome+nwCar+nwOA;
  const totalLiab=nwMort+nwCL+nwStu+nwCC+nwOD;
  const netWorth=totalAssets-totalLiab;

  const nwProjData=useMemo(()=>{
    let bal=netWorth,balH=netWorth,balL=netWorth;const rows=[];
    for(let y=1;y<=nwYears;y++){
      bal=bal*(1+pRate/100)+R.totalSaved;
      balH=balH*(1+(pRate+3)/100)+R.totalSaved;
      balL=balL*(1+Math.max(0.5,pRate-3)/100)+R.totalSaved;
      rows.push({y,nw:Math.round(bal),nwH:Math.round(balH),nwL:Math.round(balL)});
    }
    return rows;
  },[netWorth,pRate,R.totalSaved,nwYears]);

  const retPredData=useMemo(()=>{
    const currentYear=new Date().getFullYear();
    const n=Math.max(0,retYear-currentYear);
    const r=retAnnRate/100;
    const fvFactor=n>0?Math.pow(1+r,n):1;
    const margRate=R.pMargFed;
    const retEffRate=retEffTax/100;
    const ltcgRate=retLtcg/100;
    const companyAmt=R.pGross*(retCompRate/100);
    const tradAnnual=R.preTaxRet;
    const rothAnnual=R.postRet;
    const total=tradAnnual+rothAnnual;
    const shared={companyAmt,prevTrad:prevTradBal,prevRoth:prevRothBal,fvFactor,margRate,retEffRate,ltcgRate};
    const customTradAnnual=total*(customSplitPct/100);
    const customRothAnnual=total*(1-customSplitPct/100);
    return {
      allTrad:calcRetScenario({tradC:total,rothC:0,...shared}),
      allRoth:calcRetScenario({tradC:0,rothC:total,...shared}),
      split:calcRetScenario({tradC:tradAnnual,rothC:rothAnnual,...shared}),
      customSplit:calcRetScenario({tradC:customTradAnnual,rothC:customRothAnnual,...shared}),
      n,margRate,fvFactor,companyAmt,tradAnnual,rothAnnual,total,customTradAnnual,customRothAnnual,
    };
  },[retYear,retAnnRate,retEffTax,retLtcg,retCompRate,prevTradBal,prevRothBal,R.pMargFed,R.preTaxRet,R.postRet,R.pGross,customSplitPct]);

  // Pension calc
  const trsAvg5 = trsSals.reduce((a,b)=>a+Number(b),0)/5;
  const trsAnnuity = trsAvg5 * (trsYears * trsMult / 100);

  const wfData=[
    {n:"Gross",v:R.cGross,fill:GREEN},{n:"−PreTax Ret",v:R.preTaxRet,fill:PURPLE},
    {n:"−PreTax Exp",v:R.preTaxExp,fill:ORANGE},{n:"−Taxes",v:R.cTotTax,fill:RED},
    {n:"−Post Ret",v:R.postRet,fill:ACCENT},{n:"−Invest",v:R.postInv,fill:TEAL},
    {n:"−Living",v:R.living,fill:"#60a5fa"},{n:"Remaining",v:Math.max(0,R.cFinal),fill:GREEN},
  ];
  const breakdownPie=[
    {n:"Remaining",v:Math.max(0,R.cFinal),fill:GREEN},{n:"Taxes",v:R.cTotTax,fill:RED},
    {n:"Pre-Tax Ret",v:R.preTaxRet,fill:PURPLE},{n:"Pre-Tax Exp",v:R.preTaxExp,fill:ORANGE},
    {n:"Post Ret",v:R.postRet,fill:ACCENT},{n:"Investments",v:R.postInv,fill:TEAL},
    {n:"Living",v:R.living,fill:"#60a5fa"},
  ].filter(d=>d.v>0);
  const donutData=[
    {n:"Remaining",v:Math.max(0,R.pc_final),fill:GREEN},{n:"Taxes",v:R.pc_totTax,fill:RED},
    {n:"Pre-Tax Ret",v:R.pc_preTaxRet,fill:PURPLE},{n:"Pre-Tax Exp",v:R.pc_preTaxExp,fill:ORANGE},
    {n:"Post Ret",v:R.pc_postRet,fill:ACCENT},{n:"Investments",v:R.pc_postInv,fill:TEAL},
    {n:"Living",v:R.pc_living,fill:"#60a5fa"},
  ].filter(d=>d.v>0);
  const tt={contentStyle:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,color:"#ffffff"},labelStyle:{color:"#ffffff"},itemStyle:{color:"#ffffff"},formatter:(v,n)=>[fm(Math.abs(v)),n||""]};

  const taxBalanceColor = R.totalTaxBalance > 200 ? RED : R.totalTaxBalance < -200 ? GREEN : YELLOW;
  const taxBalanceLabel = R.totalTaxBalance > 200 ? `Owe ${fm(R.totalTaxBalance)}` : R.totalTaxBalance < -200 ? `Refund ${fm(Math.abs(R.totalTaxBalance))}` : "≈ Break Even";

  return (
    <div style={{display:"flex",minHeight:"100vh",background:BG,color:TEXT,fontFamily:"system-ui,sans-serif",fontSize:13}}>

      {/* ── SIDEBAR ── */}
      <div style={{width:240,minWidth:240,background:CARD,borderRight:`1px solid ${BORDER}`,overflowY:"auto",padding:"14px 12px",flexShrink:0}}>
        <div style={{fontSize:15,fontWeight:800,color:ACCENT,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Settings size={15}/>Settings</div>
        <SLabel>General</SLabel>
        <SField label="Tax Year" val={year} onChange={v=>{setYear(+v);setState(Object.keys(TAX_DATA[+v].states)[0]);}} opts={[2026,2025,2024]}/>
        <SField label="State" val={state} onChange={setState} opts={states}/>
        <SLabel><Briefcase size={10} style={{marginRight:4}}/>Primary Income</SLabel>
        <FInput label="Gross Income" val={pGrossV} freq={pGrossF} setVal={setPGrossV} setFreq={setPGrossF}/>
        <FInput label="Longevity Pay" val={pLonV} freq={pLonF} setVal={setPLonV} setFreq={setPLonF}/>
        <SField label="Pay Frequency" val={ppFreq} onChange={setPpFreq} opts={Object.keys(PAY_FREQS)}/>
        <FInput label="Additional Federal Withholding" val={addWithV} freq={addWithF} setVal={setAddWithV} setFreq={setAddWithF} ppY={ppY}/>
        <SField label="UTSW Plan" val={plan} onChange={setPlan} opts={["TRS","ORP"]}/>
        <SLabel><Briefcase size={10} style={{marginRight:4}}/>Secondary Income</SLabel>
        <label style={{display:"flex",gap:6,alignItems:"center",fontSize:11,color:MUTED,marginBottom:6,cursor:"pointer"}}>
          <input type="checkbox" checked={hasSec} onChange={e=>setHasSec(e.target.checked)}/> Have secondary income
        </label>
        {hasSec&&<FInput label="Secondary Gross" val={sGrossV} freq={sGrossF} setVal={setSGrossV} setFreq={setSGrossF}/>}
        <SLabel><Building2 size={10} style={{marginRight:4}}/>Pre-Tax Retirement</SLabel>
        <FInput label="Other Work Contributions" val={wOtherV} freq={wOtherF} setVal={setWOtherV} setFreq={setWOtherF} ppY={ppY}/>
        <FInput label={`Trad 401k/403b (lim $${td.lim_401k.toLocaleString()})`} val={t401V} freq={t401F} setVal={setT401V} setFreq={setT401F} ppY={ppY}/>
        <FInput label={`Trad 457b (lim $${td.lim_401k.toLocaleString()})`} val={t457V} freq={t457F} setVal={setT457V} setFreq={setT457F} ppY={ppY}/>
        <FInput label={`Trad IRA (lim $${td.lim_ira.toLocaleString()})`} val={tIraV} freq={tIraF} setVal={setTIraV} setFreq={setTIraF}/>
        <SLabel><CreditCard size={10} style={{marginRight:4}}/>Pre-Tax Expenses</SLabel>
        <FInput label="Medical" val={medV} freq={medF} setVal={setMedV} setFreq={setMedF} ppY={ppY}/>
        <FInput label="Dental" val={denV} freq={denF} setVal={setDenV} setFreq={setDenF} ppY={ppY}/>
        <FInput label="Vision" val={visV} freq={visF} setVal={setVisV} setFreq={setVisF} ppY={ppY}/>
        <FInput label="Parking" val={parkV} freq={parkF} setVal={setParkV} setFreq={setParkF} ppY={ppY}/>
        <FInput label="FSA" val={fsaV} freq={fsaF} setVal={setFsaV} setFreq={setFsaF}/>
        <FInput label="Other Pre-Tax" val={ptOV} freq={ptOF} setVal={setPtOV} setFreq={setPtOF} ppY={ppY}/>
        <SLabel><TrendingUp size={10} style={{marginRight:4}}/>Post-Tax Contributions</SLabel>
        <FInput label={`Roth 401k/403b (lim $${td.lim_401k.toLocaleString()})`} val={r401V} freq={r401F} setVal={setR401V} setFreq={setR401F} ppY={ppY}/>
        <FInput label={`Roth 457b (lim $${td.lim_401k.toLocaleString()})`} val={r457V} freq={r457F} setVal={setR457V} setFreq={setR457F} ppY={ppY}/>
        <FInput label={`Roth IRA (lim $${td.lim_ira.toLocaleString()})`} val={rIraV} freq={rIraF} setVal={setRIraV} setFreq={setRIraF}/>
        <FInput label="Investments / Savings" val={invV} freq={invF} setVal={setInvV} setFreq={setInvF} ppY={ppY}/>
        <FInput label="Other Post-Tax" val={ptO2V} freq={ptO2F} setVal={setPtO2V} setFreq={setPtO2F} ppY={ppY}/>
        <SLabel><Home size={10} style={{marginRight:4}}/>Living Expenses</SLabel>
        <FInput label="Rent / Mortgage" val={rentV} freq={rentF} setVal={setRentV} setFreq={setRentF} ppY={ppY}/>
        <FInput label="Groceries" val={grocV} freq={grocF} setVal={setGrocV} setFreq={setGrocF} ppY={ppY}/>
        <FInput label="Car Insurance" val={carIV} freq={carIF} setVal={setCarIV} setFreq={setCarIF} ppY={ppY}/>
        <FInput label="Renters Insurance" val={rIV} freq={rIF} setVal={setRIV} setFreq={setRIF} ppY={ppY}/>
        <FInput label="Internet" val={inetV} freq={inetF} setVal={setInetV} setFreq={setInetF} ppY={ppY}/>
        <FInput label="Electricity" val={elecV} freq={elecF} setVal={setElecV} setFreq={setElecF} ppY={ppY}/>
        <FInput label="Utilities" val={utilV} freq={utilF} setVal={setUtilV} setFreq={setUtilF} ppY={ppY}/>
        <FInput label="Other" val={livOV} freq={livOF} setVal={setLivOV} setFreq={setLivOF} ppY={ppY}/>
        {customLiving.map((e,i)=>(
          <div key={e.id} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
              <input value={e.label} onChange={ev=>{const a=[...customLiving];a[i]={...a[i],label:ev.target.value};setCustomLiving(a);}} placeholder="Label..." style={{...inp_style,fontSize:9,padding:"3px 6px",width:"70%"}}/>
              <button onClick={()=>setCustomLiving(customLiving.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:RED,cursor:"pointer",fontSize:13,padding:"0 2px"}}>×</button>
            </div>
            <div style={{display:"flex",gap:4}}>
              <input type="number" min={0} value={e.val} onChange={ev=>{const a=[...customLiving];a[i]={...a[i],val:+ev.target.value};setCustomLiving(a);}} style={{...inp_style,flex:1}}/>
              <select value={e.freq} onChange={ev=>{const a=[...customLiving];a[i]={...a[i],freq:ev.target.value};setCustomLiving(a);}} style={sel_style}>
                <option value="" disabled>Frequency</option>{["Annually","Monthly","Semimonthly","Biweekly","Weekly"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        ))}
        <button onClick={()=>setCustomLiving([...customLiving,{id:Date.now(),label:"",val:0,freq:"Monthly"}])} style={{width:"100%",marginTop:4,padding:"5px",borderRadius:6,border:`1px dashed ${BORDER}`,background:"none",color:MUTED,cursor:"pointer",fontSize:11}}>+ Add Expense</button>
      </div>

      {/* ── MAIN ── */}
      <div style={{flex:1,overflowY:"auto",padding:"18px 20px",minWidth:0}}>

        {/* Header row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.02em",display:"flex",alignItems:"center",gap:8}}><DollarSign size={20}/>Tax Calculator</div>
            <div style={{fontSize:11,color:MUTED}}>{year} · {state} · {ppFreq}{hasSec?" · +Secondary":""}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {/* Tax owed / refund pill */}
            <div style={{padding:"6px 12px",borderRadius:10,background:taxBalanceColor+"22",border:`1px solid ${taxBalanceColor}`,textAlign:"center"}}>
              <div style={{fontSize:9,color:MUTED,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>
                {R.totalTaxBalance > 200 ? "Est. Tax Owed at Filing" : R.totalTaxBalance < -200 ? "Est. Refund at Filing" : "Tax Status"}
              </div>
              <div style={{fontSize:11,fontWeight:700,color:taxBalanceColor}}>{taxBalanceLabel}</div>
              {R.totalTaxBalance > 200 && R.addlNeededPerCheck > 0 &&
                <div style={{fontSize:9,color:MUTED,marginTop:2}}>+{fm(R.addlNeededPerCheck)}/check needed</div>}
            </div>
            {/* Contributions pill */}
            <div style={{padding:"6px 12px",borderRadius:10,fontSize:11,fontWeight:700,background:R.contribOk?"#064e3b":"#7f1d1d",color:R.contribOk?GREEN:RED,border:`1px solid ${R.contribOk?GREEN:RED}`,textAlign:"center"}}>
              <div style={{fontSize:9,color:MUTED,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Contributions</div>
              {R.contribOk?<span style={{display:"flex",alignItems:"center",gap:4}}><CheckCircle size={11}/>Within Limits</span>:<span style={{display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={11}/>Over Limit</span>}
            </div>
          </div>
        </div>

        {/* Top metrics */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <Met label="Combined Gross" val={fm(R.cGross)}/>
          <Met label="Total Withheld" val={fm(R.cTotTax)} color={RED}/>
          <Met label="Tax Actually Owed" val={fm(R.cTotOwed)} color={ORANGE} sub="on combined income"/>
          <Met label="Net Income" val={fm(R.cNet)} color={GREEN}/>
          <Met label="Total Saved" val={fm(R.totalSaved)} color={PURPLE}/>
          <Met label="Remaining" val={fm(R.cFinal)} color={R.cFinal>=0?GREEN:RED}/>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:3,marginBottom:14,background:CARD,padding:4,borderRadius:9,width:"fit-content",border:`1px solid ${BORDER}`}}>
          {[["breakdown","Breakdown",<LayoutList size={12}/>],["paycheck","Paycheck",<DollarSign size={12}/>],["savings","Savings & Retirement",<PiggyBank size={12}/>],["pension","Pension",<Landmark size={12}/>],["networth","Net Worth",<BarChart2 size={12}/>],["predict","Predictor",<Telescope size={12}/>]].map(([id,lbl,icon])=>
            <TabBtn key={id} id={id} label={lbl} icon={icon} active={tab===id} onClick={setTab}/>
          )}
        </div>

        {/* ── BREAKDOWN ── */}
        {tab==="breakdown"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:hasSec?"1fr 1fr":"1fr 1fr",gap:10,marginBottom:12}}>
              {/* Primary */}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:6}}>Primary Employment</div>
                <SHead label="Income"/>
                <RRow label="Gross Income" val={fm(R.pGross)} bold/>
                <RRow label="Longevity Pay" val={fm(R.pLon)} sub/>
                <RRow label="Pre-Tax Retirement" val={fm(-R.preTaxRet)} sub/>
                <RRow label="Pre-Tax Expenses" val={fm(-R.preTaxExp)} sub/>
                <RRow label="Adjusted Gross Income" val={fm(R.pAgi)} bold color={ACCENT}/>
                <SHead label="Federal Taxes (withheld independently)"/>
                <RRow label="Fed Taxable Income" val={fm(R.pFedTaxable)} sub/>
                <RRow label="Federal Income Tax" val={fm(R.pFedTax)} sub/>
                <RRow label="Medicare Tax" val={fm(R.pMedi)} sub/>
                <RRow label="FICA / OASDI" val={fm(R.pFica)} sub/>
                <RRow label="Add'l Withholding" val={fm(R.addWith)} sub/>
                <RRow label="Total Federal Withheld" val={fm(R.pWithheld)} bold color={RED}/>
                <RRow label="Marginal Fed Rate" val={fp(R.pMargFed)}/>
                <RRow label="Effective Fed Rate" val={fp(R.pEffFed)}/>
                <SHead label="State Taxes"/>
                <RRow label="State Tax" val={fm(R.pStateTax)} sub/>
                <RRow label="Marginal State Rate" val={fp(R.pMargState)}/>
                <RRow label="Total Tax (withheld)" val={fm(R.pTotTax)} bold color={RED}/>
                <RRow label="Effective Total Rate" val={fp(R.pEffTotal)}/>
                <SHead label="After Tax"/>
                <RRow label="Net Income" val={fm(R.pNet)} bold/>
                <RRow label="Post-Tax Retirement" val={fm(-R.postRet)} sub/>
                <RRow label="Investments" val={fm(-R.postInv)} sub/>
                <RRow label="Living Expenses" val={fm(-R.living)} sub/>
                <RRow label="Final" val={fm(R.pFinal)} bold color={R.pFinal>=0?GREEN:RED}/>
              </div>

              {/* Pie Chart */}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10}}>Annual Breakdown</div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={breakdownPie} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="v" nameKey="n">{breakdownPie.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Pie><Tooltip {...tt}/><Legend iconType="circle" iconSize={8} formatter={v=><span style={{color:MUTED,fontSize:10}}>{v}</span>}/></PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Secondary & Combined — only when secondary income is enabled */}
            {hasSec&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {/* Secondary */}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:6}}>Secondary Employment</div>
                <SHead label="Income"/>
                <RRow label="Gross Income" val={fm(R.sGross)} bold/>
                <RRow label="Adjusted Gross" val={fm(R.sGross)} bold color={ACCENT}/>
                <SHead label="Federal Taxes (withheld independently)"/>
                <RRow label="Fed Taxable Income" val={fm(R.sFedTaxable)} sub/>
                <RRow label="Federal Income Tax" val={fm(R.sFedTax)} sub/>
                <RRow label="Medicare" val={fm(R.sMedi)} sub/>
                <RRow label="FICA / OASDI" val={fm(R.sFica)} sub/>
                <RRow label="Total Federal Withheld" val={fm(R.sTotFedWithheld)} bold color={RED}/>
                <RRow label="Marginal Fed Rate" val={fp(R.sMargFed)}/>
                <RRow label="Effective Fed Rate" val={fp(R.sEffFed)}/>
                <SHead label="State Taxes"/>
                <RRow label="State Tax" val={fm(R.sStateTax)} sub/>
                <RRow label="Total Tax (withheld)" val={fm(R.sTotTax)} bold color={RED}/>
                <SHead label="After Tax"/>
                <RRow label="Final (after tax)" val={fm(R.sFinal)} bold color={R.sFinal>=0?GREEN:RED}/>
              </div>

              {/* Combined */}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:6}}>Combined (Filing Analysis)</div>
                <SHead label="Income"/>
                <RRow label="Combined Gross" val={fm(R.cGross)} bold/>
                <RRow label="Pre-Tax Retirement" val={fm(-R.preTaxRet)} sub/>
                <RRow label="Pre-Tax Expenses" val={fm(-R.preTaxExp)} sub/>
                <RRow label="Combined AGI" val={fm(R.cAgi)} bold color={ACCENT}/>
                <SHead label="Withheld (each job separately)"/>
                <RRow label="Fed Income Tax Withheld" val={fm(R.pFedTax+R.sFedTax)} sub/>
                <RRow label="FICA (combined)" val={fm(R.pFica+R.sFica)} sub/>
                <RRow label="Medicare (combined)" val={fm(R.pMedi+R.sMedi)} sub/>
                <RRow label="Add'l Withholding" val={fm(R.addWith)} sub/>
                <RRow label="State Tax Withheld" val={fm(R.pStateTax+R.sStateTax)} sub/>
                <RRow label="Total Withheld" val={fm(R.cTotTax)} bold color={RED}/>
                <SHead label="Actually Owed (combined income)"/>
                <RRow label="Fed Taxable (combined)" val={fm(R.cFedTaxable)} sub/>
                <RRow label="Federal Tax Owed" val={fm(R.cFedTaxOwed)} sub/>
                <RRow label="FICA Owed" val={fm(R.cFicaOwed)} sub/>
                <RRow label="Medicare Owed" val={fm(R.cMediOwed)} sub/>
                <RRow label="State Tax Owed" val={fm(R.cStateTaxOwed)} sub/>
                <RRow label="Total Tax Owed" val={fm(R.cTotOwed)} bold color={ORANGE}/>
                <RRow label="Effective Rate" val={fp(R.cEffTotal)}/>
                <SHead label="Filing Balance"/>
                <RRow label="Fed Income Tax Balance" val={fm(R.fedTaxBalance)} bold color={R.fedTaxBalance>0?RED:GREEN}/>
                <RRow label="State Tax Balance" val={fm(R.stateTaxBalance)} bold color={R.stateTaxBalance>0?RED:GREEN}/>
                <RRow label={R.totalTaxBalance>0?"TOTAL OWED":"TOTAL REFUND"} val={fm(Math.abs(R.totalTaxBalance))} bold color={R.totalTaxBalance>0?RED:GREEN}/>
                {R.addlNeededPerCheck>0&&<RRow label="Add'l withholding needed/check" val={fm(R.addlNeededPerCheck)} color={YELLOW}/>}
                <SHead label="After Tax"/>
                <RRow label="Net Income" val={fm(R.cNet)} bold/>
                <RRow label="Post-Tax Retirement" val={fm(-R.postRet)} sub/>
                <RRow label="Investments" val={fm(-R.postInv)} sub/>
                <RRow label="Living Expenses" val={fm(-R.living)} sub/>
                <RRow label="Final" val={fm(R.cFinal)} bold color={R.cFinal>=0?GREEN:RED}/>
              </div>
            </div>}
          </div>
        )}

        {/* ── PAYCHECK ── */}
        {tab==="paycheck"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <Met label="Gross / Paycheck" val={fm(R.pc_gross)}/><Met label="Taxes / Paycheck" val={fm(R.pc_totTax)} color={RED}/><Met label="Net / Paycheck" val={fm(R.pc_net)} color={GREEN}/><Met label="Remaining / Paycheck" val={fm(R.pc_final)} color={R.pc_final>=0?GREEN:RED}/>
              {hasSec&&<><Met label="2nd Gross / Check" val={fm(R.sGross/ppY)}/><Met label="2nd Net / Check" val={fm(R.sFinal/ppY)} color={GREEN}/></>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:hasSec?"1fr 1fr 1fr":"1fr 1fr",gap:10}}>
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:6}}>Per Paycheck · Primary ({ppFreq})</div>
                <SHead label="Income"/>
                <RRow label="Gross" val={fm(R.pc_gross)} bold/>
                <RRow label="Pre-Tax Retirement" val={fm(-R.pc_preTaxRet)} sub/>
                <RRow label="Pre-Tax Expenses" val={fm(-R.pc_preTaxExp)} sub/>
                <RRow label="Adjusted Gross Income" val={fm(R.pAgi/ppY)} bold color={ACCENT}/>
                <RRow label="Fed Taxable Gross" val={fm(R.pFedTaxable/ppY)} bold color={ACCENT}/>
                <SHead label="Taxes"/>
                <RRow label="Federal Income Tax" val={fm(R.pc_fedTax)} sub/>
                <RRow label="Medicare" val={fm(R.pc_medi)} sub/>
                <RRow label="FICA / OASDI" val={fm(R.pc_fica)} sub/>
                <RRow label="Total Federal" val={fm(R.pc_withheld)} bold color={RED}/>
                <RRow label="State Tax" val={fm(R.pc_stateTax)} sub/>
                <RRow label="Total Taxes" val={fm(R.pc_totTax)} bold color={RED}/>
                <SHead label="After Tax"/>
                <RRow label="Net" val={fm(R.pc_net)} bold/>
                <RRow label="Post-Tax Retirement" val={fm(-R.pc_postRet)} sub/>
                <RRow label="Investments" val={fm(-R.pc_postInv)} sub/>
                <RRow label="Living Expenses" val={fm(-R.pc_living)} sub/>
                <RRow label="Remaining" val={fm(R.pc_final)} bold color={R.pc_final>=0?GREEN:RED}/>
              </div>
              {hasSec&&(
                <div style={card_style}>
                  <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:6}}>Per Paycheck · Secondary (est. {ppFreq})</div>
                  <SHead label="Income"/>
                  <RRow label="Gross" val={fm(R.sGross/ppY)} bold/>
                  <SHead label="Taxes (estimated)"/>
                  <RRow label="Federal Income Tax" val={fm(R.sFedTax/ppY)} sub/>
                  <RRow label="Medicare" val={fm(R.sMedi/ppY)} sub/>
                  <RRow label="FICA / OASDI" val={fm(R.sFica/ppY)} sub/>
                  <RRow label="Total Federal" val={fm(R.sTotFedWithheld/ppY)} bold color={RED}/>
                  <RRow label="State Tax" val={fm(R.sStateTax/ppY)} sub/>
                  <RRow label="Total Taxes" val={fm(R.sTotTax/ppY)} bold color={RED}/>
                  <SHead label="After Tax"/>
                  <RRow label="Net (after tax)" val={fm(R.sFinal/ppY)} bold color={R.sFinal>=0?GREEN:RED}/>
                  <div style={{fontSize:9,color:MUTED,marginTop:8}}>* Uses primary pay frequency as estimate</div>
                </div>
              )}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10}}>Primary Paycheck Breakdown</div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="v" nameKey="n">{donutData.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Pie><Tooltip {...tt}/><Legend iconType="circle" iconSize={8} formatter={v=><span style={{color:MUTED,fontSize:10}}>{v}</span>}/></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── SAVINGS & RETIREMENT (merged) ── */}
        {tab==="savings"&&(
          <div>
            {/* Top metrics */}
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <Met label="Pre-Tax Retirement" val={fm(R.preTaxRet)} color={PURPLE}/><Met label="Post-Tax Retirement" val={fm(R.postRet)} color={ACCENT}/><Met label="Total Retirement" val={fm(R.totalRet)} color={TEAL}/><Met label="Investments" val={fm(scenario.invest)} color={GREEN}/><Met label="Total Saved" val={fm(R.totalSaved)} color={GREEN}/>
            </div>
            {/* Allocation chart + Contributions Detail + Pie */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10}}>Annual Income Allocation</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[{n:"Gross",v:R.cGross},{n:"Taxes",v:R.cTotTax},{n:"Pre-Tax Ret",v:R.preTaxRet},{n:"Post-Tax Ret",v:R.postRet},{n:"Investments",v:R.postInv},{n:"Living",v:R.living},{n:"Remaining",v:Math.max(0,R.cFinal)}]} margin={{top:5,right:10,left:0,bottom:5}}>
                    <XAxis dataKey="n" tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/><Tooltip {...tt}/>
                    <Bar dataKey="v" radius={[4,4,0,0]}>{[GREEN,RED,PURPLE,ACCENT,TEAL,"#60a5fa",GREEN].map((c,i)=><Cell key={i} fill={c}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{height:8}}/>
                <SHead label="Contributions Detail"/>
                <RRow label="UTSW Employee" val={fm(R.utswEmp)} sub/><RRow label="UTSW Employer" val={fm(R.utswEr)} sub/><RRow label="Trad 401k/403b" val={fm(scenario.trad401k)} sub/><RRow label="Trad 457b" val={fm(scenario.trad457b)} sub/><RRow label="Trad IRA" val={fm(scenario.tradIra)} sub/><RRow label="Total Pre-Tax" val={fm(R.preTaxRet)} bold color={PURPLE}/>
                <RRow label="Roth 401k/403b" val={fm(scenario.roth401k)} sub/><RRow label="Roth 457b" val={fm(scenario.roth457b)} sub/><RRow label="Roth IRA" val={fm(scenario.rothIra)} sub/><RRow label="Total Post-Tax" val={fm(R.postRet)} bold color={ACCENT}/>
                <RRow label="Investments / Savings" val={fm(scenario.invest)} sub/><RRow label="TOTAL SAVED" val={fm(R.totalSaved)} bold color={GREEN}/>
                {R.cAgi>0&&<><div style={{height:4}}/><RRow label="Savings % of Income" val={fp(R.totalSaved/R.cAgi)} bold color={GREEN}/></>}
              </div>
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10}}>Savings Breakdown</div>
                {R.totalSaved>0?(
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart><Pie data={[{n:"UTSW Emp",v:R.utswEmp,fill:PURPLE},{n:"UTSW Empr",v:R.utswEr,fill:"#6366f1"},{n:"Trad 401k",v:scenario.trad401k,fill:GREEN},{n:"Trad 457b",v:scenario.trad457b,fill:"#059669"},{n:"Trad IRA",v:scenario.tradIra,fill:"#6ee7b7"},{n:"Roth 401k",v:scenario.roth401k,fill:ORANGE},{n:"Roth 457b",v:scenario.roth457b,fill:"#ea580c"},{n:"Roth IRA",v:scenario.rothIra,fill:"#fed7aa"},{n:"Investments",v:scenario.invest,fill:TEAL}].filter(d=>d.v>0)} cx="50%" cy="50%" innerRadius={55} outerRadius={100} dataKey="v" nameKey="n">{[PURPLE,"#6366f1",GREEN,"#059669","#6ee7b7",ORANGE,"#ea580c","#fed7aa",TEAL].map((c,i)=><Cell key={i} fill={c}/>)}</Pie><Tooltip {...tt}/><Legend iconType="circle" iconSize={8} formatter={v=><span style={{color:MUTED,fontSize:10}}>{v}</span>}/></PieChart>
                  </ResponsiveContainer>
                ):<div style={{color:MUTED,fontSize:11,marginTop:8}}>Enter contributions to see chart.</div>}
              </div>
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><TrendingUp size={12}/>Savings Projection</div>
                <div style={{marginBottom:8}}><div style={{fontSize:10,color:MUTED,marginBottom:3}}>Years: {pYears}</div><input type="range" min={5} max={40} value={pYears} onChange={e=>setPYears(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/></div>
                <div style={{marginBottom:8}}><div style={{fontSize:10,color:MUTED,marginBottom:3}}>Base Return: {pRate}% · Band: ±3%</div><input type="range" min={1} max={15} value={pRate} onChange={e=>setPRate(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/></div>
                <div style={{marginBottom:10}}><div style={{fontSize:10,color:MUTED,marginBottom:3}}>Starting Balance</div><input type="number" min={0} value={initBal} onChange={e=>setInitBal(+e.target.value)} style={inp_style}/></div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={projData} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ACCENT} stopOpacity={0.35}/><stop offset="95%" stopColor={ACCENT} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/><XAxis dataKey="y" tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/><Tooltip {...tt}/>
                    <Area type="monotone" dataKey="balH" stroke={ACCENT} strokeOpacity={0.35} strokeDasharray="5 5" fill={ACCENT} fillOpacity={0} strokeWidth={1.5} name={`Optimistic (${pRate+3}%)`}/>
                    <Area type="monotone" dataKey="balL" stroke={ACCENT} strokeOpacity={0.35} strokeDasharray="5 5" fill={ACCENT} fillOpacity={0} strokeWidth={1.5} name={`Conservative (${Math.max(1,pRate-3)}%)`}/>
                    <Area type="monotone" dataKey="bal" stroke={ACCENT} fill="url(#g1)" strokeWidth={2} name={`Base (${pRate}%)`}/>
                    <Area type="monotone" dataKey="contrib" stroke={MUTED} fill="none" fillOpacity={0} strokeDasharray="4 4" strokeWidth={1.5} name="Contributions"/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <Met label={`Yr ${pYears} Base`} val={fm(projData[projData.length-1]?.bal||0)} color={ACCENT}/>
                  <Met label={`Yr ${pYears} Optimistic`} val={fm(projData[projData.length-1]?.balH||0)} color={GREEN}/>
                  <Met label={`Yr ${pYears} Conservative`} val={fm(projData[projData.length-1]?.balL||0)} color={YELLOW}/>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PENSION ── */}
        {tab==="pension"&&(
          <div>
            <div style={{...card_style,marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:ACCENT,marginBottom:4,display:"flex",alignItems:"center",gap:6}}><Landmark size={13}/>TRS / ORP Pension Estimator</div>
              <div style={{fontSize:11,color:MUTED,marginBottom:14}}>TRS pension = Average of top 5 salaries × Years of Service × Multiplier %</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:11,color:MUTED,marginBottom:8}}>Top 5 Highest Salaries</div>
                  {trsSals.map((s,i)=>(
                    <div key={i} style={{marginBottom:8}}>
                      <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Salary #{i+1}</div>
                      <input type="number" min={0} value={s}
                        onChange={e=>{const a=[...trsSals];a[i]=+e.target.value;setTrsSals(a);}}
                        style={inp_style}/>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Years of Service</div>
                    <input type="number" min={0} max={50} value={trsYears} onChange={e=>setTrsYears(+e.target.value)} style={inp_style}/>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Multiplier per Year (%) — TRS default: 2.3%</div>
                    <input type="number" min={0} max={5} step={0.1} value={trsMult} onChange={e=>setTrsMult(+e.target.value)} style={inp_style}/>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:MUTED,marginBottom:2}}>UTSW Plan</div>
                    <div style={{fontSize:13,fontWeight:600,color:TEXT,padding:"6px 0"}}>{plan}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <Met label="Average Top 5 Salaries" val={fm(trsAvg5)} color={ACCENT}/>
              <Met label="Pension % Factor" val={`${(trsYears*trsMult).toFixed(1)}%`} color={PURPLE} sub={`${trsYears} yrs × ${trsMult}%`}/>
              <Met label="Annual Annuity" val={fm(trsAnnuity)} color={GREEN}/>
              <Met label="Monthly Payout" val={fm(trsAnnuity/12)} color={GREEN}/>
            </div>

            {/* Year-by-year payout table */}
            {trsAnnuity > 0 && (
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10}}>Pension Payout by Year of Retirement (Projected)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                  {[0,1,2,3,4,5,10,15,20,25].map(extra=>{
                    const futureAvg = trsAvg5 * Math.pow(1.03, extra); // assume 3% salary growth
                    const futureAnnuity = futureAvg * ((trsYears+extra) * trsMult / 100);
                    return (
                      <div key={extra} style={{...card_style,padding:10,textAlign:"center",background:BG}}>
                        <div style={{fontSize:10,color:MUTED}}>+{extra} yrs</div>
                        <div style={{fontSize:13,fontWeight:700,color:GREEN,fontFamily:"monospace"}}>{fm(futureAnnuity/12)}</div>
                        <div style={{fontSize:9,color:MUTED}}>/ month</div>
                        <div style={{fontSize:10,color:MUTED,marginTop:2}}>{fm(futureAnnuity)}/yr</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{fontSize:10,color:MUTED,marginTop:8}}>* Projected assumes 3% annual salary growth and additional service years accrued</div>
              </div>
            )}

            {/* Current retirement contributions context */}
            <div style={{...card_style,marginTop:12}}>
              <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:8}}>Current Annual Contributions to {plan}</div>
              <RRow label="Your Employee Contribution" val={fm(R.utswEmp)} bold/>
              <RRow label="UTSW Employer Contribution" val={fm(R.utswEr)} sub/>
              <RRow label={`Employee Rate (${plan})`} val={fp(plan==="TRS"?TAX_DATA[year].trs_emp:TAX_DATA[year].orp_emp)}/>
              <RRow label={`Employer Rate (${plan})`} val={fp(plan==="TRS"?TAX_DATA[year].trs_utsw:TAX_DATA[year].orp_utsw)}/>
              <RRow label="Total Combined" val={fm(R.utswEmp+R.utswEr)} bold color={GREEN}/>
            </div>
          </div>
        )}

        {/* ── NET WORTH ── */}
        {tab==="networth"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:GREEN,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><TrendingUp size={12}/>Assets</div>
                {[["Checking / Savings",nwCheck,setNwCheck],["High-Yield Savings",nwHys,setNwHys],["401k / 403b Balance",nw401,setNw401],["457b Balance",nw457,setNw457],["IRA Balance",nwIra,setNwIra],["Brokerage / Investments",nwBrok,setNwBrok],["Home Value",nwHome,setNwHome],["Vehicle Value",nwCar,setNwCar],["Other Assets",nwOA,setNwOA]].map(([lbl,v,sv])=>(
                  <div key={lbl} style={{marginBottom:6}}><div style={{fontSize:10,color:MUTED,marginBottom:2}}>{lbl}</div><input type="number" min={0} value={v} onChange={e=>sv(+e.target.value)} style={inp_style}/></div>
                ))}
              </div>
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:RED,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={12}/>Liabilities</div>
                {[["Mortgage Balance",nwMort,setNwMort],["Car Loan",nwCL,setNwCL],["Student Loans",nwStu,setNwStu],["Credit Card Debt",nwCC,setNwCC],["Other Debt",nwOD,setNwOD]].map(([lbl,v,sv])=>(
                  <div key={lbl} style={{marginBottom:6}}><div style={{fontSize:10,color:MUTED,marginBottom:2}}>{lbl}</div><input type="number" min={0} value={v} onChange={e=>sv(+e.target.value)} style={inp_style}/></div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Met label="Total Assets" val={fm(totalAssets)} color={GREEN}/><Met label="Total Liabilities" val={fm(totalLiab)} color={RED}/><Met label="Net Worth" val={fm(netWorth)} color={netWorth>=0?GREEN:RED}/>
            </div>
            <div style={card_style}>
              <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10}}>Net Worth Projection · Saving {fm(R.totalSaved)}/yr at {pRate}% return</div>
              <div style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-end"}}>
                <div style={{flex:1}}><div style={{fontSize:10,color:MUTED,marginBottom:3}}>Return Rate: {pRate}% · Band: ±3%</div><input type="range" min={1} max={15} value={pRate} onChange={e=>setPRate(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/></div>
                <div style={{flex:1}}><div style={{fontSize:10,color:MUTED,marginBottom:3}}>Years: {nwYears}</div><input type="range" min={5} max={50} value={nwYears} onChange={e=>setNwYears(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/></div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={nwProjData} margin={{top:5,right:10,left:0,bottom:5}}>
                  <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={GREEN} stopOpacity={0.3}/><stop offset="95%" stopColor={GREEN} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/><XAxis dataKey="y" tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/><Tooltip {...tt}/>
                  <Area type="monotone" dataKey="nwH" stroke={GREEN} strokeOpacity={0.35} strokeDasharray="5 5" fill={GREEN} fillOpacity={0} strokeWidth={1.5} name={`Optimistic (${pRate+3}%)`}/>
                  <Area type="monotone" dataKey="nwL" stroke={GREEN} strokeOpacity={0.35} strokeDasharray="5 5" fill={GREEN} fillOpacity={0} strokeWidth={1.5} name={`Conservative (${Math.max(1,pRate-3)}%)`}/>
                  <Area type="monotone" dataKey="nw" stroke={GREEN} fill="url(#g2)" strokeWidth={2} name={`Base (${pRate}%)`}/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <Met label="Current Net Worth" val={fm(netWorth)} color={netWorth>=0?GREEN:RED}/>
                <Met label={`Yr ${nwYears} Base`} val={fm(nwProjData[nwProjData.length-1]?.nw||0)} color={GREEN}/>
                <Met label={`Yr ${nwYears} Optimistic`} val={fm(nwProjData[nwProjData.length-1]?.nwH||0)} color={GREEN}/>
                <Met label={`Yr ${nwYears} Conservative`} val={fm(nwProjData[nwProjData.length-1]?.nwL||0)} color={YELLOW}/>
              </div>
            </div>
          </div>
        )}

        {/* ── PREDICTOR ── */}
        {tab==="predict"&&(
          <div>
            {/* Settings row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
              {/* Growth & Tax inputs */}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:8}}>Retirement Settings</div>
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Retirement Year</div>
                  <input type="number" min={2026} max={2080} value={retYear} onChange={e=>setRetYear(+e.target.value)} style={inp_style}/>
                </div>
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Annual Return Rate: {retAnnRate}%</div>
                  <input type="range" min={1} max={15} value={retAnnRate} onChange={e=>setRetAnnRate(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/>
                </div>
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Retirement Effective Tax Rate: {retEffTax}%</div>
                  <input type="range" min={0} max={40} value={retEffTax} onChange={e=>setRetEffTax(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/>
                </div>
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Long-Term Capital Gains Rate: {retLtcg}%</div>
                  <input type="range" min={0} max={25} value={retLtcg} onChange={e=>setRetLtcg(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/>
                </div>
                <div style={{marginBottom:0}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Employer Match (% of gross): {retCompRate}%</div>
                  <input type="range" min={0} max={15} step={0.5} value={retCompRate} onChange={e=>setRetCompRate(+e.target.value)} style={{width:"100%",accentColor:ACCENT}}/>
                </div>
              </div>
              {/* Prior balances & assumptions */}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:8}}>Existing Balances</div>
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Existing Traditional Balance</div>
                  <input type="number" min={0} value={prevTradBal} onChange={e=>setPrevTradBal(+e.target.value)} style={inp_style}/>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:2}}>Existing Roth Balance</div>
                  <input type="number" min={0} value={prevRothBal} onChange={e=>setPrevRothBal(+e.target.value)} style={inp_style}/>
                </div>
                <SHead label="Assumptions"/>
                <RRow label="Years to Retirement" val={`${retPredData.n} yrs`}/>
                <RRow label="Current Marginal Fed Rate" val={fp(retPredData.margRate)}/>
                <RRow label="Annual Trad Contributions" val={fm(retPredData.tradAnnual)}/>
                <RRow label="Annual Roth Contributions" val={fm(retPredData.rothAnnual)}/>
                <RRow label="Employer Match / yr" val={fm(retPredData.companyAmt)}/>
              </div>
              {/* How it works + Custom Split */}
              <div style={card_style}>
                <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:8}}>How It Works</div>
                <div style={{fontSize:10,color:MUTED,lineHeight:1.8,marginBottom:10}}>
                  <div style={{marginBottom:4}}><span style={{color:PURPLE,fontWeight:700}}>Traditional:</span> pre-tax; tax savings reinvested in brokerage. Withdrawals taxed at retirement effective rate.</div>
                  <div style={{marginBottom:4}}><span style={{color:ORANGE,fontWeight:700}}>Roth:</span> post-tax now, <span style={{color:TEXT}}>100% tax-free at withdrawal.</span></div>
                  <div><span style={{color:TEAL,fontWeight:700}}>Current Split:</span> your actual sidebar mix. <span style={{color:"#f472b6",fontWeight:700}}>Custom %:</span> your chosen split below.</div>
                </div>
                <SHead label="Custom Contribution Split"/>
                <div style={{marginBottom:4}}>
                  <div style={{fontSize:10,color:MUTED,marginBottom:3}}>Traditional: {customSplitPct}% · Roth: {100-customSplitPct}%</div>
                  <input type="range" min={0} max={100} step={5} value={customSplitPct} onChange={e=>setCustomSplitPct(+e.target.value)} style={{width:"100%",accentColor:"#f472b6"}}/>
                </div>
                <RRow label="Custom Trad / yr" val={fm(retPredData.customTradAnnual)} sub/>
                <RRow label="Custom Roth / yr" val={fm(retPredData.customRothAnnual)} sub/>
              </div>
            </div>

            {/* Top metrics */}
            {(()=>{
              const nets=[retPredData.allTrad.totalNet,retPredData.allRoth.totalNet,retPredData.split.totalNet,retPredData.customSplit.totalNet];
              const labels=["100% Trad","100% Roth","Current Split",`Custom (${customSplitPct}% T)`];
              const bestIdx=nets.indexOf(Math.max(...nets));
              const sorted=[...nets].sort((a,b)=>b-a);
              return (
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                  <Met label="100% Trad — Net" val={fm(retPredData.allTrad.totalNet)} color={PURPLE} sub={`${fm(retPredData.allTrad.monthlyNet)}/mo`}/>
                  <Met label="100% Roth — Net" val={fm(retPredData.allRoth.totalNet)} color={ORANGE} sub={`${fm(retPredData.allRoth.monthlyNet)}/mo`}/>
                  <Met label="Current Split — Net" val={fm(retPredData.split.totalNet)} color={TEAL} sub={`${fm(retPredData.split.monthlyNet)}/mo`}/>
                  <Met label={`Custom (${customSplitPct}%T) — Net`} val={fm(retPredData.customSplit.totalNet)} color="#f472b6" sub={`${fm(retPredData.customSplit.monthlyNet)}/mo`}/>
                  <Met label="Best Strategy" val={labels[bestIdx]} color={GREEN} sub={`by ${fm(sorted[0]-sorted[1])}`}/>
                </div>
              );
            })()}

            {/* Four-column breakdown */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {label:"100% Traditional",color:PURPLE,d:retPredData.allTrad,tradC:retPredData.total,rothC:0},
                {label:"100% Roth",color:ORANGE,d:retPredData.allRoth,tradC:0,rothC:retPredData.total},
                {label:"Current Split",color:TEAL,d:retPredData.split,tradC:retPredData.tradAnnual,rothC:retPredData.rothAnnual},
                {label:`Custom (${customSplitPct}% Trad)`,color:"#f472b6",d:retPredData.customSplit,tradC:retPredData.customTradAnnual,rothC:retPredData.customRothAnnual},
              ].map(({label,color,d,tradC,rothC})=>(
                <div key={label} style={{...card_style,border:`1px solid ${color}44`}}>
                  <div style={{fontSize:11,fontWeight:700,color,marginBottom:6}}>{label}</div>
                  <SHead label="Annual Contributions"/>
                  <RRow label="Traditional" val={fm(tradC)} sub/>
                  <RRow label="Roth" val={fm(rothC)} sub/>
                  <RRow label="Employer Match" val={fm(retPredData.companyAmt)} sub/>
                  {d.taxSavAmt>0&&<RRow label="Tax Sav → Brokerage" val={fm(d.taxSavAmt)} sub color={GREEN}/>}
                  <SHead label={`At Retirement (${retYear})`}/>
                  <RRow label="Trad Account FV" val={fm(d.tradFV)} sub/>
                  <RRow label="Roth Account FV" val={fm(d.rothFV)} sub/>
                  {d.brokFV>0&&<RRow label="Brokerage FV" val={fm(d.brokFV)} sub/>}
                  <SHead label="Taxes"/>
                  <RRow label="Tax on Trad" val={fm(d.tradTax)} sub color={RED}/>
                  {d.brokTax>0&&<RRow label="LTCG on Brok" val={fm(d.brokTax)} sub color={RED}/>}
                  <SHead label="Net Spendable"/>
                  <RRow label="Total Net" val={fm(d.totalNet)} bold color={color}/>
                  <RRow label="Monthly" val={fm(d.monthlyNet)} bold color={color}/>
                </div>
              ))}
            </div>

            {/* Comparison chart */}
            <div style={card_style}>
              <div style={{fontSize:12,fontWeight:700,color:ACCENT,marginBottom:10}}>Strategy Comparison — Net Spendable at Retirement ({retYear})</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  {name:"100% Trad",net:Math.round(retPredData.allTrad.totalNet)},
                  {name:"100% Roth",net:Math.round(retPredData.allRoth.totalNet)},
                  {name:"Current Split",net:Math.round(retPredData.split.totalNet)},
                  {name:`Custom (${customSplitPct}%T)`,net:Math.round(retPredData.customSplit.totalNet)},
                ]} margin={{top:5,right:10,left:0,bottom:5}}>
                  <XAxis dataKey="name" tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                  <Tooltip contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,color:"#ffffff"}} itemStyle={{color:"#ffffff"}} formatter={v=>[fm(v),"Net Spendable"]}/>
                  <Bar dataKey="net" radius={[4,4,0,0]}>
                    <Cell fill={PURPLE}/><Cell fill={ORANGE}/><Cell fill={TEAL}/><Cell fill="#f472b6"/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
