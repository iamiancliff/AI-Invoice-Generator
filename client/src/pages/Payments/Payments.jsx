import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Clock, Users } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        setInvoices(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const analytics = useMemo(() => {
    const now = moment();
    const startOfMonth = now.clone().startOf('month');
    const startOfLastMonth = now.clone().subtract(1, 'month').startOf('month');
    const endOfLastMonth = now.clone().subtract(1, 'month').endOf('month');
    const startOfYear = now.clone().startOf('year');

    const paidInvoices = invoices.filter((i) => i.status === "Paid");
    const unpaidInvoices = invoices.filter((i) => i.status !== "Paid");
    const overdueInvoices = unpaidInvoices.filter((i) => moment(i.dueDate).isBefore(now, 'day'));

    // Revenue calculations
    const thisMonthRevenue = paidInvoices
      .filter((i) => moment(i.invoiceDate).isAfter(startOfMonth))
      .reduce((acc, i) => acc + (i.total || 0), 0);

    const lastMonthRevenue = paidInvoices
      .filter((i) => moment(i.invoiceDate).isBetween(startOfLastMonth, endOfLastMonth, null, '[]'))
      .reduce((acc, i) => acc + (i.total || 0), 0);

    const yearToDateRevenue = paidInvoices
      .filter((i) => moment(i.invoiceDate).isAfter(startOfYear))
      .reduce((acc, i) => acc + (i.total || 0), 0);

    const outstandingAmount = unpaidInvoices.reduce((acc, i) => acc + (i.total || 0), 0);
    const overdueAmount = overdueInvoices.reduce((acc, i) => acc + (i.total || 0), 0);

    // Payment trends by month (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = now.clone().subtract(i, 'month').startOf('month');
      const monthEnd = now.clone().subtract(i, 'month').endOf('month');
      const monthRevenueAmount = paidInvoices
        .filter((i) => moment(i.invoiceDate).isBetween(monthStart, monthEnd, null, '[]'))
        .reduce((acc, i) => acc + (i.total || 0), 0);
      monthlyRevenue.push({
        month: monthStart.format('MMM YYYY'),
        revenue: monthRevenueAmount,
      });
    }

    // Top clients by revenue
    const clientRevenue = {};
    paidInvoices.forEach((invoice) => {
      const clientName = invoice.billTo?.clientName || 'Unknown';
      clientRevenue[clientName] = (clientRevenue[clientName] || 0) + (invoice.total || 0);
    });
    const topClients = Object.entries(clientRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Collection rate
    const collectionRate = invoices.length > 0
      ? (paidInvoices.length / invoices.length) * 100
      : 0;

    return {
      thisMonthRevenue,
      lastMonthRevenue,
      yearToDateRevenue,
      outstandingAmount,
      overdueAmount,
      overdueInvoices,
      monthlyRevenue,
      topClients,
      collectionRate,
      revenueChange: lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0,
    };
  }, [invoices]);

  // Recent payments (last 10 paid invoices)
  const recentPayments = useMemo(() => {
    return invoices
      .filter((i) => i.status === "Paid")
      .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
      .slice(0, 10);
  }, [invoices]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg md:text-xl font-whyte font-medium text-[var(--text-primary)] mb-2">Payments & Revenue</h3>
        <p className="text-lg text-[var(--text-secondary)]">Track your revenue, payment trends, and financial performance.</p>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-clean p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--text-secondary)]">This Month</p>
            <Calendar className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            ${analytics.thisMonthRevenue.toFixed(2)}
          </p>
          {analytics.revenueChange !== 0 && (
            <div className={`flex items-center gap-1 text-xs ${analytics.revenueChange > 0 ? 'text-green-300' : 'text-red-300'}`}>
              {analytics.revenueChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(analytics.revenueChange).toFixed(1)}% vs last month</span>
            </div>
          )}
        </div>

        <div className="card-clean p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--text-secondary)]">Year to Date</p>
            <TrendingUp className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            ${analytics.yearToDateRevenue.toFixed(2)}
          </p>
        </div>

        <div className="card-clean p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--text-secondary)]">Outstanding</p>
            <DollarSign className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-bold text-red-300">
            ${analytics.outstandingAmount.toFixed(2)}
          </p>
        </div>

        <div className="card-clean p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--text-secondary)]">Collection Rate</p>
            <Clock className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {analytics.collectionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Overdue Invoices Alert */}
      {analytics.overdueInvoices.length > 0 && (
        <div className="card-clean p-6 bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-300 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-300 mb-2">
                {analytics.overdueInvoices.length} Overdue Invoice{analytics.overdueInvoices.length > 1 ? 's' : ''}
              </h4>
              <p className="text-[var(--text-secondary)] mb-4">
                You have <span className="font-semibold text-red-300">${analytics.overdueAmount.toFixed(2)}</span> in overdue payments that require immediate attention.
              </p>
              <button
                onClick={() => navigate('/invoices')}
                className="text-sm font-medium text-red-300 hover:text-red-200 underline"
              >
                View Overdue Invoices →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Trends */}
        <div className="card-clean p-6">
          <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Revenue Trends (Last 6 Months)</h4>
          <div className="space-y-4">
            {analytics.monthlyRevenue.map((month, index) => {
              const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue), 1);
              const percentage = (month.revenue / maxRevenue) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[var(--text-secondary)]">{month.month}</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">${month.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Clients */}
        <div className="card-clean p-6">
          <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Top Paying Clients</h4>
          {analytics.topClients.length > 0 ? (
            <div className="space-y-4">
              {analytics.topClients.map((client, index) => {
                const maxRevenue = Math.max(...analytics.topClients.map(c => c.revenue), 1);
                const percentage = (client.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent-color)]/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--accent-color)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{client.name}</p>
                      <div className="w-full h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[var(--accent-color)] rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-sm font-bold text-[var(--text-primary)]">
                      ${client.revenue.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] text-center py-8">No payment data available yet</p>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card-clean overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">Recent Payments</h4>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Latest payments received from clients</p>
        </div>
        {recentPayments.length > 0 ? (
          <div className="w-[90vw] md:w-auto overflow-x-auto">
            <table className="w-full min-w-[600px] divide-y divide-white/10">
              <thead className="bg-[var(--surface-2)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Invoice Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--surface-1)] divide-y divide-white/10">
                {recentPayments.map((invoice) => (
                  <tr 
                    key={invoice._id} 
                    className="hover:bg-white/5 cursor-pointer"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                      {invoice.billTo?.clientName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-300">
                      ${invoice.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                      {moment(invoice.invoiceDate).format("MMM D, YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="w-12 h-12 text-[var(--text-muted)] mb-4" />
            <p className="text-sm text-[var(--text-secondary)]">No payments received yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;


