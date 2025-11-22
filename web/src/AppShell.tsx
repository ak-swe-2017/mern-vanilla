import NavBar from "./components/NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container max-w-[1200px] mx-auto px-4 py-10">
        {children}
      </main>
    </div>
  );
}
