"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const chi = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];

function getCanChiYear(y:number){
  return `${can[(y+6)%10]} ${chi[(y+8)%12]}`;
}

const goldenHours = [
  "Tý 23-01","Sửu 01-03","Mão 05-07",
  "Ngọ 11-13","Mùi 13-15","Dậu 17-19"
];

const dayColor = (d:number)=>[
  "#ffd2b8",
  "#ffc4a3",
  "#ffb38f",
  "#ffa07c",
  "#ff906c",
  "#ff835e",
  "#ff7653",
][d % 7];

export default function HomeCalendarPage() {

  const router = useRouter();

  const [now,setNow] = useState(new Date());
  const [viewDate,setViewDate] = useState<Date>(new Date());

  useEffect(()=>{
    const t=setInterval(()=>setNow(new Date()),60000);
    return ()=>clearInterval(t);
  },[]);

  /* ===== NGÀY ===== */
  const wk = ["CN","TH2","TH3","TH4","TH5","TH6","TH7"];

  const d = viewDate.getDate();
  const m = viewDate.getMonth()+1;
  const y = viewDate.getFullYear();
  const weekday = wk[viewDate.getDay()];

  const timeNow = now.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});

  /* ===== ÂM LỊCH ===== */
  const lunar = new Intl.DateTimeFormat(
    "vi-VN-u-ca-chinese",
    {day:"numeric",month:"numeric"}
  ).format(viewDate).split("/");

  const lunarDay = lunar?.[0] ?? "";
  const lunarMonth = lunar?.[1] ?? "";

  const canchiYear = getCanChiYear(y);

  /* ===== ĐỔI NGÀY BẰNG MŨI TÊN ===== */
  const changeDay = (n:number)=>{
    const d = new Date(viewDate);
    d.setDate(d.getDate()+n);
    setViewDate(d);
  };

  return (
    <div
      style={{
        height:"100vh",
        overflow:"hidden",          // ⛔ KHÔNG CHO CUỘN
        background: dayColor(viewDate.getDay()),
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        paddingTop:6,
        paddingBottom:6,
      }}
    >

      <div
        style={{
          width:"100%",
          maxWidth:560,
          height:"96vh",           // Giới hạn trong safe-area
          borderRadius:22,
          background:"#ffffffee",
          boxShadow:"0 14px 34px rgba(0,0,0,.22)",
          padding:14,
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

        {/* ==========================
              PHẦN ĐẦU – NGÀY LỚN
        =========================== */}
        <div style={{textAlign:"center"}}>
          
          <div style={{
            fontSize:16,
            padding:"6px 14px",
            borderRadius:14,
            background:"#fff2e0",
            display:"inline-block",
            marginBottom:6
          }}>
            {weekday} — {d}/{m}/{y}
          </div>

          <div style={{
            fontSize:110,
            fontWeight:900,
            color:"#9b1111",
            lineHeight:1
          }}>
            {d}
          </div>

          <div style={{fontSize:20,marginTop:4}}>
            🌙 Âm lịch: <b>{lunarDay}/{lunarMonth}</b>
          </div>

          <div style={{fontSize:18,marginTop:6}}>
            🔮 <b>{canchiYear}</b>
          </div>

          <div style={{fontSize:14,opacity:.7,marginTop:6}}>
            ⏰ {timeNow}
          </div>
        </div>


        {/* ==========================
              NÚT ĐỔI NGÀY (KÉO NGANG)
        =========================== */}
        <div style={{display:"flex",justifyContent:"center",gap:16}}>
          <button
            onClick={()=>changeDay(-1)}
            style={{fontSize:22}}
          >
            ⬅️
          </button>

          <button
            onClick={()=>changeDay(1)}
            style={{fontSize:22}}
          >
            ➡️
          </button>
        </div>


        {/* ==========================
              GIỜ HOÀNG ĐẠO
        =========================== */}
        <div
          style={{
            padding:12,
            borderRadius:14,
            background:"#ffe6d6",
            textAlign:"center",
            fontSize:16
          }}
        >
          ⛩ <b>Giờ hoàng đạo</b><br/>
          {goldenHours.join(" • ")}
        </div>


        {/* ==========================
              TIMELINE GHI CHÚ GỌN
        =========================== */}
        <div
          style={{
            padding:10,
            borderRadius:14,
            background:"#fff7ec",
            fontSize:15,
            textAlign:"center"
          }}
        >
          🕒 <b>Timeline trong ngày</b><br/>
          <span style={{opacity:.6}}>
            (Phần này vẫn có thể mở rộng về sau)
          </span>
        </div>

      </div>
    </div>
  );
}
