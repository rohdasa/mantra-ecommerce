const Select = ({
  label,
  options = [],
  value,
  onChange,
  className = "",
  optionRenderer, // Optional custom rendering for options (e.g., colored swatches)
}) => {
  return (
    <div className={`flex relative inline-block ${className}`}>
      {label && (
        <label className="block text-md text-gray-700 ">{label}:</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full ml-2 p-1 border border-gray-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {optionRenderer ? optionRenderer(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
