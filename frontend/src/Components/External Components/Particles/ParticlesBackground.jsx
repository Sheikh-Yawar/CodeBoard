import { cn } from "../../../../lib/utils";
import Particles from "./Particles";

export function ParticlesBackground({ children, className }) {
  return (
    <div
      className={cn("relative overflow-hidden bg-background h-10", className)}
    >
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
