import AgentWrapper from "@/components/layout/AgentWapper";
import React from "react";
import "../globals.css";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AgentWrapper>{children}</AgentWrapper>
      </body>
    </html>
  );
}
