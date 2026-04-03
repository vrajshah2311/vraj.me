import Sidebar from "@/components/Sidebar";

export default function SidebarPreview() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
        Page content goes here
      </main>
    </div>
  );
}
