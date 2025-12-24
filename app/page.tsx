"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ======================
   TÍNH CAN CHI
====================== */
const chi = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];

function getCanChiYear(y:number){
  return `${can[(y+6)%10]} ${chi[(y+8)%12]}`;
}

/* ======================
   GIỜ HOÀNG ĐẠO
====================== */
const goldenHours = [
  "Tý 23-01","Sửu 01-03","Mão 05-07",
  "Ngọ 11-13","Mùi 13-15","Dậu 17-19"
];

/* ======================
   MÀU NGÀY
====================== */
const dayColor = (d:number)=>[
  "#ffd8c8",
  "#ffcbb3",
  "#ffbfa3",
  "#ffb199",
  "#ffa188",
  "#ff9a7a",
  "#ff8d66",
][d % 7];

export default function HomeCalendarPage() {

  const router = useRouter();

  const [now,setNow] = useState(new Date());
  const [viewDate,setViewDate] = useState<Date>(new Date());
  const [tasks,setTasks] = useState<string[]>([]);
  const [note,setNote] = useState("");

  const [viewMode,setViewMode] = useState<"day"|"month">("day");

  useEffect(()=>{
    const t=setInterval(()=>setNow(new Date()),60000);
    return ()=>clearInterval(t);
  },[]);

  /* ========== NGÀY ========== */
  const wk = ["CN","T2","T3","T4","T5","T6","T7"];
  const d = viewDate.getDate();
  const m = viewDate.getMonth()+1;
  const y = viewDate.getFullYear();
  const weekday = wk[viewDate.getDay()];
  const timeNow = now.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});

  /* ========== ÂM LỊCH ========== */
  const lunarFmt = new Intl.DateTimeFormat("vi-VN-u-ca-chinese",
    {day:"numeric",month:"numeric"})
    .format(viewDate)
    .split("/");

  const lunarDay = lunarFmt?.[0] ?? "";
  const lunarMonth = lunarFmt?.[1] ?? "";

  const canchiYear = getCanChiYear(y);

  const dateKey = viewDate.toISOString().slice(0,10);

  /* NAV */
  const changeDay = (n:number)=>{
    const d = new Date(viewDate);
    d.setDate(d.getDate()+n);
    setViewDate(d);
  };

  const changeMonth = (n:number)=>{
    const d = new Date(viewDate);
    d.setMonth(d.getMonth()+n);
    setViewDate(d);
  };

  const addTask = ()=>{
    if(!note.trim()) return;
    setTasks([...tasks,note]);
    setNote("");
  };


  /* ======================
        UI LAYOUT CỐ ĐỊNH
  ====================== */
  return (
    <div
      style={{
        height:"100vh",
        overflow:"hidden",   // ❗ KHÔNG CHO CUỘN
        background: dayColor(viewDate.getDay()),
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:10
      }}
    >

      <div
        style={{
          width:"100%",
          maxWidth:560,
          height:"92vh",     // ❗ FULL TRONG MÀN HÌNH
          background:"#ffffffdd",
          borderRadius:22,
          padding:16,
          boxShadow:"0 12px 32px rgba(0,0,0,.18)",
          display:"flex",
          flexDirection:"column",
          justifyContent:"space-between"
        }}
      >

        {/* HOTSPOT LOGIN */}
        <div
          onClick={()=>router.push("/login")}
          style={{position:"fixed",top:0,left:0,width:40,height:40}}
        />

        {/* ===== HEADER ===== */}
        <div style={{textAlign:"center"}}>
          <div style={{
            padding:"6px 12px",
            borderRadius:12,
            background:"#fff2e0",
            marginBottom:6
          }}>
            {weekday} — Ngày {d}/{m}/{y}
          </div>

          <div style={{
            fontSize:90,
            fontWeight:"900",
            color:"#a31919",
            lineHeight:1
          }}>
            {d}
          </div>

          <div>🌙 Âm lịch: {lunarDay}/{lunarMonth}</div>
          <div style={{marginTop:4}}>🔮 {canchiYear}</div>

          <div style={{fontSize:13,opacity:.7,marginTop:4}}>
            ⏰ {timeNow}
          </div>
        </div>


        {/* ===== TOGGLE MODE ===== */}
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={()=>setViewMode("day")}>📅 Ngày</button>
          <button onClick={()=>setViewMode("month")}>🗓 Tháng</button>
        </div>


        {/* ===== NGÀY ===== */}
        {viewMode==="day" && (
          <div style={{textAlign:"center"}}>

            <div style={{display:"flex",justifyContent:"center",gap:10}}>
              <button onClick={()=>changeDay(-1)}>⬅️</button>

              <input
                type="date"
                value={dateKey}
                onChange={e=>setViewDate(new Date(e.target.value))}
                style={{padding:6,borderRadius:10}}
              />

              <button onClick={()=>changeDay(1)}>➡️</button>
            </div>

            <div
              style={{
                marginTop:10,
                padding:10,
                borderRadius:12,
                background:"#ffe6d6"
              }}
            >
              ⛩ Giờ hoàng đạo: {goldenHours.join(" • ")}
            </div>

            <div style={{display:"flex",gap:6,marginTop:10}}>
              <input
                placeholder="Nhắc việc hôm nay…"
                value={note}
                onChange={e=>setNote(e.target.value)}
                style={{flex:1,padding:8,borderRadius:10}}
              />
              <button onClick={addTask}>➕</button>
            </div>

            <div
              style={{
                marginTop:8,
                background:"#fff7ec",
                padding:10,
                borderRadius:12,
                height:90,
                overflowY:"auto"
              }}
            >
              <b>🕒 Timeline</b>
              <ul style={{marginTop:6,paddingLeft:16}}>
                {tasks.map((t,i)=>(<li key={i}>{t}</li>))}
                {tasks.length===0 && <p style={{opacity:.6}}>Chưa có ghi chú</p>}
              </ul>
            </div>

          </div>
        )}


        {/* ===== THÁNG ===== */}
        {viewMode==="month" && (
          <div style={{textAlign:"center"}}>

            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>changeMonth(-1)}>⬅️</button>
              <b>Tháng {m}/{y}</b>
              <button onClick={()=>changeMonth(1)}>➡️</button>
            </div>

            <div
              style={{
                marginTop:10,
                display:"grid",
                gridTemplateColumns:"repeat(7,1fr)",
                gap:6
              }}
            >
              {wk.map(w=>(
                <div key={w} style={{fontWeight:"bold"}}>{w}</div>
              ))}

              {Array.from({length:35}).map((_,i)=>{
                const d2=new Date(y,m-1,i-viewDate.getDay()+1);
                const today=d2.toDateString()===new Date().toDateString();

                return (
                  <div
                    key={i}
                    onClick={()=>setViewDate(d2)}
                    style={{
                      padding:"8px 0",
                      borderRadius:10,
                      background: today ? "#ff9a7a" : "#ffffffaa"
                    }}
                  >
                    {d2.getDate()}
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
