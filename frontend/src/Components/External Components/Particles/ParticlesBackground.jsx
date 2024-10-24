import Particles from "./Particles";

export function ParticlesBackground({ children }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <Particles
        className="w-full h-full "
        quantity={400}
        ease={20}
        color={"#ffffff"}
        refresh
      />
      {children}
    </div>
  );
}
