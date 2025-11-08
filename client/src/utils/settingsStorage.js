// Simple localStorage-backed settings with sensible defaults for an invoice app
const STORAGE_KEY = 'aiinvoice_settings_v1';

export const defaultSettings = {
  branding: {
    logoDataUrl: '',
    accentColor: '#2563eb',
  },
  invoicePreferences: {
    currency: 'USD',
    paymentMethod: 'Bank',
    defaultTaxPercent: 0,
    defaultPaymentTerms: 'Net 15',
    invoicePrefix: 'INV',
  },
  paymentDetails: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    mpesaPaybill: '',
    mpesaAccount: '',
  },
  emailTemplates: {
    reminderSubject: 'Payment reminder for Invoice {{invoiceNumber}}',
    reminderBody:
      'Hi {{clientName}},\n\nThis is a friendly reminder that invoice {{invoiceNumber}} for {{currency}}{{total}} is due on {{dueDate}}.\n\nThank you,\n{{businessName}}',
  },
  ai: {
    provider: 'openai',
    apiKey: '', // kept in localStorage only on client
    model: 'gpt-4o-mini',
  },
  pdf: {
    showLogoOnPdf: true,
    tableDensity: 'comfortable',
  },
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch (e) {
    console.error('Failed to load settings', e);
    return { ...defaultSettings };
  }
}

export function saveSettings(settings) {
  const merged = { ...defaultSettings, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}


