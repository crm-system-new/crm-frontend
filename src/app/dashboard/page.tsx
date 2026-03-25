"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { DashboardData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getStageColor, getStatusColor } from "@/lib/utils";
import { UserPlus, Users, Ticket, Megaphone } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<DashboardData>("/bff/dashboard")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground">Failed to load dashboard data.</p>;
  }

  const kpis = [
    {
      title: "Total Leads",
      value: data.total_leads,
      icon: UserPlus,
    },
    {
      title: "Total Customers",
      value: data.total_customers,
      icon: Users,
    },
    {
      title: "Open Tickets",
      value: data.open_tickets,
      icon: Ticket,
    },
    {
      title: "Active Campaigns",
      value: data.active_campaigns,
      icon: Megaphone,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recent_leads?.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.first_name} {lead.last_name}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStageColor(
                        lead.stage
                      )}`}
                    >
                      {lead.stage}
                    </span>
                  </TableCell>
                  <TableCell>{lead.score}</TableCell>
                </TableRow>
              ))}
              {(!data.recent_leads || data.recent_leads.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No recent leads
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recent_tickets?.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.priority}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {(!data.recent_tickets || data.recent_tickets.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No recent tickets
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
