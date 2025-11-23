"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/src/components/3d/Scene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#0a0a1e] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return (
    <main className="fixed inset-0 text-foreground overflow-hidden">
      <Scene />
    </main>
  );
}
