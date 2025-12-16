// =======================
// User & Session
// =======================
export interface User {
  username: string;
  password: string;
}

export interface Session {
  token: string;
  username: string;
}

// =======================
// Item trong sổ (người mượn / giao dịch)
// =======================
export interface ListItem {
  date: string;      // ngày
  amount: number;    // số tiền
}

// =======================
// Sổ (Sổ chợ, Sổ cá, Sổ bán hàng…)
// =======================
export interface List {
  id: string;
  name: string;      // tên sổ
  items: ListItem[]; // danh sách giao dịch
}
