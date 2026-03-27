"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { api } from "@/lib/api";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Program {
  id: number;
  title: string;
  description: string;
  image_url: string;
  status: string;
}
import Link from "next/link";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await api.getPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await api.deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete program:", error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await api.updateProgram(id, { status: newStatus });
      setPrograms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
      );
    } catch (error) {
      console.error("Failed to update program status:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Programs</h1>
            <p className="text-muted-foreground">
              Manage foundation programs and initiatives
            </p>
          </div>
          <Link
            href="/programs/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Program
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="aspect-video bg-muted relative">
                  {program.image_url ? (
                    <img
                      src={program.image_url}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      program.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {program.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{program.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {program.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/programs/${program.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        handleToggleStatus(program.id, program.status)
                      }
                      className="p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                      title={
                        program.status === "active" ? "Deactivate" : "Activate"
                      }
                    >
                      {program.status === "active" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {programs.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No programs found. Create your first program!
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
