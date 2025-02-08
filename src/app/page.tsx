import Image from "next/image";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Obituary from "@/components/sections/Obituary";
import Gallery from "@/components/sections/Gallery";
import Notice from "@/components/sections/Notice";
import Timeline from "@/components/sections/Timeline";
import MemoryWall from "@/components/sections/MemoryWall";
import Quote from "@/components/sections/Quote";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="xl:px-60 lg:px-28 md:px-10 px-2">
        <Navigation />
        <Quote />
        <Obituary />
        <Gallery />
        <MemoryWall />
        <Notice />
        <Timeline />

        <div>
          <p className="text-center text-gray-500 text-sm py-6 border-t border-gray-200"><span className="font-semibold text-primary">Larry Broderick</span> - Santa Rosa raptor expert & well-known naturalist</p>
        </div>
      </div>
    </main>
  );
}
