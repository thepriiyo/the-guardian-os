'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import("./Scene"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#020617]" />
});

export function SceneWrapper() {
  return <Scene />;
}
