import { ReactNode } from "react";

export const metadata = {
  title: "CampOS Admin Dashboard",
  description: "Manage your community events, members, and resources",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
