import { lazy, Suspense, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAdminSession,
  useAdminLogin,
  useAdminLogout,
  useListSubscribers,
  getGetAdminSessionQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, LogOut, RefreshCw } from "lucide-react";
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
const LeadsView = lazy(() =>
  import("@/components/admin/LeadsView").then((m) => ({ default: m.LeadsView })),
);

function AdminTabFallback() {
  return <p className="text-sm text-muted-foreground">Loading…</p>;
}

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

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const qc = useQueryClient();
  const subs = useListSubscribers();
  const logout = useAdminLogout();

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin"] });
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
            <TabsTrigger value="leads">Leads</TabsTrigger>
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
          <TabsContent value="leads" className="mt-6">
            <Suspense fallback={<AdminTabFallback />}><LeadsView /></Suspense>
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
