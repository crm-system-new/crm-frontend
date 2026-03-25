"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { getStageColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, UserCheck } from "lucide-react";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [qualifyOpen, setQualifyOpen] = useState(false);
  const [score, setScore] = useState("");
  const [qualifying, setQualifying] = useState(false);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    apiFetch<Lead>(`/bff/leads/${id}`)
      .then(setLead)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleQualify(e: React.FormEvent) {
    e.preventDefault();
    setQualifying(true);
    try {
      const updated = await apiFetch<Lead>(`/bff/leads/${id}/qualify`, {
        method: "POST",
        body: JSON.stringify({ score: Number(score) }),
      });
      setLead(updated);
      setQualifyOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setQualifying(false);
    }
  }

  async function handleConvert() {
    setConverting(true);
    try {
      await apiFetch(`/bff/leads/${id}/convert`, { method: "POST" });
      router.push("/customers");
    } catch (err) {
      console.error(err);
    } finally {
      setConverting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!lead) {
    return <p className="text-muted-foreground">Lead not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/leads")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {lead.first_name} {lead.last_name}
        </h1>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStageColor(
            lead.stage
          )}`}
        >
          {lead.stage}
        </span>
      </div>

      <div className="flex gap-3">
        <Dialog open={qualifyOpen} onOpenChange={setQualifyOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Qualify
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Qualify Lead</DialogTitle>
              <DialogDescription>Set a score to qualify this lead.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleQualify} className="space-y-4">
              <div className="space-y-2">
                <Label>Score (0-100)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={qualifying}>
                  {qualifying ? "Qualifying..." : "Qualify"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button onClick={handleConvert} disabled={converting}>
          <UserCheck className="mr-2 h-4 w-4" />
          {converting ? "Converting..." : "Convert to Customer"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
              <dd className="mt-1 text-sm">{lead.phone || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Company</dt>
              <dd className="mt-1 text-sm">{lead.company || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Source</dt>
              <dd className="mt-1 text-sm">{lead.source || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Score</dt>
              <dd className="mt-1 text-sm">{lead.score}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Stage</dt>
              <dd className="mt-1 text-sm">
                <Badge variant="outline">{lead.stage}</Badge>
              </dd>
            </div>
            {lead.notes && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                <dd className="mt-1 text-sm whitespace-pre-wrap">{lead.notes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
