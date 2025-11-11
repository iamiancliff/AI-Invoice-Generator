import { BarChart2, FileText, LayoutDashboard, Mail, Plus, Sparkles, Users, Settings as SettingsIcon, CreditCard, LineChart } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Invoice Creation",
    description:
      "Paste any text, email, or receipt, and let our AI instantly generate a complete, professional invoice for you.",
  },
  {
    icon: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get smart, actionable insights about your business finances, generated automatically by our AI analyst.",
  },
  {
    icon: Mail,
    title: "Smart Reminders",
    description:
      "Automatically generate polite and effective payment reminder emails for overdue invoices with a single click.",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:
      "Easily manage all your invoices, track payments, and send reminders for overdue payments.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "Invoices that used to take an evening now take ten minutes. Clients pay faster too.",
    author: "Juma Amina",
    title: "Event Photographer",
    avatar: "https://placehold.co/100x100/0B3D91/ffffff?text=JA",
    rating: 5,
  },
  {
    quote: "The reminders are polite but effective. Cash flow is noticeably steadier.",
    author: "Kelvin Barasa",
    title: "Logistics SME Owner",
    avatar: "https://placehold.co/100x100/0B3D91/ffffff?text=KB",
    rating: 5,
  },
  {
    quote: "Importing details from emails is a lifesaver. Clean PDFs every time.",
    author: "Jayden Otieno",
    title: "Freelance Developer",
    avatar: "https://placehold.co/100x100/0B3D91/ffffff?text=JO",
    rating: 4,
  },
  {
    quote: "Our team finally has one place for invoices—search and filters actually help.",
    author: "Oliver Collins",
    title: "Operations Lead",
    avatar: "https://placehold.co/100x100/0B3D91/ffffff?text=OC",
    rating: 4,
  },
  {
    quote: "Dashboard totals are spot on, so month‑end is no longer a scramble.",
    author: "Neema Zuri",
    title: "Accountant",
    avatar: "https://placehold.co/100x100/0B3D91/ffffff?text=NZ",
    rating: 5,
  },
  {
    quote: "Setup took minutes. I send invoices on my phone between meetings.",
    author: "Leila Amani",
    title: "Consultant",
    avatar: "https://placehold.co/100x100/0B3D91/ffffff?text=LA",
    rating: 5,
  },
];

export const FAQS = [
  {
    question: "How does the AI invoice creation work?",
    answer: "Simply paste any text that contains invoice details—like an email, a list of items, or a work summary—and our AI will instantly parse it to pre-fill a new invoice for you, saving you time and effort."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, you can try our platform for free for 14 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
  },
  {
    question: "Can I change my plan later?",
    answer: "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We understand that things change. You can cancel your plan at any time and we’ll refund you the difference already paid."
  },
  {
    question: "Can other info be added to an invoice?",
    answer: "Yes, you can add notes, payment terms, and even attach files to your invoices."
  },
  {
    question: "How does billing work?",
    answer: "Plans are per workspace, not per account. You can upgrade one workspace, and still have any number of free workspaces."
  },
  {
    question: "How do I change my account email?",
    answer: "You can change your account email from your profile settings page."
  }
];

// Navigation items configuration
export const NAVIGATION_MENU = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", name: "Invoices", icon: FileText },
  { id: "invoices/new", name: "Create Invoice", icon: Plus },
  { id: "payments", name: "Payments", icon: CreditCard },
  { id: "reports", name: "Reports", icon: LineChart },
  { id: "settings", name: "Settings", icon: SettingsIcon },
  { id: "profile", name: "Profile", icon: Users },
];
