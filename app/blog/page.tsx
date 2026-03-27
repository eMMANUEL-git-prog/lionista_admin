"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { api } from "@/lib/api";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  author: string;
  featured_image: string;
  is_published: boolean;
  created_at: string;
}
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      await api.updateBlogPost(id, { is_published: !currentStatus });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_published: !currentStatus } : p,
        ),
      );
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage news, stories, and updates
            </p>
          </div>
          <Link
            href="/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                    Title
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                    Category
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                    Author
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                    Date
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt=""
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{post.category}</td>
                    <td className="px-6 py-4 text-sm">{post.author}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${post.id}/edit`}
                          className="p-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleTogglePublish(post.id, post.is_published)
                          }
                          className="p-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                        >
                          {post.is_published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No blog posts yet. Create your first post!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
