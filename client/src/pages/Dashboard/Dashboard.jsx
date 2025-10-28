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
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-paytone text-[#193948] mb-2">DASHBOARD</h2>
        <p className="text-lg text-[#6B7280]">
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
                <div className="text-sm font-semibold text-[#6B7280] truncate mb-2">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-[#193948] break-words">
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
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-paytone text-[#193948] mb-2">
              RECENT INVOICES
            </h3>
            <p className="text-[#6B7280]">Your latest invoice activity and status updates.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            View All
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="w-[90vw] md:w-auto overflow-x-auto">
            <table className="w-full min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[#193948] uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[#193948] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[#193948] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-[#193948] uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice, index) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-[#4FADC0]/5 cursor-pointer transition-colors duration-200 group"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base font-semibold text-[#193948] group-hover:text-[#4FADC0] transition-colors duration-200">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="text-sm text-[#6B7280] font-medium">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-lg font-bold text-[#193948] group-hover:text-[#4FADC0] transition-colors duration-200">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : invoice.status === "Pending"
                            ? "bg-[#FCDC73] text-[#193948] border border-[#FCDC73]"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base text-[#6B7280] font-medium">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-[#4FADC0]/10 rounded-3xl flex items-center justify-center mb-8">
              <FileText className="w-12 h-12 text-[#4FADC0]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#193948] mb-4">
              No invoices yet
            </h3>
            <p className="text-[#6B7280] mb-8 max-w-md text-lg leading-relaxed">
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