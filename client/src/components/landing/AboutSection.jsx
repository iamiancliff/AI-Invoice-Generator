import React from "react";
import { Users, Sparkles, ListChecks, Shield, LifeBuoy } from "lucide-react";

const Card = ({ icon: Icon, title, children }) => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-shadow duration-300 shadow-none hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] min-h-[180px]">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white/90" />
      </div>
      <h3 className="text-white font-semibold">{title}</h3>
    </div>
    <div className="text-[var(--text-secondary)] leading-relaxed">
      {children}
    </div>
  </div>
);

const AboutSection = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-base">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-whyte font-bold text-white mb-3">About AI Invoice App</h2>
          <p className="text-[var(--text-secondary)] max-w-3xl mx-auto">
            A focused, modern tool to create invoices fast and keep cash flow healthy, powered by AI for speed and accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-stretch">
          <Card icon={Users} title="Who it's for">
            Freelancers, small agencies, and growing businesses with recurring invoicing needs.
          </Card>

          <Card icon={Sparkles} title="What you can do">
            Generate AI‑assisted invoices, automate reminders, and track status with clear insights.
          </Card>

          <Card icon={ListChecks} title="How it works">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Sign up and create your company profile.</li>
              <li>Create an invoice by filling the form or pasting a short brief. AI structures it for you.</li>
              <li>Send to clients and enable reminders.</li>
              <li>Track status on the dashboard.</li>
            </ol>
          </Card>

          <Card icon={Shield} title="Data and security">
            We store only what's needed to generate and send invoices. Access is authenticated and sensitive operations use server‑side validation. Export or delete your data any time from your profile.
          </Card>

          <Card icon={LifeBuoy} title="Support">
            Questions or feedback? Email iancliff15@gmail.com. Typical response time is 1–2 business days.
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
