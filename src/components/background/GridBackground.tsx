// src/components/background/GridBackground.tsx
export default function GridBackground() {
  return (
    <>
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:opacity-0 transition-opacity duration-500 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern-dark bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),transparent)] opacity-0 dark:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Animated Blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary-400/20 blur-[100px] mix-blend-multiply animate-float dark:bg-primary-500/10 dark:mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px] mix-blend-multiply animate-float dark:bg-blue-500/10 dark:mix-blend-screen pointer-events-none" style={{animationDelay: '2s'}}></div>
    </>
  )
}