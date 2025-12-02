import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

export default async function MainLayout({ children }) {
  const user = await currentUser();

  // If no user is logged in, redirect them to the sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}