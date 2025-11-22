export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[75vh] grid place-items-center">
      <div
        className="card w-full max-w-xl bg-base-100 shadow-xl border border-base-200"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="card-body p-6 md:p-10">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="opacity-70 mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
