import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        <DocsSidebar />
        <main className="min-w-0 max-w-3xl">{children}</main>
      </div>
    </div>
  );
}
