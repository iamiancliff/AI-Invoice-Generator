import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  Loader2,
  Trash2,
  Edit,
  Search,
  FileText,
  Plus,
  AlertCircle,
  Sparkles,
  Mail,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import CreateWithAIModal from "../../components/invoices/CreateWithAIModal";
import ReminderModal from "../../components/invoices/ReminderModal";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        setInvoices(
          response.data.sort(
            (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
          )
        );
      } catch (err) {
        setError("Failed to fetch invoices.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
     if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter(invoice => invoice._id !== id));
      } catch (err) {
        setError('Failed to delete invoice.');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (invoice) => {
    setStatusChangeLoading(invoice._id);
    try {
      const newStatus = invoice.status === 'Paid' ? 'Unpaid' : 'Paid';
      const updatedInvoice = { ...invoice, status: newStatus };
      
      const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), updatedInvoice);
      
      setInvoices(invoices.map(inv => inv._id === invoice._id ? response.data : inv));
    } catch (err) {
      setError('Failed to update invoice status.');
      console.error(err);
    } finally {
      setStatusChangeLoading(null);
    }
  };

  const handleOpenReminderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(
        (invoice) => statusFilter === "All" || invoice.status === statusFilter
      )
      .filter(
        (invoice) =>
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.billTo.clientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
  }, [invoices, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center itw-8 h-8 animate-spin text-[var(--accent-color)]">
        <Loader2 className="" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateWithAIModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            All Invoices
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all your invoices in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsAiModalOpen(true)}
            icon={Sparkles}
          >
            Create with AI
          </Button>
          <Button variant="primary" onClick={() => navigate("/invoices/new")} icon={Plus}>
            Create Invoice
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-200 mb-1">Error</h3>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="card-clean">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <input
                type="text"
                placeholder="Search by invoice # or client..."
                className="w-full h-10 pl-10 pr-4 py-2 border border-white/10 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <select
                className="w-full sm:w-auto h-10 px-3 py-2 border border-white/10 rounded-lg bg-[var(--surface-2)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/60"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No invoices found</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md">Your search or filter criteria did not match any invoices. Try adjusting your search.</p>
            {invoices.length === 0 && (
              <Button onClick={() => navigate('/invoices/new')} icon={Plus}>Create First Invoice</Button>
            )}
          </div>
        ) : (
          <div className="w-[90vw] md:w-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[var(--surface-2)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-[var(--surface-1)] divide-y divide-white/10">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice._id} className="hover:bg-white/5">
                    <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)] cursor-pointer">{invoice.invoiceNumber}</td>
                    <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)] cursor-pointer">{invoice.billTo.clientName}</td>
                    <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)] cursor-pointer">${invoice.total.toFixed(2)}</td>
                    <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)] cursor-pointer">{moment(invoice.dueDate).format('MMM D, YYYY')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' ? 'bg-green-500/15 text-green-300' : 
                        invoice.status === 'Pending' ? 'bg-[var(--accent-color)]/30 text-[var(--secondary-color)]' :
                        'bg-red-500/15 text-red-300'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size="small" 
                          variant="secondary" 
                          onClick={() => handleStatusChange(invoice)}
                          isLoading={statusChangeLoading === invoice._id}
                        >
                          {invoice.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                        </Button>
                        <button 
                          size="small" 
                          onClick={() => navigate(`/invoices/${invoice._id}`)}
                          className="p-2 rounded-lg bg-[#4FADC0]/20 hover:bg-[#4FADC0]/30 text-[#4FADC0] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          size="small" 
                          onClick={() => handleDelete(invoice._id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {invoice.status !== 'Paid' && (
                          <button 
                            size="small" 
                            onClick={() => handleOpenReminderModal(invoice._id)}
                            className="p-2 rounded-lg bg-[var(--accent-color)]/20 hover:bg-[var(--accent-color)]/30 text-[var(--accent-color)] transition-colors"
                            title="Generate Reminder"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInvoices;
