import { Link } from "react-router-dom";
import { FileText, Mail, Phone, MapPin } from "lucide-react";

const FooterLink = ({ href, to, children }) => {
  const className = "block text-[var(--text-muted)] hover:text-white transition-colors duration-200 font-medium";
  if (to) {
    return <Link to={to} className={className}>{children}</Link>;
  }
  return <a href={href} className={className}>{children}</a>;
};

// removed external social links to keep footer realistic and focused

const ContactItem = ({ icon: Icon, children }) => (
  <div className="flex items-center justify-center space-x-3 text-[var(--text-secondary)]">
    <Icon className="w-5 h-5 flex-shrink-0 text-white/80" />
    <span className="font-medium">{children}</span>
  </div>
);

const Footer = () => {
  return (
     <footer className="bg-base text-white relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-[var(--text-muted)] place-items-center text-center">
          <div>
            <h4 className="text-white font-whyte font-semibold mb-3">Product</h4>
            <div className="space-y-2">
              <FooterLink href="/#features">Features</FooterLink>
              <FooterLink href="/#testimonials">Testimonials</FooterLink>
              <FooterLink href="/#faq">FAQ</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="text-white font-whyte font-semibold mb-3">Company</h4>
            <div className="space-y-2">
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/terms">Terms of Use</FooterLink>
                <FooterLink to="/security">Security</FooterLink>
          </div>
        </div>
          <div id="contact">
            <h4 className="text-white font-whyte font-semibold mb-3">Contact</h4>
            <div className="space-y-3 inline-block">
              <ContactItem icon={Mail}>iancliff15@gmail.com</ContactItem>
              <ContactItem icon={Phone}>+254 792 156 702</ContactItem>
              <ContactItem icon={MapPin}>Nairobi, Kenya</ContactItem>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-[var(--text-muted)]">© 2025 AI Invoice App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer