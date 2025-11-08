import { useState } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { getSettings, saveSettings } from "../../utils/settingsStorage";

const SettingsPage = () => {
  const [settings, setSettings] = useState(getSettings());
  const [saving, setSaving] = useState(false);

  const onSettingsChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      invoicePreferences: {
        ...prev.invoicePreferences,
        [key]: value,
      },
    }));
  };

  const onSave = () => {
    try {
      setSaving(true);
      saveSettings(settings);
      toast.success("Settings saved");
    } catch (e) {
      toast.error("Failed to save");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg md:text-xl font-whyte font-medium text-[var(--text-primary)] mb-2">Settings</h3>
        <p className="text-lg text-[var(--text-secondary)]">Configure default invoice preferences.</p>
      </div>

      <div className="card-clean p-6 space-y-4 max-w-4xl">
        <h4 className="text-md font-semibold text-[var(--text-primary)]">Invoice Preferences</h4>
        <p className="text-sm text-[var(--text-secondary)] mb-4">These settings will be used as defaults when creating new invoices.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField 
            label="Payment Method" 
            name="paymentMethod" 
            value={settings.invoicePreferences.paymentMethod || 'Bank'} 
            onChange={(e) => onSettingsChange('paymentMethod', e.target.value)}
            options={[
              { value: 'Bank', label: 'Bank Transfer' },
              { value: 'Mpesa', label: 'Mpesa' },
              { value: 'International', label: 'International Payments' },
            ]}
          />
          <InputField 
            label="Default Payment Terms" 
            name="defaultPaymentTerms" 
            value={settings.invoicePreferences.defaultPaymentTerms} 
            onChange={(e) => onSettingsChange('defaultPaymentTerms', e.target.value)}
            placeholder="e.g. Net 15, Net 30"
          />
          <InputField 
            label="Default Tax %" 
            type="number" 
            name="defaultTaxPercent" 
            value={settings.invoicePreferences.defaultTaxPercent} 
            onChange={(e) => onSettingsChange('defaultTaxPercent', Number(e.target.value))}
          />
          <InputField 
            label="Invoice Prefix" 
            name="invoicePrefix" 
            value={settings.invoicePreferences.invoicePrefix} 
            onChange={(e) => onSettingsChange('invoicePrefix', e.target.value)}
            placeholder="e.g. INV"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} isLoading={saving}>Save Settings</Button>
      </div>
    </div>
  );
};

export default SettingsPage;


