import { Loader2 } from "lucide-react"

const Button = ({
  variant = 'primary', 
  size = 'medium', 
  isLoading = false, 
  children, 
  icon: Icon,
  className = '',
  ...props }) => {

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4FADC0]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-[#4FADC0] hover:bg-[#3E95A7] text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white hover:bg-gray-50 text-[#193948] border-2 border-white/20 hover:border-[#4FADC0] hover:text-[#4FADC0] shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-[#4FADC0]/10 text-[var(--text-primary)] hover:text-[#4FADC0]',
    outline: 'bg-transparent border-2 border-[#4FADC0] text-[#4FADC0] hover:bg-[#4FADC0] hover:text-white shadow-sm hover:shadow-md',
    accent: 'bg-[#E76268] hover:bg-[#d55a5f] text-white shadow-sm hover:shadow-md',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md',
  };

  const sizeClasses = {
    small: 'px-4 py-2 h-9 text-sm',
    medium: 'px-6 py-3 h-11 text-sm',
    large: 'px-8 py-4 h-14 text-base',
    xl: 'px-10 py-5 h-16 text-lg',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button