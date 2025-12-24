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
   MÀU PHONG THUỶ THEO NGÀY
====================== */
const dayColor = (d:number)=> {
  const colors = [
    "#ffebe0", // CN
    "#ffe4d6",
    "#ffd9c8",
    "#ffcbb3",
    "#ffbfa3",
    "#ffb199",
    "#ffa188",
  ];
  return colors[d % 7];
};

export default function HomeCalendarPage() {
  const router = useRouter();

  const [now,setNow] = useState(new Date());
  const [viewDate,setViewDate] = useState<Date>(new Date());
  const [tasks,setTasks] = useState<string[]>([]);
  const [note,setNote] = useState("");

  const [viewMode,setViewMode] = useState<"day"|"month">("day");

  useEffect(()=>{
    const timer=setInterval(()=>setNow(new Date()),60000);
    return ()=>clearInterval(timer);
  },[]);

  const wk = ["CN","T2","T3","T4","T5","T6","T7"];

  const d = viewDate.getDate();
  const m = viewDate.getMonth()+1;
  const y = viewDate.getFullYear();
  const weekday = wk[viewDate.getDay()];

  const timeNow = now.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});

  /* ========= ÂM LỊCH ========= */
  const lunarFmt = new Intl.DateTimeFormat("vi-VN-u-ca-chinese",
    {day:"numeric",month:"numeric"})
    .format(viewDate)
    .split("/");

  const lunarDay = lunarFmt?.[0] ?? "";
  const lunarMonth = lunarFmt?.[1] ?? "";

  /* ========= CAN CHI ========= */
  const canchiYear = getCanChiYear(y);

  /* ========= NAV DATE ========= */
  const changeDay = (delta:number)=>{
    const d = new Date(viewDate);
    d.setDate(d.getDate()+delta);
    setViewDate(d);
  };

  const changeMonth = (delta:number)=>{
    const d = new Date(viewDate);
    d.setMonth(d.getMonth()+delta);
    setViewDate(d);
  };

  const dateKey = viewDate.toISOString().slice(0,10);

  /* ========= ADD TASK ========= */
  const addTask = ()=>{
    if(!note.trim()) return;
    setTasks([...tasks,note]);
    setNote("");
  };

  /* ======================
        UI
  ====================== */
  return (
    <div style={{
      minHeight:"100vh",
      padding:16,
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background: dayColor(viewDate.getDay())
    }}>

      <div style={{
        width:"100%",
        maxWidth:560,
        background:"#ffffffdd",
        borderRadius:18,
        padding:18,
        boxShadow:"0 10px 30px rgba(0,0,0,.12)"
      }}>

        {/* login hotspot */}
        <div onClick={()=>router.push("/login")}
          style={{position:"fixed",top:0,left:0,width:40,height:40}} />

        {/* =======================
            HEADER
        ======================= */}
        <div style={{textAlign:"center",marginBottom:10}}>
          <div style={{
            fontSize:14,
            marginBottom:6,
            padding:"6px 12px",
            borderRadius:12,
            background:"#fff2e0"
          }}>
            {weekday} — Ngày {d}/{m}/{y}
          </div>

          <div style={{
            fontSize:80,
            fontWeight:"bold",
            color:"#c0392b",
            lineHeight:1
          }}>
            {d}
          </div>

          <div style={{fontSize:15}}>
            🌙 Âm lịch: {lunarDay}/{lunarMonth}
          </div>

          <div style={{marginTop:6}}>
            🔮 {canchiYear}
          </div>

          <div style={{fontSize:13,opacity:.7}}>
            ⏰ {timeNow}
          </div>
        </div>

        {/* =======================
            TOGGLE VIEW
        ======================= */}
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:10}}>
          <button onClick={()=>setViewMode("day")}>📅 Ngày</button>
          <button onClick={()=>setViewMode("month")}>🗓 Tháng</button>
        </div>

        {/* =======================
            VIEW DAY
        ======================= */}
        {viewMode==="day" && (
          <>
            {/* NAV DAY */}
            <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:12}}>
              <button onClick={()=>changeDay(-1)}>⬅️</button>

              <input type="date"
                value={dateKey}
                onChange={e=>setViewDate(new Date(e.target.value))}
                style={{padding:6,borderRadius:10}} />

              <button onClick={()=>changeDay(1)}>➡️</button>
            </div>

            {/* GOLDEN HOURS */}
            <div style={{
              padding:10,
              borderRadius:12,
              background:"#ffe6d6",
              marginBottom:10,
              textAlign:"center",
              fontSize:14
            }}>
              ⛩ Giờ hoàng đạo: {goldenHours.join(" • ")}
            </div>

            {/* TASK INPUT */}
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              <input
                placeholder="Nhắc việc hôm nay..."
                value={note}
                onChange={e=>setNote(e.target.value)}
                style={{flex:1,padding:8,borderRadius:10}}
              />
              <button onClick={addTask}>➕</button>
            </div>

            {/* TIMELINE */}
            <div style={{
              background:"#fff7ec",
              padding:10,
              borderRadius:12
            }}>
              <b>🕒 Timeline trong ngày</b>
              <ul style={{marginTop:6,paddingLeft:16}}>
                {tasks.map((t,i)=>(
                  <li key={i}>{t}</li>
                ))}
                {tasks.length===0 && (
                  <p style={{opacity:.6}}>Chưa có ghi chú</p>
                )}
              </ul>
            </div>
          </>
        )}

        {/* =======================
            VIEW MONTH
        ======================= */}
        {viewMode==="month" && (
          <>
            <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:10}}>
              <button onClick={()=>changeMonth(-1)}>⬅️</button>
              <div><b>Tháng {m} / {y}</b></div>
              <button onClick={()=>changeMonth(1)}>➡️</button>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(7,1fr)",
              gap:6,
              fontSize:13
            }}>
              {wk.map(w=><div key={w} style={{textAlign:"center",fontWeight:"bold"}}>{w}</div>)}

              {Array.from({length:35}).map((_,i)=>{
                const d2 = new Date(y,m-1, i- viewDate.getDay() + 1);
                const isToday = d2.toDateString()=== new Date().toDateString();

                return (
                  <div key={i}
                    onClick={()=>setViewDate(d2)}
                    style={{
                      padding:"8px 0",
                      borderRadius:10,
                      textAlign:"center",
                      background:isToday? "#ffb199" : "#ffffffaa",
                      cursor:"pointer"
                    }}>
                    {d2.getDate()}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
