const Invoice = require("../models/Invoice");

// GET /api/reports/summary
// Private - requires auth
// Returns analytics computed from real invoices for the logged-in user
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all invoices for this user (keep it simple first; can optimize later)
    const invoices = await Invoice.find({ user: userId }).lean();

    const now = new Date();

    // KPIs
    let totalInvoices = invoices.length;
    let totalPaid = 0;
    let totalUnpaid = 0;

    const statusCounts = { Paid: 0, Unpaid: 0 };

    // Aging buckets for Unpaid invoices based on dueDate
    const aging = {
      "0-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    };

    invoices.forEach((inv) => {
      if (inv.status === "Paid") {
        statusCounts.Paid += 1;
        totalPaid += inv.total || 0;
      } else {
        statusCounts.Unpaid += 1;
        totalUnpaid += inv.total || 0;

        if (inv.dueDate) {
          const days = Math.floor((now - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));
          if (days <= 30) aging["0-30"] += inv.total || 0;
          else if (days <= 60) aging["31-60"] += inv.total || 0;
          else if (days <= 90) aging["61-90"] += inv.total || 0;
          else aging["90+"] += inv.total || 0;
        }
      }
    });

    // Time series (last 90 days): invoice totals per day and paid totals per day
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const seriesMap = new Map();

    for (const inv of invoices) {
      const d = new Date(inv.invoiceDate || inv.createdAt);
      if (d < ninetyDaysAgo) continue;
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!seriesMap.has(key)) {
        seriesMap.set(key, { date: key, invoicesTotal: 0, paidTotal: 0, count: 0 });
      }
      const entry = seriesMap.get(key);
      entry.invoicesTotal += inv.total || 0;
      entry.count += 1;
      if (inv.status === "Paid") entry.paidTotal += inv.total || 0;
    }

    const timeSeries = Array.from(seriesMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      kpis: {
        totalInvoices,
        totalPaid,
        totalUnpaid,
      },
      statusCounts,
      agingBuckets: aging,
      timeSeries,
    });
  } catch (err) {
    console.error("Reports summary error", err);
    res.status(500).json({ message: "Failed to compute reports" });
  }
};


