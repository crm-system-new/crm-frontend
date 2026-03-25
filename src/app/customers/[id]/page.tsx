"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Customer360 } from "@/lib/types";
import { formatDate, formatMoney, getStageColor, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Customer360 | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Customer360>(`/bff/customers/${id}/360`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground">Customer not found.</p>;
  }

  const { customer, opportunities, tickets } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/customers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        <Badge variant={getStatusColor(customer.status)}>
          {customer.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
              <dd className="mt-1 text-sm">{customer.phone || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Company</dt>
              <dd className="mt-1 text-sm">{customer.company || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="mt-1 text-sm">
                <Badge variant={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
              </dd>
            </div>
            {customer.contact && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd className="mt-1 text-sm">
                  {[
                    customer.contact.address_line1,
                    customer.contact.address_line2,
                    customer.contact.city,
                    customer.contact.state,
                    customer.contact.zip,
                    customer.contact.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Tabs defaultValue="opportunities">
        <TabsList>
          <TabsTrigger value="opportunities">
            Opportunities ({opportunities?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="tickets">
            Tickets ({tickets?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Close Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities?.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell className="font-medium">{opp.title}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStageColor(
                            opp.stage
                          )}`}
                        >
                          {opp.stage}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatMoney(opp.amount, opp.currency)}
                      </TableCell>
                      <TableCell>{opp.probability}%</TableCell>
                      <TableCell>{formatDate(opp.close_date)}</TableCell>
                    </TableRow>
                  ))}
                  {(!opportunities || opportunities.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No opportunities
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets?.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                    >
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
                  {(!tickets || tickets.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No tickets
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
