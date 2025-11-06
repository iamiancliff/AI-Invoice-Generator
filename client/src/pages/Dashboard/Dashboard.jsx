import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, FileText, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
import AIInsightsCard from "../../components/AIInsightsCard";

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        const invoices = response.data;

        const totalInvoices = invoices.length;
        const totalPaid = invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);
        const totalUnpaid = invoices
          .filter((inv) => inv.status !== "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });
        setRecentInvoices(
          invoices
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `${stats.totalPaid.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: `${stats.totalUnpaid.toFixed(2)}`,
      color: "red",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-white/10", text: "text-[var(--text-primary)]" },
    emerald: { bg: "bg-green-500/15", text: "text-green-300" },
    red: { bg: "bg-red-500/15", text: "text-red-300" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h3 className="text-lg md:text-xl font-whyte font-medium text-[var(--text-primary)] mb-2 tracking-tight leading-tight">
          Dashboard
        </h3>
        <p className="text-lg text-[var(--text-secondary)]">
          A comprehensive overview of your business finances and performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="card-clean p-8 group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-16 h-16 ${
                  colorClasses[stat.color].bg
                } rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
              >
                <stat.icon
                  className={`w-8 h-8 ${colorClasses[stat.color].text}`}
                />
              </div>
              <div className="ml-6 min-w-0">
                <div className="text-sm font-semibold text-[var(--text-secondary)] truncate mb-2">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-[var(--text-primary)] break-words">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Card */}
      <AIInsightsCard />

      {/* Recent Invoices */}
      <div className="w-full card-clean overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="text-lg md:text-xl font-whyte font-medium text-[var(--text-primary)] mb-2 tracking-tight leading-tight">
              Recent Invoices
            </h3>
            <p className="text-[var(--text-secondary)]">Your latest invoice activity and status updates.</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/invoices")}>
            View All
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="w-[90vw] md:w-auto overflow-x-auto">
            <table className="w-full min-w-[600px] divide-y divide-white/10">
              <thead className="bg-[var(--surface-2)]">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--surface-1)] divide-y divide-white/10">
                {recentInvoices.map((invoice, index) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-white/5 cursor-pointer transition-colors duration-200 group"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors duration-200">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)] font-medium">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors duration-200">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                          invoice.status === "Paid"
                            ? "bg-green-500/15 text-green-300 border border-green-500/20"
                            : invoice.status === "Pending"
                            ? "bg-[var(--accent-color)]/30 text-[var(--secondary-color)] border border-[var(--accent-color)]/40"
                            : "bg-red-500/15 text-red-300 border border-red-500/20"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base text-[var(--text-secondary)] font-medium">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-[var(--accent-color)]/15 rounded-3xl flex items-center justify-center mb-8">
              <FileText className="w-12 h-12 text-[var(--accent-color)]" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
              No invoices yet
            </h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md text-lg leading-relaxed">
              You haven't created any invoices yet. Get started by creating your
              first one with our AI-powered tools.
            </p>
            <Button 
              onClick={() => navigate("/invoices/new")} 
              icon={Plus}
              size="large"
            >
              Create Your First Invoice
            </Button>
          </div>
        )}
      </div>
      
    </div>
  )
}

export default Dashboard