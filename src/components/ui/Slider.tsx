interface SliderProps {
  value: number;
  onChange: (val: number) => void;
}

const Slider = ({ value, onChange }: SliderProps) => {
  return (
    <div className="relative w-full h-4 flex items-center group">
      {/* Background Track */}
      <div className="absolute w-full h-1 bg-[#e5e5ea] dark:bg-[#39393d] rounded-full" />

      {/* Filled Track */}
      <div
        className="absolute h-1 bg-[#007aff] rounded-full"
        style={{ width: `${value}%` }}
      />

      {/* Thumb */}
      <div
        className="absolute w-3.5 h-6.25 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-black/5 dark:border-white/10 z-10 pointer-events-none transition-transform group-hover:scale-110"
        style={{ left: `calc(${value}% - 7px)` }}
      />

      {/* Hidden Input for interaction */}
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
      />
    </div>
  );
};

export default Slider;
