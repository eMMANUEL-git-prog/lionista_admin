"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api";
import { Download, Filter, Search } from "lucide-react";

interface Donation {
  id: number;
  donor_name: string;
  donor_email: string;
  amount: number;
  donation_type: string;
  is_recurring: boolean;
  created_at: string;
  status: string;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await api.getDonations();
        setDonations(data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donor_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.donor_email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "donor_name", label: "Donor Name" },
    { key: "donor_email", label: "Email" },
    {
      key: "amount",
      label: "Amount",
      render: (d: Donation) => (
        <span className="font-semibold">${d.amount.toLocaleString()}</span>
      ),
    },
    { key: "donation_type", label: "Type" },
    {
      key: "is_recurring",
      label: "Recurring",
      render: (d: Donation) => (d.is_recurring ? "Yes" : "No"),
    },
    {
      key: "created_at",
      label: "Date",
      render: (d: Donation) => new Date(d.created_at).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (d: Donation) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            d.status === "completed"
              ? "bg-green-100 text-green-700"
              : d.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {d.status}
        </span>
      ),
    },
  ];

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Donations</h1>
            <p className="text-muted-foreground">
              Manage and track all donations
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Donations</p>
              <p className="text-2xl font-bold">{filteredDonations.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Donation</p>
              <p className="text-2xl font-bold">
                $
                {filteredDonations.length
                  ? Math.round(
                      totalAmount / filteredDonations.length,
                    ).toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable data={filteredDonations} columns={columns} pageSize={10} />
        )}
      </div>
    </DashboardLayout>
  );
}
