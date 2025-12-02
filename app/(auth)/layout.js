export default function AuthLayout({ children }) {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      {children}
    </main>
  );
}