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

    // Aging buckets for unpaid invoices based on dueDate
    // Keep it realistic but simple and self-explanatory
    const aging = {
      "Not Due": 0,
      "1-30": 0,
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
          const daysPastDue = Math.floor(
            (now - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24)
          );
          const amount = inv.total || 0;
          if (daysPastDue <= 0) {
            aging["Not Due"] += amount;
          } else if (daysPastDue <= 30) {
            aging["1-30"] += amount;
          } else if (daysPastDue <= 60) {
            aging["31-60"] += amount;
          } else if (daysPastDue <= 90) {
            aging["61-90"] += amount;
          } else {
            aging["90+"] += amount;
          }
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

    const overdueTotal =
      aging["1-30"] + aging["31-60"] + aging["61-90"] + aging["90+"];

    res.json({
      kpis: {
        totalInvoices,
        totalPaid,
        totalUnpaid,
      },
      statusCounts,
      agingBuckets: aging,
      agingSummary: {
        overdueTotal,
        unpaidTotal: totalUnpaid,
      },
      timeSeries,
    });
  } catch (err) {
    console.error("Reports summary error", err);
    res.status(500).json({ message: "Failed to compute reports" });
  }
};


