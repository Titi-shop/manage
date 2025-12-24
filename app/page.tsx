"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* CAN – CHI */
const chi = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];

const getCanChi = (y:number) =>
  `${can[(y+6)%10]} ${chi[(y+8)%12]}`;

/* MÀU NGÀY */
const dayTheme = [
  "#ffbfd4","#ffd1b3","#ffe4a8",
  "#eaf7a6","#c9f1ff","#d8ccff","#ffc7ec"
];

export default function HomeCalendarPage() {

  const router = useRouter();
  const [viewDate,setViewDate] = useState(new Date());
  const [now,setNow] = useState(new Date());

  useEffect(()=>{
    const t=setInterval(()=>setNow(new Date()),60000);
    return ()=>clearInterval(t);
  },[]);

  /* NGÀY */
  const d = viewDate.getDate();
  const m = viewDate.getMonth()+1;
  const y = viewDate.getFullYear();
  const wd = ["CHỦ NHẬT","THỨ HAI","THỨ BA","THỨ TƯ","THỨ NĂM","THỨ SÁU","THỨ BẢY"][viewDate.getDay()];

  /* CAN CHI */
  const canchiYear = getCanChi(y);

  /* ÂM LỊCH (system chinese calendar) */
  const lunar = new Intl.DateTimeFormat("vi-VN-u-ca-chinese",{
    day:"numeric",month:"numeric"
  }).format(viewDate).split("/");

  const lunarDay = lunar?.[0] ?? "";
  const lunarMonth = lunar?.[1] ?? "";

  const timeNow = now.toLocaleTimeString("vi-VN",{
    hour:"2-digit",minute:"2-digit"
  });

  /* VUỐT NGANG – ĐỔI NGÀY */
  let startX = 0;

  const onTouchStart = (e:any)=>{
    startX = e.touches[0].clientX;
  };

  const onTouchEnd = (e:any)=>{
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 60) changeDay(-1);   // vuốt sang phải → ngày trước
    if (diff < -60) changeDay(1);   // vuốt sang trái  → ngày sau
  };

  const changeDay = (delta:number)=>{
    const d = new Date(viewDate);
    d.setDate(d.getDate()+delta);
    setViewDate(d);
  };

  return (

    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        height:"100vh",
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        alignItems:"center",
        padding:12,
        background: dayTheme[viewDate.getDay()],
        userSelect:"none"
      }}
    >

      {/* ===== PHẦN TRÊN ===== */}
      <div style={{textAlign:"center", marginTop:10}}>

        <div style={{fontSize:14, opacity:.8}}>
          {`Tháng ${m} - ${y}`}
        </div>

        <div style={{
          fontSize:92,
          fontWeight:"900",
          color:"#002366",
          marginTop:6,
          lineHeight:1
        }}>
          {d}
        </div>

        <div style={{fontSize:20, fontWeight:"600"}}>
          {wd}
        </div>

        <div style={{
          marginTop:8,
          fontSize:13,
          opacity:.7
        }}>
          ⏰ {timeNow}
        </div>

        <div style={{marginTop:10,fontSize:15}}>
          🌙 Âm lịch: {lunarDay}/{lunarMonth}
        </div>

        <div style={{marginTop:6}}>
          🔮 {canchiYear}
        </div>

      </div>

      {/* ===== THANH THÔNG TIN ===== */}
      <div style={{
        width:"100%",
        borderRadius:18,
        background:"#ffffffdd",
        padding:"10px 14px"
      }}>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          fontSize:14
        }}>
          <div>
            <b>Ngày</b><br/>
            <span style={{color:"#c0392b"}}>{lunarDay}</span>
          </div>

          <div>
            <b>Tháng</b><br/>
            {lunarMonth}
          </div>

          <div>
            <b>Năm</b><br/>
            {y}
          </div>
        </div>
      </div>

      {/* ===== THANH MENU DƯỚI ===== */}
      <div style={{
        width:"100%",
        display:"flex",
        justifyContent:"space-around",
        paddingBottom:10
      }}>
        <button onClick={()=>router.push("/calendar/month")}>📅 Lịch tháng</button>
        <button onClick={()=>router.push("/notes")}>📝 Ghi chú</button>
        <button onClick={()=>router.push("/culture")}>🇻🇳 Văn hoá Việt</button>
      </div>

    </div>
  );
}
