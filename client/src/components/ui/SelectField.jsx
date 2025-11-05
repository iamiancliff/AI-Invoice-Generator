import React from 'react'

const SelectField = ({label, name, options, ...props}) => {
  return (
    <div>
    <label htmlFor={name} className="block text-sm font-medium text-[var(--text-primary)] mb-2">{label}</label>
    <select 
      id={name} 
      name={name} 
      {...props} 
      className="w-full h-10 px-3 py-2 border border-white/10 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#4FADC0]/60 focus:border-transparent"
    >
      {options.map(option => (
        <option key={option.value || option} value={option.value || option} className="bg-[var(--surface-2)] text-[var(--text-primary)]">
          {option.label || option}
        </option>
      ))}
    </select>
  </div>
  )
}

export default SelectField