"use client";

interface Props {
  value: string;
  onChange: (val: string) => void;
  width?: number;
}

export default function DateInput({
  value,
  onChange,
  width = 70,
}: Props) {
  // chuyển dd/mm/yyyy -> yyyy-mm-dd cho input type=date
  const toISO = (v: string) => {
    if (!v) return "";
    const [d, m, y] = v.split("/");
    if (!d || !m || !y) return "";
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  // chuyển yyyy-mm-dd -> dd/mm/yyyy để lưu
  const fromISO = (v: string) => {
    if (!v) return "";
    const [y, m, d] = v.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <input
      type="date"
      value={toISO(value)}
      style={{ width, textAlign: "center" }}
      onChange={(e) => onChange(fromISO(e.target.value))}
    />
  );
}
