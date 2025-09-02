// components/QuantitySelect.jsx
import React from "react";
import Select from "react-select";

const quantityOptions = [1, 2, 3, 4, 5].map((qty) => ({
  value: qty,
  label: qty.toString(),
}));

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
    fontSize: "0.875rem",
    minHeight: "2.25rem",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
    fontSize: "0.875rem",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eff6ff" : "white",
    color: state.isSelected ? "#1d4ed8" : "#374151",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#374151",
  }),
};

const QuantitySelect = ({ quantity, onChange }) => {
  return (
    <div className="flex items-center space-x-2 mt-3">
      <span className="text-sm text-gray-600">Qty:</span>
      <div className="w-24">
        <Select
          options={quantityOptions}
          value={quantityOptions.find((opt) => opt.value === quantity)}
          onChange={(selectedOption) => onChange(selectedOption.value)}
          styles={customStyles}
          isSearchable={false}
        />
      </div>
    </div>
  );
};

export default QuantitySelect;
