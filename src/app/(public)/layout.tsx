import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col w-full h-full max-w-xl mx-auto justify-start min-h-screen px-4 md:px-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
