interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const Toggle = ({ isOn, onToggle }: ToggleProps) => {
  return (
    <div
      onClick={onToggle}
      className={`w-9.5 h-5.5 rounded-full relative cursor-pointer transition-colors duration-200 ${
        isOn ? "bg-[#007aff]" : "bg-[#e5e5ea] dark:bg-[#39393d]"
      }`}
    >
      <div
        className={`absolute top-0.5 w-4.5 h-4.5 rounded-full shadow-md transition-transform duration-200 bg-white ${
          isOn ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </div>
  );
};

export default Toggle;
