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
     ADD / DELETE ROW
  ======================= */
  const addRow = () => {
    setRows([
      ...rows,
      { name: "", phone: "", total: 0, payments: [{ date: "", amount: 0 }] },
    ]);
  };

  const deleteRow = (index: number) => {
    const code = prompt("🔐 Nhập mã xoá (1234)");
    if (code !== "1234") {
      alert("❌ Sai mã – không thể xoá");
      return;
    }

    if (!confirm("⚠️ Xoá vĩnh viễn dòng này?")) return;

    const copy = [...rows];
    copy.splice(index, 1);
    setRows(copy);
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

    if (field === "amount") {
      let num = Number(value);
      if (num < 0) num = 0;
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
     COPY
  ======================= */
  const copyAll = () => {
    let text = `📒 ${list?.name}\n\n`;

    rows.forEach((r, i) => {
      text += `${i + 1}. ${r.name} (${r.phone || "-"})\n`;
      text += `Nợ: ${r.total}\n`;

      r.payments
        .filter((p) => p.date && p.amount > 0)
        .forEach((p) => {
          text += `  - ${p.date}: ${p.amount}\n`;
        });

      text += `Còn lại: ${remaining(r)}\n\n`;
    });

    text += `💰 Tổng thu: ${totalPaid}\n`;
    text += `📉 Tổng còn nợ: ${totalRemain}`;

    navigator.clipboard.writeText(text);
    alert("📋 Đã copy");
  };

  if (loading) return <p style={{ padding: 24 }}>Đang tải…</p>;
  if (!list) return <p>❌ Không tồn tại</p>;

  /* =======================
     UI
  ======================= */
  return (
    <div style={{ padding: 12 }}>
      <h2>📒 {list.name}</h2>

      <table
        border={1}
        cellPadding={6}
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>SĐT</th>
            <th>Nợ</th>
            <th>Ngày & Tiền</th>
            <th>Còn</th>
            <th>❌</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => {
            const remain = remaining(r);
            const done = remain === 0;

            return (
              <tr key={i} style={{ background: done ? "#e8f8ee" : undefined }}>
                <td>{i + 1}</td>

                <td>
                  <input
                    value={r.name}
                    onChange={(e) => {
                      const c = [...rows];
                      c[i].name = e.target.value;
                      setRows(c);
                    }}
                  />
                </td>

                <td>
                  <input
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
                      <div
                        key={pi}
                        style={{
                          display: "flex",
                          gap: 4,
                          alignItems: "center",
                          border: "1px solid #ddd",
                          padding: "2px 4px",
                          borderRadius: 6,
                        }}
                      >
                        <DateInput
                          value={p.date}
                          onChange={(v) =>
                            updatePayment(i, pi, "date", v)
                          }
                        />
                        <input
                          type="number"
                          value={p.amount || ""}
                          style={{ width: 70 }}
                          onChange={(e) =>
                            updatePayment(
                              i,
                              pi,
                              "amount",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </td>

                <td style={{ fontWeight: "bold", color: done ? "green" : "black" }}>
                  {done ? "✓" : remain}
                </td>

                <td>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteRow(i)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}

          <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
            <td colSpan={4} align="right">Tổng</td>
            <td>Thu: {totalPaid}</td>
            <td>Nợ: {totalRemain}</td>
            <td />
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
        <button onClick={addRow}>➕ Thêm</button>
        <button onClick={copyAll}>📋 Copy</button>
        <button onClick={save}>💾 Lưu</button>
      </div>
    </div>
  );
}
