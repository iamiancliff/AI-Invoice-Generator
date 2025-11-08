import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4FADC0", "#60D394", "#EE6055", "#FFD97D"]; 

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.REPORTS.SUMMARY);
        setData(res.data);
      } catch (e) {
        console.error("Failed to load reports", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)]" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-[var(--text-secondary)]">No data available.</div>;
  }

  const agingArray = Object.entries(data.agingBuckets).map(([bucket, amount]) => ({ bucket, amount }));
  const statusArray = Object.entries(data.statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg md:text-xl font-whyte font-medium text-[var(--text-primary)] mb-2">Reports</h3>
        <p className="text-lg text-[var(--text-secondary)]">Real-time analytics from your invoices.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-clean p-6">
          <p className="text-sm text-[var(--text-secondary)]">Total Invoices</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{data.kpis.totalInvoices}</p>
        </div>
        <div className="card-clean p-6">
          <p className="text-sm text-[var(--text-secondary)]">Total Paid</p>
          <p className="text-3xl font-bold text-green-300">${data.kpis.totalPaid.toFixed(2)}</p>
        </div>
        <div className="card-clean p-6">
          <p className="text-sm text-[var(--text-secondary)]">Total Unpaid</p>
          <p className="text-3xl font-bold text-red-300">${data.kpis.totalUnpaid.toFixed(2)}</p>
        </div>
      </div>

      {/* Time Series */}
      <div className="card-clean p-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">Cash In Trend (last 90 days)</h4>
          <p className="text-sm text-[var(--text-secondary)]">Invoices issued vs. paid totals per day.</p>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.timeSeries} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#ffffff1a" />
              <XAxis dataKey="date" tick={{ fill: "#A0AEC0" }} />
              <YAxis tick={{ fill: "#A0AEC0" }} />
              <Tooltip contentStyle={{ background: "#101827", border: "1px solid #2D3748" }} />
              <Line type="monotone" dataKey="invoicesTotal" name="Issued" stroke="#4FADC0" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="paidTotal" name="Paid" stroke="#60D394" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-clean p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">Invoice Status</h4>
            <p className="text-sm text-[var(--text-secondary)]">Distribution of current invoice statuses.</p>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusArray}>
                <CartesianGrid stroke="#ffffff1a" />
                <XAxis dataKey="name" tick={{ fill: "#A0AEC0" }} />
                <YAxis tick={{ fill: "#A0AEC0" }} />
                <Tooltip contentStyle={{ background: "#101827", border: "1px solid #2D3748" }} />
                <Bar dataKey="value" radius={[6,6,0,0]} fill="#4FADC0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-clean p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">A/R Aging</h4>
            <p className="text-sm text-[var(--text-secondary)]">Unpaid amounts by aging bucket.</p>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={agingArray} dataKey="amount" nameKey="bucket" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {agingArray.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#101827", border: "1px solid #2D3748" }} formatter={(v) => `$${Number(v).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;


