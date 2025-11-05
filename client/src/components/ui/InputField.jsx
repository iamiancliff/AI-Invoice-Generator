import React from 'react'

const InputField = ({icon: Icon, label, name, ...props}) => {
  return (
    <div>
    <label htmlFor={name} className="block text-sm font-medium text-[var(--text-primary)] mb-2">{label}</label>
    <div className="relative">
      {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-[var(--text-muted)]" />
      </div>}
      <input 
        id={name} 
        name={name} 
        {...props} 
        className={`w-full h-10 pr-3 py-2 border border-white/10 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#4FADC0]/60 focus:border-transparent ${Icon ? 'pl-10' : 'pl-3'}`}
      />
    </div>
  </div>
  )
}

export default InputField