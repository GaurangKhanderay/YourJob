"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Application } from "@/lib/types";

interface ApplicationChartProps {
  applications: Application[];
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

export function ApplicationChart({ applications }: ApplicationChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()),
      count,
    }));
  }, [applications]);

  const pieData = useMemo(() => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: COLORS[index % COLORS.length],
    }));
  }, [applications]);

  const monthlyData = useMemo(() => {
    const monthlyCounts = applications.reduce((acc, app) => {
      const date = new Date(app.appliedAt);
      const month = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyCounts)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, count]) => ({
        month,
        applications: count,
      }));
  }, [applications]);

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No application data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Application Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">
            {applications.length}
          </div>
          <div className="text-sm text-blue-700">Total Applications</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">
            {applications.filter(app => app.status === "interviewed" || app.status === "offer").length}
          </div>
          <div className="text-sm text-green-700">Interviews & Offers</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">
            {applications.length > 0 ? Math.round((applications.filter(app => app.status === "offer").length / applications.length) * 100) : 0}%
          </div>
          <div className="text-sm text-purple-700">Success Rate</div>
        </div>
      </div>
    </div>
  );
}
