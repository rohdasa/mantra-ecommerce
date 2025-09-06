const Select = ({
  label,
  options = [],
  value,
  onChange,
  className = "",
  optionRenderer,
}) => {
  return (
    <div className={`relative inline-block w-full ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-28 appearance-none pr-8 pl-2 py-1 border border-gray-400 bg-white rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled hidden>
          {label || "Select an option"}
        </option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {optionRenderer ? optionRenderer(option) : option}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;
