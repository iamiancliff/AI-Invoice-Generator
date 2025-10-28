import { ArrowRight } from "lucide-react"
import { FEATURES } from "../../utils/data"

const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-whyte font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-medium">
            Everything you need to streamline your invoicing process and grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div 
              key={index} 
              className="card-soft p-8 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon Container */}
              <div className="w-16 h-16 bg-[var(--accent-color)] rounded-2xl flex items-center justify-center mb-6 group-hover:brightness-95 transition-all duration-300 group-hover:scale-110">
                <feature.icon className="w-8 h-8 text-[var(--secondary-color)]" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-whyte">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 font-medium">
                  {feature.description}
                </p>
                
                {/* Learn More Link */}
                <a 
                  href="/#features" 
                  className="inline-flex items-center text-[var(--text-secondary)] font-medium hover:text-white transition-colors duration-300 group-hover:translate-x-1"
                >
                  Learn More 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features