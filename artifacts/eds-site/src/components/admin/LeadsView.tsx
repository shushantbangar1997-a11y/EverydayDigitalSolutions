import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUpdateLead, type LeadStatus } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronLeft, ChevronRight, Search, Trash2, X } from "lucide-react";
import {
  adminFetch,
  adminMutate,
  buildLeadsQueryString,
  type AdminLead,
  type LeadActivityResponse,
  type LeadListResponse,
  type LeadsQueryParams,
} from "@/lib/admin-fetch";

const STATUSES = ["new", "contacted", "qualified", "closed_won", "closed_lost"] as const;
const INDUSTRIES = [
  "salon_spa",
  "real_estate",
  "clinic_healthcare",
  "restaurant_cafe",
  "other_service",
  "other",
] as const;
const BUDGETS = ["under_1l", "1l_to_3l", "3l_to_8l", "8l_to_20l", "20l_plus", "not_sure"] as const;
const TIMELINES = ["asap", "within_1_month", "1_to_3_months", "3_to_6_months", "exploring"] as const;
const PAGE_SIZES = [10, 25, 50, 100] as const;

const API_BASE: string = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

const adminLeadsQueryKey = (p: LeadsQueryParams) =>
  [
    "admin",
    "leads",
    p.q ?? "",
    p.status ?? "all",
    p.industry ?? "",
    p.city ?? "",
    p.budget ?? "",
    p.timeline ?? "",
    p.from ?? "",
    p.to ?? "",
    p.page ?? 1,
    p.pageSize ?? 25,
    p.sort ?? "createdAt:desc",
  ] as const;

export const adminLeadsKeyPrefix = ["admin", "leads"] as const;

function readParamsFromUrl(): LeadsQueryParams {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const p: LeadsQueryParams = {};
  const q = sp.get("q");
  if (q) p.q = q;
  const status = sp.get("status");
  if (status) p.status = status;
  const industry = sp.get("industry");
  if (industry) p.industry = industry;
  const city = sp.get("city");
  if (city) p.city = city;
  const budget = sp.get("budget");
  if (budget) p.budget = budget;
  const timeline = sp.get("timeline");
  if (timeline) p.timeline = timeline;
  const from = sp.get("from");
  if (from) p.from = from;
  const to = sp.get("to");
  if (to) p.to = to;
  const page = sp.get("page");
  if (page) p.page = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = sp.get("pageSize");
  if (pageSize) p.pageSize = parseInt(pageSize, 10) || 25;
  const sort = sp.get("sort");
  if (sort === "createdAt:asc" || sort === "createdAt:desc") p.sort = sort;
  return p;
}

function writeParamsToUrl(p: LeadsQueryParams) {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.status && p.status !== "all") sp.set("status", p.status);
  if (p.industry) sp.set("industry", p.industry);
  if (p.city) sp.set("city", p.city);
  if (p.budget) sp.set("budget", p.budget);
  if (p.timeline) sp.set("timeline", p.timeline);
  if (p.from) sp.set("from", p.from);
  if (p.to) sp.set("to", p.to);
  if (p.page && p.page !== 1) sp.set("page", String(p.page));
  if (p.pageSize && p.pageSize !== 25) sp.set("pageSize", String(p.pageSize));
  if (p.sort && p.sort !== "createdAt:desc") sp.set("sort", p.sort);
  const qs = sp.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", next);
}

function useDebounced<T>(value: T, ms = 250): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

const selectClass =
  "bg-[var(--glass-fill)] border border-[var(--glass-stroke)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

export function LeadsView() {
  const initial = useMemo(readParamsFromUrl, []);
  const [search, setSearch] = useState(initial.q ?? "");
  const [status, setStatus] = useState(initial.status ?? "all");
  const [industry, setIndustry] = useState(initial.industry ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [budget, setBudget] = useState(initial.budget ?? "");
  const [timeline, setTimeline] = useState(initial.timeline ?? "");
  const [from, setFrom] = useState(initial.from ?? "");
  const [to, setTo] = useState(initial.to ?? "");
  const [page, setPage] = useState(initial.page ?? 1);
  const [pageSize, setPageSize] = useState(initial.pageSize ?? 25);
  const [sort, setSort] = useState<"createdAt:desc" | "createdAt:asc">(initial.sort ?? "createdAt:desc");

  const debouncedSearch = useDebounced(search, 250);

  // Reset to page 1 whenever a filter changes (but not when page itself changes).
  const lastFilterSig = useRef("");
  useEffect(() => {
    const sig = [debouncedSearch, status, industry, city, budget, timeline, from, to, sort].join("|");
    if (lastFilterSig.current && lastFilterSig.current !== sig) setPage(1);
    lastFilterSig.current = sig;
  }, [debouncedSearch, status, industry, city, budget, timeline, from, to, sort]);

  const params: LeadsQueryParams = {
    q: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    industry: industry || undefined,
    city: city || undefined,
    budget: budget || undefined,
    timeline: timeline || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    pageSize,
    sort,
  };

  useEffect(() => {
    writeParamsToUrl(params);
  });

  const queryString = buildLeadsQueryString(params);
  const queryKey = adminLeadsQueryKey(params);

  const q = useQuery({
    queryKey,
    queryFn: () => adminFetch<LeadListResponse>(`/api/admin/leads${queryString}`),
    placeholderData: (prev) => prev,
  });

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setIndustry("");
    setCity("");
    setBudget("");
    setTimeline("");
    setFrom("");
    setTo("");
    setSort("createdAt:desc");
    setPage(1);
  }

  const hasFilters =
    debouncedSearch ||
    status !== "all" ||
    industry ||
    city ||
    budget ||
    timeline ||
    from ||
    to ||
    sort !== "createdAt:desc";

  const total = q.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  const csvHref = `${API_BASE}/api/admin/leads.csv${queryString}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, business, email, phone, city…"
            className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl pl-9"
            aria-label="Search leads"
          />
        </div>
        <a
          href={csvHref}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 underline whitespace-nowrap"
          data-track="admin.exportLeadsCsv"
        >
          Export CSV
        </a>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Status</Label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="all">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Industry</Label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
            <option value="">Any</option>
            {INDUSTRIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Budget</Label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
            <option value="">Any</option>
            {BUDGETS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Timeline</Label>
          <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className={selectClass}>
            <option value="">Any</option>
            {TIMELINES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">City</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Any"
            className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl w-[160px]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">From</Label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">To</Label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sort</Label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className={selectClass}
          >
            <option value="createdAt:desc">Newest first</option>
            <option value="createdAt:asc">Oldest first</option>
          </select>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-full">
            <X className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {q.isLoading
            ? "Loading…"
            : total === 0
              ? "No leads match."
              : `Showing ${showingFrom}–${showingTo} of ${total}`}
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            Page size
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className={selectClass}
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {q.isError && (
        <p className="text-sm text-destructive">Could not load leads.</p>
      )}

      <div className="space-y-3">
        {q.data?.items.map((l) => (
          <LeadRow key={l.id} lead={l} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || q.isFetching}
          className="rounded-full"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page >= pageCount || q.isFetching}
          className="rounded-full"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function LeadRow({ lead }: { lead: AdminLead }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(lead.status as LeadStatus);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();
  const updateMutation = useUpdateLead();
  const quickContactedMutation = useUpdateLead();
  const undoMutation = useUpdateLead();
  const deleteMutation = useMutation({
    mutationFn: () => adminMutate(`/api/admin/leads/${lead.id}`, "DELETE"),
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["admin", "leads"] });
  }

  function save() {
    updateMutation.mutate(
      { id: lead.id, data: { status, notes } },
      { onSuccess: invalidate },
    );
  }

  function undoContacted() {
    undoMutation.mutate(
      { id: lead.id, data: { status: lead.status as LeadStatus, notes: lead.notes ?? "" } },
      {
        onSuccess: () => {
          setStatus(lead.status as LeadStatus);
          invalidate();
        },
      },
    );
  }

  function markContacted(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    const previousStatus = lead.status as LeadStatus;
    quickContactedMutation.mutate(
      { id: lead.id, data: { status: "contacted", notes: lead.notes ?? "" } },
      {
        onSuccess: () => {
          setStatus("contacted");
          invalidate();
          toast({
            title: "Marked as contacted",
            description: `${lead.name} — status changed from "${previousStatus}".`,
            action: (
              <ToastAction altText="Undo" onClick={undoContacted}>
                Undo
              </ToastAction>
            ),
          });
        },
        onError: () => {
          toast({
            title: "Could not update lead",
            description: "Try again in a moment.",
            variant: "destructive",
          });
        },
      },
    );
  }

  function confirmDelete() {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        invalidate();
        setConfirmDeleteOpen(false);
        toast({ title: "Lead deleted", description: `${lead.name} was removed.` });
      },
      onError: () => {
        toast({
          title: "Could not delete lead",
          description: "Try again in a moment.",
          variant: "destructive",
        });
      },
    });
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
            {lead.businessName && (
              <span className="text-muted-foreground font-normal"> · {lead.businessName}</span>
            )}
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
                markContacted(e);
              }
            }}
            aria-label="Mark as contacted"
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors ${
              quickContactedMutation.isPending ? "opacity-50" : ""
            }`}
          >
            <Check className="w-3 h-3" />
            {quickContactedMutation.isPending ? "Saving…" : "Mark contacted"}
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
                className={`w-full ${selectClass}`}
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
          <div className="flex items-center justify-between gap-3">
            <Button onClick={save} disabled={updateMutation.isPending} className="rounded-full">
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive rounded-full"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {lead.name}
                    {lead.businessName ? ` · ${lead.businessName}` : ""} will be removed
                    permanently. The deletion is recorded in the activity log, but the lead
                    record itself cannot be recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      confirmDelete();
                    }}
                    disabled={deleteMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteMutation.isPending ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <LeadActivityPanel leadId={lead.id} />
        </div>
      )}
    </div>
  );
}

function LeadActivityPanel({ leadId }: { leadId: string }) {
  const q = useQuery({
    queryKey: ["admin", "lead-activity", leadId],
    queryFn: () => adminFetch<LeadActivityResponse>(`/api/admin/leads/${leadId}/activity`),
  });

  return (
    <div className="pt-4 border-t border-border">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
        Activity
      </p>
      {q.isLoading && <p className="text-xs text-muted-foreground">Loading activity…</p>}
      {q.isError && <p className="text-xs text-destructive">Could not load activity.</p>}
      {q.data && q.data.items.length === 0 && (
        <p className="text-xs text-muted-foreground">No changes recorded yet.</p>
      )}
      <ol className="space-y-1.5">
        {q.data?.items.map((it) => (
          <li key={it.id} className="text-xs text-foreground flex items-start gap-2">
            <span className="text-muted-foreground tabular-nums shrink-0 w-32">
              {new Date(it.createdAt).toLocaleString()}
            </span>
            <span className="flex-1">
              {formatActivity(it.type, it.fromValue, it.toValue)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function formatActivity(
  type: string,
  fromValue: string | null,
  toValue: string | null,
): string {
  if (type === "status_changed") {
    return `Status: ${fromValue ?? "—"} → ${toValue ?? "—"}`;
  }
  if (type === "notes_changed") {
    const from = fromValue ? `"${truncate(fromValue, 40)}"` : "empty";
    const to = toValue ? `"${truncate(toValue, 40)}"` : "empty";
    return `Notes: ${from} → ${to}`;
  }
  if (type === "deleted") {
    return "Lead deleted";
  }
  return type;
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}
