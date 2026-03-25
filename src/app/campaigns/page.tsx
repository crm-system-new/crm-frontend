"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Campaign, ListResponse } from "@/lib/types";
import { getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Play, Pause } from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const res = await apiFetch<ListResponse<Campaign>>("/bff/campaigns");
      setCampaigns(res.items || []);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: "launch" | "pause") {
    try {
      await apiFetch(`/bff/campaigns/${id}/${action}`, { method: "POST" });
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Campaigns</h1>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Sent Count</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.channel}</TableCell>
                    <TableCell>{campaign.sent_count}</TableCell>
                    <TableCell>
                      {campaign.open_rate ? `${(campaign.open_rate * 100).toFixed(1)}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {campaign.click_rate ? `${(campaign.click_rate * 100).toFixed(1)}%` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {campaign.status !== "ACTIVE" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(campaign.id, "launch")}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        {campaign.status === "ACTIVE" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(campaign.id, "pause")}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {campaigns.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No campaigns found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
