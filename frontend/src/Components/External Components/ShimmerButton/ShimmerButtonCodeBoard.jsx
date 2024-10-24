import ShimmerButton from "./ShimmerButton";

export function ShimmerButtonCodeBoard({ buttonLabel, handleClick }) {
  return (
    <div className="z-10 flex items-center justify-center ">
      <ShimmerButton
        className="w-40 shadow-2xl md:w-56 lg:w-56"
        borderRadius="15px"
        shimmerSize="0"
        shimmerDuration="0"
        spread="0deg"
        background="224 71% 4%"
        onClick={handleClick}
      >
        <span className="text-[12px] md:text-[18px] font-medium leading-none tracking-tight text-center text-white whitespace-pre-wrap dark:from-white dark:to-slate-900/10 lg:text-lg">
          {buttonLabel}
        </span>
      </ShimmerButton>
    </div>
  );
}
