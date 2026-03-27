"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api";
import { Check, X, Search, Filter } from "lucide-react";

interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  created_at: string;
  status: string;
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const data = await api.getVolunteers();
        setVolunteers(data);
      } catch (error) {
        console.error("Failed to fetch volunteers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  const handleUpdateStatus = async (
    id: number,
    status: "approved" | "rejected",
  ) => {
    try {
      await api.updateVolunteerStatus(id, status);
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status } : v)),
      );
    } catch (error) {
      console.error("Failed to update volunteer status:", error);
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "skills", label: "Skills" },
    { key: "availability", label: "Availability" },
    {
      key: "created_at",
      label: "Applied",
      render: (v: Volunteer) => new Date(v.created_at).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (v: Volunteer) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            v.status === "approved"
              ? "bg-green-100 text-green-700"
              : v.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {v.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (v: Volunteer) =>
        v.status === "pending" && (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(v.id, "approved");
              }}
              className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              title="Approve"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(v.id, "rejected");
              }}
              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              title="Reject"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ),
    },
  ];

  const stats = {
    total: volunteers.length,
    approved: volunteers.filter((v) => v.status === "approved").length,
    pending: volunteers.filter((v) => v.status === "pending").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Volunteers</h1>
          <p className="text-muted-foreground">
            Manage volunteer applications and assignments
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Volunteers</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable
            data={filteredVolunteers}
            columns={columns}
            pageSize={10}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
