import AdminWrapper from "@/components/layout/AdminWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {" "}
      <body className={`antialiased`}>
        <AdminWrapper>{children}</AdminWrapper>
      </body>
    </html>
  );
}
