import Sidebar from "@/components/layout/AdminSideBar";
import Navbar from "@/components/layout/AdminNavBar";
import { AuthProvider } from "@/context/auth_context";

export default function AdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden lg:block">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <header className="border-b">
            <Navbar />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
