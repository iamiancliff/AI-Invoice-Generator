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
  Cell,
  Legend,
  Label,
  LabelList,
} from "recharts"; 

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

  const statusArray = Object.entries(data.statusCounts)
    .map(([name, value]) => ({ 
      name, 
      value: Number(value),
      color: name === "Paid" ? "#60D394" : "#EE6055"
    }))
    .filter(item => item.value > 0);

  // Calculate max value for Y-axis scaling with padding
  // Handle edge cases: empty array or all zeros
  const maxStatusValue = statusArray.length > 0 
    ? Math.max(...statusArray.map(item => item.value)) 
    : 1;
  // Add 20% padding to the top, rounded up to next nice number
  const yAxisMax = Math.max(Math.ceil(maxStatusValue * 1.2), 5);
  // Round to nearest 5, 10, 20, 50, 100, etc. for cleaner ticks
  const getNiceMax = (num) => {
    if (num <= 5) return 5;
    if (num <= 10) return 10;
    if (num <= 20) return 20;
    if (num <= 50) return Math.ceil(num / 10) * 10;
    if (num <= 100) return Math.ceil(num / 20) * 20;
    if (num <= 200) return Math.ceil(num / 50) * 50;
    if (num <= 500) return Math.ceil(num / 100) * 100;
    return Math.ceil(num / 200) * 200;
  };
  const niceYAxisMax = getNiceMax(yAxisMax);

  const overdueTotal = Number(data?.agingSummary?.overdueTotal ?? 0);
  const unpaidTotal = Number(data?.agingSummary?.unpaidTotal ?? 0);
  const notDueAmount = Number(data?.agingBuckets?.["Not Due"] ?? 0);
  const overduePct = unpaidTotal > 0 ? Math.round((overdueTotal / unpaidTotal) * 100) : 0;

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

  const timeSeriesData = (data.timeSeries || []).map((entry) => {
    const dateObj = new Date(entry.date);
    const formattedDate = dateObj.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return {
      ...entry,
      formattedDate,
    };
  });


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
            <LineChart
              data={timeSeriesData}
              margin={{ left: 8, right: 16, top: 16, bottom: 8 }}
            >
              <CartesianGrid stroke="#ffffff1a" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fill: "#A0AEC0" }}
                interval="preserveStartEnd"
              >
                <Label
                  value="Invoice Date"
                  position="insideBottom"
                  offset={-6}
                  fill="#CBD5F5"
                  style={{ fontSize: 12 }}
                />
              </XAxis>
              <YAxis
                tick={{ fill: "#A0AEC0" }}
                tickFormatter={(value) => `$${value}`}
              >
                <Label
                  value="Amount (USD)"
                  angle={-90}
                  position="insideLeft"
                  offset={-4}
                  fill="#CBD5F5"
                  style={{ fontSize: 12 }}
                />
              </YAxis>
              <Tooltip
                contentStyle={{ background: "#101827", border: "1px solid #2D3748" }}
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.date
                    ? new Date(payload[0].payload.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""
                }
              />
              <Legend
                verticalAlign="top"
                align="left"
                wrapperStyle={{ color: "#E2E8F0", fontSize: "12px", paddingBottom: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="invoicesTotal"
                name="Issued Amount"
                stroke="#4FADC0"
                strokeWidth={2}
                dot={{ stroke: "#4FADC0", strokeWidth: 2, fill: "#101827" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="paidTotal"
                name="Paid Amount"
                stroke="#60D394"
                strokeWidth={2}
                dot={{ stroke: "#60D394", strokeWidth: 2, fill: "#101827" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {timeSeriesData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm text-[var(--text-secondary)]">
            <div className="card-clean bg-white/[0.03] border border-white/5 p-4">
              <p className="uppercase tracking-wide text-xs mb-1 text-white/60">Latest Issued</p>
              <p className="text-[var(--text-primary)] font-semibold">
                {formatCurrency(timeSeriesData[timeSeriesData.length - 1].invoicesTotal)}
              </p>
              <p>
                {new Date(timeSeriesData[timeSeriesData.length - 1].date).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </p>
            </div>
            <div className="card-clean bg-white/[0.03] border border-white/5 p-4">
              <p className="uppercase tracking-wide text-xs mb-1 text-white/60">Latest Paid</p>
              <p className="text-[var(--text-primary)] font-semibold">
                {formatCurrency(timeSeriesData[timeSeriesData.length - 1].paidTotal)}
              </p>
              <p>
                {new Date(timeSeriesData[timeSeriesData.length - 1].date).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-clean p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">Invoice Status</h4>
            <p className="text-sm text-[var(--text-secondary)]">Number of paid and unpaid invoices.</p>
          </div>
          {statusArray.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-sm text-[var(--text-secondary)] text-center">
              <div>
                <p className="text-lg mb-2">No invoices yet</p>
                <p>Create your first invoice to see status statistics here.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={statusArray}
                    margin={{ top: 30, right: 30, left: 50, bottom: 60 }}
                  >
                    <CartesianGrid stroke="#ffffff1a" strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: "#E2E8F0", fontSize: 14, fontWeight: 500 }}
                      axisLine={{ stroke: "#4A5568", strokeWidth: 1 }}
                    >
                      <Label
                        value="Invoice Status"
                        position="insideBottom"
                        offset={-10}
                        fill="#CBD5F5"
                        style={{ fontSize: 13, fontWeight: 500 }}
                      />
                    </XAxis>
                    <YAxis 
                      domain={[0, niceYAxisMax]}
                      tick={{ fill: "#E2E8F0", fontSize: 13 }}
                      axisLine={{ stroke: "#4A5568", strokeWidth: 1 }}
                      allowDecimals={false}
                      width={50}
                      tickFormatter={(value) => value.toString()}
                    >
                      <Label
                        value="Number of Invoices"
                        angle={-90}
                        position="insideLeft"
                        offset={15}
                        fill="#CBD5F5"
                        style={{ fontSize: 13, fontWeight: 500 }}
                      />
                    </YAxis>
                    <Tooltip 
                      contentStyle={{ 
                        background: "#1A202C", 
                        border: "1px solid #4A5568",
                        borderRadius: "6px",
                        color: "#E2E8F0",
                        fontSize: "14px"
                      }} 
                      cursor={{ fill: "rgba(79, 173, 192, 0.1)" }}
                      formatter={(value) => [`${value} invoices`, ""]}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={120}
                    >
                      {statusArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="top" 
                        fill="#E2E8F0"
                        style={{ fontSize: 14, fontWeight: 600 }}
                        formatter={(value) => value}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {statusArray.map((item) => {
                  const totalInvoices = statusArray.reduce((sum, i) => sum + i.value, 0);
                  const percentage = totalInvoices > 0 ? Math.round((item.value / totalInvoices) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-[var(--text-secondary)]">
                        {item.name}: <span className="font-semibold text-[var(--text-primary)]">{item.value}</span> ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="card-clean p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">Outstanding Amounts</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Summary of unpaid invoice amounts.
            </p>
          </div>

          {unpaidTotal === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-[var(--text-secondary)] text-center">
              <div>
                <p className="text-lg text-green-300 mb-2">✓ All Clear</p>
                <p>You have no outstanding balances.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-clean bg-white/[0.05] border border-white/10 p-6">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">Not Due Yet</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {formatCurrency(notDueAmount)}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">
                    Invoices not yet past due date
                  </p>
                </div>
                <div className="card-clean bg-white/[0.05] border border-white/10 p-6">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">Overdue</p>
                  <p className="text-2xl font-bold text-red-300">
                    {formatCurrency(overdueTotal)}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">
                    Invoices past due date
                  </p>
                </div>
              </div>
              
              <div className="card-clean bg-white/[0.05] border border-white/10 p-6">
                <p className="text-sm text-[var(--text-secondary)] mb-2">Total Unpaid</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {formatCurrency(unpaidTotal)}
                </p>
                {overdueTotal > 0 && (
                  <p className="text-xs text-red-300 mt-2">
                    {overduePct}% is overdue and needs attention
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;


