"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { List } from "@/app/types";
import DateInput from "@/app/components/DateInput";

/* =======================
   TYPES
======================= */
interface Payment {
  date: string;
  amount: number;
}

interface Row {
  name: string;
  phone?: string;
  total: number;
  payments: Payment[];
}

/* =======================
   PAGE
======================= */
export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [list, setList] = useState<List | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
  /* =======================
     LOAD DATA
  ======================= */
  useEffect(() => {
    fetch(`/api/lists/${id}`)
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data: List | null) => {
        if (!data) return;

        setList(data);

        const initRows =
          ((data.items as unknown) as Row[])?.map((r) => ({
            ...r,
            payments:
              r.payments && r.payments.length > 0
                ? [...r.payments, { date: "", amount: 0 }]
                : [{ date: "", amount: 0 }],
          })) ?? [];

        setRows(initRows);
        setLoading(false);
      });
  }, [id, router]);

  /* =======================
     ADD PERSON
  ======================= */
  const addRow = () => {
    setRows([
      ...rows,
      {
        name: "",
        phone: "",
        total: 0,
        payments: [{ date: "", amount: 0 }],
      },
    ]);
  };
   /* =======================
   DELETE SELECTED ROWS
======================= */
const deleteSelectedRows = () => {
  if (selectedRows.length === 0) return;

  const ok = confirm("Bạn chắc chắn muốn xoá các dòng đã chọn?");
  if (!ok) return;

  setRows(rows.filter((_, i) => !selectedRows.includes(i)));
  setSelectedRows([]);
};

  /* =======================
     CALCULATE
  ======================= */
  const paidOfRow = (row: Row) =>
    row.payments
      .filter((p) => p.date && p.amount > 0)
      .reduce((s, p) => s + p.amount, 0);

  const remaining = (row: Row) => row.total - paidOfRow(row);

  const totalPaid = rows.reduce((s, r) => s + paidOfRow(r), 0);
  const totalRemain = rows.reduce((s, r) => s + remaining(r), 0);

  /* =======================
     UPDATE PAYMENT
  ======================= */
  const updatePayment = (
    rowIndex: number,
    payIndex: number,
    field: "date" | "amount",
    value: string | number
  ) => {
    const copy = [...rows];
    const row = copy[rowIndex];
    const payments = [...row.payments];

    const paidBefore = payments
      .slice(0, payIndex)
      .filter(p => p.date && p.amount > 0)
      .reduce((s, p) => s + p.amount, 0);

    const remain = row.total - paidBefore;

    if (field === "amount") {
  let num = Number(value);
  if (num < 0) num = 0; // chỉ chặn âm
  payments[payIndex] = { ...payments[payIndex], amount: num };
} else {
      payments[payIndex] = { ...payments[payIndex], date: value as string };
    }

    const last = payments[payments.length - 1];
    if (last.date && last.amount > 0 && remaining({ ...row, payments }) > 0) {
      payments.push({ date: "", amount: 0 });
    }

    copy[rowIndex].payments = payments;
    setRows(copy);
  };

  /* =======================
     SAVE
  ======================= */
  const save = async () => {
    const cleaned = rows.map((r) => ({
      ...r,
      payments: r.payments.filter((p) => p.date && p.amount > 0),
    }));

    await fetch(`/api/lists/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned),
    });

    alert("✅ Đã lưu");
  };
   
   /* =======================
   COPY SELECTED ROWS
======================= */
const copySelected = () => {
  if (selectedRows.length === 0) {
    alert("Vui lòng chọn ít nhất 1 dòng để copy");
    return;
  }

  let text = `📒 ${list?.name}\n\n`;

  selectedRows.forEach((i, idx) => {
    const r = rows[i];
    if (!r) return;

    text += `${idx + 1}. ${r.name} (${r.phone || "-"})\n`;
    text += `Nợ: ${r.total}\n`;

    r.payments
      .filter((p) => p.date && p.amount > 0)
      .forEach((p) => {
        text += `  - ${p.date}: ${p.amount}\n`;
      });

    text += `Còn lại: ${remaining(r)}\n\n`;
  });

  navigator.clipboard.writeText(text);
  alert(`📋 Đã copy ${selectedRows.length} dòng đã chọn`);
};
  /* =======================
     UI
  ======================= */
  return (
    <div
  style={{
    padding: 12,
    paddingBottom: "calc(90px + env(safe-area-inset-bottom))",
  }}
>
      <h2>📒 {list?.name}</h2>

      <table
        border={1}
        cellPadding={6}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
          marginRight: 8,
        }}
      >
        <thead>
  <tr>
    <th>
      <input
        type="checkbox"
        checked={selectedRows.length === rows.length && rows.length > 0}
        onChange={(e) =>
          setSelectedRows(
            e.target.checked ? rows.map((_, i) => i) : []
          )
        }
      />
    </th>
    <th>STT</th>
    <th>Tên</th>
    <th>SĐT</th>
    <th>Nợ</th>
    <th>Ngày trả</th>
    <th>Còn</th>
  </tr>
</thead>

        <tbody>
          {rows.map((r, i) => {
            const remain = remaining(r);
            const done = remain === 0;

            return (
              <tr key={i} style={{ background: done ? "#e8f8ee" : undefined }}>
  <td>
    <input
      type="checkbox"
      checked={selectedRows.includes(i)}
      onChange={(e) =>
        setSelectedRows(
          e.target.checked
            ? [...selectedRows, i]
            : selectedRows.filter((x) => x !== i)
        )
      }
    />
  </td>
  <td>{i + 1}</td>

                {/* ✅ CHỈ SỬA Ô TÊN */}
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <input
                      placeholder="Tên"
                      style={{ width: 120 }}
                      value={r.name.split("\n")[0] || ""}
                      onChange={(e) => {
                        const c = [...rows];
                        const note = r.name.split("\n")[1] || "";
                        c[i].name = e.target.value + (note ? "\n" + note : "");
                        setRows(c);
                      }}
                    />
                    <input
                      placeholder="Ghi chú (tuỳ chọn)"
                      style={{ width: 120, fontSize: 12 }}
                      value={r.name.split("\n")[1] || ""}
                      onChange={(e) => {
                        const c = [...rows];
                        const main = r.name.split("\n")[0] || "";
                        c[i].name = main + (e.target.value ? "\n" + e.target.value : "");
                        setRows(c);
                      }}
                    />
                  </div>
                </td>

                <td>
                  <input
                    style={{ width: 90 }}
                    value={r.phone ?? ""}
                    onChange={(e) => {
                      const c = [...rows];
                      c[i].phone = e.target.value;
                      setRows(c);
                    }}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    style={{ width: 70 }}
                    value={r.total}
                    onChange={(e) => {
                      const c = [...rows];
                      c[i].total = Number(e.target.value);
                      setRows(c);
                    }}
                  />
                </td>

                <td>
                  <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                    {r.payments.map((p, pi) => (
                      <div key={pi} style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 60 }}>
                        <DateInput
  value={p.date}
  onChange={(val) =>
    updatePayment(i, pi, "date", val)
  }
/>

                        <input
                          type="number"
                          placeholder="Tiền"
                          value={p.amount || ""}
                          style={{ width: 60, textAlign: "center" }}
                          onChange={(e) =>
                            updatePayment(i, pi, "amount", Number(e.target.value))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </td>

                <td style={{ fontWeight: "bold", color: done ? "green" : "black" }}>
                  {done ? "✓" : remain}
                </td>
              </tr>
            );
          })}

          <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
            <td colSpan={5} align="right">Tổng</td>
            <td>Thu: {totalPaid}</td>
            <td>Nợ: {totalRemain}</td>
          </tr>
        </tbody>
      </table>

    <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
  <button onClick={addRow}>➕ Thêm</button>

  {selectedRows.length > 0 && (
    <button
      onClick={deleteSelectedRows}
      style={{ background: "red", color: "white" }}
    >
      🗑️ Xoá ({selectedRows.length})
    </button>
  )}

{selectedRows.length > 0 && (
  <button onClick={copySelected}>📋 Copy </button>
)}
  <button onClick={save}>💾 Lưu</button>
</div>
    </div>
  );
}
