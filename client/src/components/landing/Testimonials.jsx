import React from 'react'
import { Quote, Star } from 'lucide-react'
import { TESTIMONIALS } from '../../utils/data'

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-base relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full" style={{background:"radial-gradient(circle at center, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%)"}}></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full" style={{background:"radial-gradient(circle at center, rgba(0,0,0,0.2), rgba(0,0,0,0) 60%)", animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-whyte font-bold text-white mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-medium">
            Join thousands of businesses that trust our AI-powered invoicing platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl group animate-fade-in-up border border-white/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-[var(--accent-color)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Quote className="w-6 h-6 text-[var(--secondary-color)]" />
              </div>

              {/* Stars */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < (testimonial.rating || 5)
                        ? "w-4 h-4 text-[#F9CE69] fill-current"
                        : "w-4 h-4 text-[#F9CE69]"
                    }
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/90 mb-8 leading-relaxed text-lg italic font-medium">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20" 
                />
                <div className="flex-1">
                  <p className="font-bold text-white text-lg font-whyte">
                    {testimonial.author}
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm font-medium">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <div className="text-4xl font-bold text-[#F9CE69] mb-2 font-whyte">
                10K+
              </div>
              <div className="text-[#D9EFF7] font-medium">Happy Customers</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold text-[#F9CE69] mb-2 font-whyte">
                50K+
              </div>
              <div className="text-[#D9EFF7] font-medium">Invoices Generated</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl font-bold text-[#F9CE69] mb-2 font-whyte">
                99.9%
              </div>
              <div className="text-[#D9EFF7] font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials