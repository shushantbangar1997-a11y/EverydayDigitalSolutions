import { lazy, Suspense, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAdminSession,
  useAdminLogin,
  useAdminLogout,
  useListLeads,
  useUpdateLead,
  useListSubscribers,
  getGetAdminSessionQueryKey,
  getListLeadsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, LogOut, RefreshCw, Check } from "lucide-react";
import { SEO } from "@/components/SEO";

// Admin views are lazy-loaded so they don't bloat the public bundle.
const DashboardView = lazy(() =>
  import("@/components/admin/DashboardView").then((m) => ({ default: m.DashboardView })),
);
const LiveView = lazy(() =>
  import("@/components/admin/LiveView").then((m) => ({ default: m.LiveView })),
);
const SessionsView = lazy(() =>
  import("@/components/admin/SessionsView").then((m) => ({ default: m.SessionsView })),
);
const GeographyView = lazy(() =>
  import("@/components/admin/GeographyView").then((m) => ({ default: m.GeographyView })),
);
const DevicesView = lazy(() =>
  import("@/components/admin/DevicesView").then((m) => ({ default: m.DevicesView })),
);
const SourcesView = lazy(() =>
  import("@/components/admin/SourcesView").then((m) => ({ default: m.SourcesView })),
);
const ToolsView = lazy(() =>
  import("@/components/admin/ToolsView").then((m) => ({ default: m.ToolsView })),
);

function AdminTabFallback() {
  return <p className="text-sm text-muted-foreground">Loading…</p>;
}

const STATUSES = ["new", "contacted", "qualified", "closed_won", "closed_lost"] as const;

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mutation = useAdminLogin();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate(
      { data: { password } },
      {
        onSuccess: () => onSuccess(),
        onError: () => setError("Invalid password."),
      },
    );
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4 bg-background">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-primary" />
          <h1 className="font-serif text-2xl text-foreground">Admin</h1>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={mutation.isPending || password.length === 0}
          className="w-full rounded-full font-medium"
        >
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </main>
  );
}

function LeadRow({ lead }: { lead: import("@workspace/api-client-react").Lead }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const qc = useQueryClient();
  const mutation = useUpdateLead();
  const quickContacted = useUpdateLead();

  function save() {
    mutation.mutate(
      { id: lead.id, data: { status, notes } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListLeadsQueryKey() });
        },
      },
    );
  }

  function markContacted(e: React.MouseEvent) {
    e.stopPropagation();
    quickContacted.mutate(
      { id: lead.id, data: { status: "contacted", notes: lead.notes ?? "" } },
      {
        onSuccess: () => {
          setStatus("contacted");
          qc.invalidateQueries({ queryKey: getListLeadsQueryKey() });
        },
      },
    );
  }

  const statusColor: Record<string, string> = {
    new: "bg-primary/15 text-primary",
    contacted: "bg-blue-500/15 text-blue-600",
    qualified: "bg-amber-500/15 text-amber-600",
    closed_won: "bg-emerald-500/15 text-emerald-600",
    closed_lost: "bg-muted text-muted-foreground",
  };

  return (
    <div className="border border-border rounded-2xl bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-4 flex flex-wrap items-center gap-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-[200px]">
          <p className="font-medium text-foreground">
            {lead.name}
            {lead.businessName && <span className="text-muted-foreground font-normal"> · {lead.businessName}</span>}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lead.industry} · {lead.city} · {lead.budget} · {lead.timeline}
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[lead.status] ?? ""}`}>
          {lead.status}
        </span>
        {lead.status === "new" && (
          <span
            role="button"
            tabIndex={0}
            onClick={markContacted}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                markContacted(e as unknown as React.MouseEvent);
              }
            }}
            aria-label="Mark as contacted"
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors ${
              quickContacted.isPending ? "opacity-50" : ""
            }`}
          >
            <Check className="w-3 h-3" />
            {quickContacted.isPending ? "Saving…" : "Mark contacted"}
          </span>
        )}
        <span className="text-xs text-muted-foreground tabular-nums">
          {new Date(lead.createdAt).toLocaleString()}
        </span>
      </button>
      {open && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">WhatsApp</p>
              <a
                href={`https://wa.me/${lead.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {lead.whatsappNumber}
              </a>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p>{lead.email ?? "—"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Problem</p>
              <p className="whitespace-pre-wrap">{lead.problem}</p>
            </div>
            {lead.currentSolution && (
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Current solution</p>
                <p className="whitespace-pre-wrap">{lead.currentSolution}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Goal in 3 months</p>
              <p className="whitespace-pre-wrap">{lead.goalIn3Months}</p>
            </div>
            {lead.industryDetails && Object.keys(lead.industryDetails).length > 0 && (
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Industry details</p>
                <pre className="text-xs bg-muted/40 rounded-xl p-3 overflow-x-auto">
                  {JSON.stringify(lead.industryDetails, null, 2)}
                </pre>
              </div>
            )}
            <div className="md:col-span-2 text-xs text-muted-foreground">
              WhatsApp notification: {lead.whatsappNotificationSent ? "sent" : "not sent"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 pt-4 border-t border-border">
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full bg-[var(--glass-fill)] border border-[var(--glass-stroke)] rounded-xl px-3 py-2 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl min-h-[80px]"
                placeholder="Internal notes…"
              />
            </div>
          </div>
          <Button
            onClick={save}
            disabled={mutation.isPending}
            className="rounded-full"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const qc = useQueryClient();
  const leads = useListLeads();
  const subs = useListSubscribers();
  const logout = useAdminLogout();

  function refresh() {
    leads.refetch();
    subs.refetch();
  }

  function doLogout() {
    logout.mutate(undefined, {
      onSettled: () => {
        qc.invalidateQueries({ queryKey: getGetAdminSessionQueryKey() });
        onLogout();
      },
    });
  }

  return (
    <main className="min-h-[100dvh] bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="font-serif text-xl text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/admin/request-review">Request review</a>
            </Button>
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={doLogout}>
              <LogOut className="w-4 h-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="leads">Leads ({leads.data?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers ({subs.data?.length ?? 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><DashboardView /></Suspense>
          </TabsContent>
          <TabsContent value="live" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><LiveView /></Suspense>
          </TabsContent>
          <TabsContent value="sessions" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><SessionsView /></Suspense>
          </TabsContent>
          <TabsContent value="geography" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><GeographyView /></Suspense>
          </TabsContent>
          <TabsContent value="devices" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><DevicesView /></Suspense>
          </TabsContent>
          <TabsContent value="sources" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><SourcesView /></Suspense>
          </TabsContent>
          <TabsContent value="tools" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><ToolsView /></Suspense>
          </TabsContent>
          <TabsContent value="leads" className="mt-6 space-y-3">
            <div className="flex items-center justify-end">
              <a
                href={`${(import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "")}/api/admin/leads.csv`}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 underline"
                data-track="admin.exportLeadsCsv"
              >
                Export CSV
              </a>
            </div>
            {leads.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {leads.data?.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
            {leads.data?.map((l) => <LeadRow key={l.id} lead={l} />)}
          </TabsContent>
          <TabsContent value="subscribers" className="mt-6">
            {subs.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {subs.data?.length === 0 && <p className="text-sm text-muted-foreground">No subscribers yet.</p>}
            <div className="border border-border rounded-2xl bg-card overflow-hidden">
              {subs.data?.map((s) => (
                <div key={s.id} className="px-4 py-3 border-b last:border-0 border-border flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">{s.email}</span>
                  <span className="text-xs text-muted-foreground">{s.source}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(s.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default function Admin() {
  const qc = useQueryClient();
  const session = useGetAdminSession();

  function refreshSession() {
    qc.invalidateQueries({ queryKey: getGetAdminSessionQueryKey() });
  }

  return (
    <>
      <SEO title="Admin" description="Internal admin dashboard." canonical="/admin" noindex />
      {session.isLoading ? (
        <main className="min-h-[100dvh] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </main>
      ) : session.data?.authenticated ? (
        <Dashboard onLogout={refreshSession} />
      ) : (
        <LoginForm onSuccess={refreshSession} />
      )}
    </>
  );
}
