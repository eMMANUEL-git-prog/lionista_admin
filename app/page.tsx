"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/ui/stats-card";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api";
import {
  DollarSign,
  Users,
  Heart,
  TrendingUp,
  Calendar,
  Mail,
} from "lucide-react";

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  donation_type: string;
  created_at: string;
  status: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string;
  created_at: string;
  status: string;
}

interface DashboardStats {
  totalDonations: number;
  totalAmount: number;
  totalVolunteers: number;
  totalPrograms: number;
  recentDonations: Donation[];
  recentVolunteers: Volunteer[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboard();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const donationColumns = [
    { key: "donor_name", label: "Donor" },
    {
      key: "amount",
      label: "Amount",
      render: (d: Donation) => `$${d.amount.toLocaleString()}`,
    },
    { key: "donation_type", label: "Type" },
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

  const volunteerColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "skills", label: "Skills" },
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
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Donations"
            value={`$${(stats?.totalAmount || 0).toLocaleString()}`}
            change="+12% from last month"
            changeType="positive"
            icon={DollarSign}
          />
          <StatsCard
            title="Total Donors"
            value={stats?.totalDonations || 0}
            change="+8% from last month"
            changeType="positive"
            icon={Heart}
          />
          <StatsCard
            title="Active Volunteers"
            value={stats?.totalVolunteers || 0}
            change="+5% from last month"
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Programs Running"
            value={stats?.totalPrograms || 0}
            change="2 new this quarter"
            changeType="neutral"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Donations</h2>
              <a
                href="/donations"
                className="text-sm text-primary hover:underline"
              >
                View all
              </a>
            </div>
            <DataTable
              data={stats?.recentDonations || []}
              columns={donationColumns}
              pageSize={5}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Volunteers</h2>
              <a
                href="/volunteers"
                className="text-sm text-primary hover:underline"
              >
                View all
              </a>
            </div>
            <DataTable
              data={stats?.recentVolunteers || []}
              columns={volunteerColumns}
              pageSize={5}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">Community Outreach</p>
                <p className="text-xs text-muted-foreground">March 25, 2026</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">Annual Fundraiser Gala</p>
                <p className="text-xs text-muted-foreground">April 10, 2026</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">Youth Workshop</p>
                <p className="text-xs text-muted-foreground">April 15, 2026</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Recent Messages
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">Partnership Inquiry</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">Volunteer Question</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">Media Request</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/programs/new"
                className="block w-full p-3 text-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Add New Program
              </a>
              <a
                href="/blog/new"
                className="block w-full p-3 text-center bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                Create Blog Post
              </a>
              <a
                href="/donations"
                className="block w-full p-3 text-center bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                Export Donations
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
