"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Ticket, Comment } from "@/lib/types";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, RotateCcw, UserPlus } from "lucide-react";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch<Ticket>(`/bff/tickets/${id}`),
      apiFetch<Comment[]>(`/bff/tickets/${id}/comments`).catch(() => []),
    ])
      .then(([t, c]) => {
        setTicket(t);
        setComments(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      const comment = await apiFetch<Comment>(`/bff/tickets/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: commentBody, internal: isInternal }),
      });
      setComments((prev) => [...prev, comment]);
      setCommentBody("");
      setIsInternal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(action: "assign" | "resolve" | "reopen") {
    try {
      const updated = await apiFetch<Ticket>(`/bff/tickets/${id}/${action}`, {
        method: "POST",
      });
      setTicket(updated);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return <p className="text-muted-foreground">Ticket not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/tickets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => handleAction("assign")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Assign
        </Button>
        {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
          <Button variant="outline" onClick={() => handleAction("resolve")}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Resolve
          </Button>
        )}
        {(ticket.status === "RESOLVED" || ticket.status === "CLOSED") && (
          <Button variant="outline" onClick={() => handleAction("reopen")}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reopen
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <Badge variant={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
              <dd className="mt-1">
                <Badge variant="outline">{ticket.priority}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Customer</dt>
              <dd className="mt-1 text-sm">{ticket.customer_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Due At</dt>
              <dd className="mt-1 text-sm">{formatDate(ticket.due_at)}</dd>
            </div>
            {ticket.resolved_at && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Resolved At</dt>
                <dd className="mt-1 text-sm">{formatDate(ticket.resolved_at)}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Description</dt>
              <dd className="mt-1 text-sm whitespace-pre-wrap">
                {ticket.description || "-"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {comment.author_id}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
                {comment.internal && (
                  <Badge variant="secondary" className="text-xs">
                    Internal
                  </Badge>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
              <Separator />
            </div>
          ))}

          <form onSubmit={handleAddComment} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Add Comment</Label>
              <Textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="internal"
                checked={isInternal}
                onCheckedChange={(checked) =>
                  setIsInternal(checked === true)
                }
              />
              <Label htmlFor="internal" className="text-sm font-normal">
                Internal note (not visible to customer)
              </Label>
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
