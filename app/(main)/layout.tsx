import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value;

  // ❌ chưa login → ép về /login
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
