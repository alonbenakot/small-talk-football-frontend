type Props = {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
};

const TogglePill = ({ options, selectedValue, onChange }: Props) => {
  return (
    <div className="flex justify-center mt-3 mb-1">
      <div className="flex rounded-lg overflow-hidden border border-emerald-600 text-sm font-medium">
        {options.map((option) => {
          const value = option.toLowerCase();
          return (
            <button
              key={value}
              className={`px-4 py-1.5 transition duration-300 cursor-pointer ${
                selectedValue === value
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-emerald-600 hover:bg-emerald-50"
              }`}
              onClick={() => onChange(value)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TogglePill;
