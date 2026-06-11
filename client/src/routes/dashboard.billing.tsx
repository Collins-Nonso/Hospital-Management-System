import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDB, db, type BillItem } from "@/lib/store";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing — MediCore" }] }),
  component: BillingPage,
});

function BillingPage() {
  const bills = useDB((d) => d.bills);
  const patients = useDB((d) => d.patients);

  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [items, setItems] = useState<BillItem[]>([{ name: "", amount: 0 }]);

  const submit = () => {
    if (!patientId) { toast.error("Select a patient"); return; }
    if (items.some((i) => !i.name.trim() || i.amount <= 0)) { toast.error("Each item needs a name and positive amount"); return; }
    db.addBill({ patientId, items });
    toast.success("Invoice created");
    setOpen(false); setPatientId(""); setItems([{ name: "", amount: 0 }]);
  };

  const total = (b: typeof bills[number]) => b.items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Generate invoices and track payments."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />New invoice</Button></DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>Create invoice</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5"><Label>Patient</Label>
                  <Select value={patientId} onValueChange={setPatientId}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Items</Label>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setItems([...items, { name: "", amount: 0 }])}><Plus className="mr-1 h-3.5 w-3.5" />Add item</Button>
                  </div>
                  {items.map((it, i) => (
                    <div key={i} className="grid grid-cols-[1fr_140px_auto] gap-2">
                      <Input placeholder="Description" value={it.name} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                      <Input type="number" min={0} placeholder="Amount" value={it.amount || ""} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, amount: Number(e.target.value) } : x))} />
                      {items.length > 1 && <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </div>
                  ))}
                  <div className="rounded-md border bg-muted/40 px-3 py-2 text-right text-sm">Total: <span className="font-semibold">{items.reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}</span></div>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card><CardContent className="p-4 overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Patient</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead>
            <TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Action</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {bills.map((b) => {
              const p = patients.find((x) => x.id === b.patientId);
              return (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{p ? `${p.firstName} ${p.lastName}` : "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.items.map((i) => `${i.name} (${i.amount.toLocaleString()})`).join(", ")}</TableCell>
                  <TableCell className="font-semibold">{total(b).toLocaleString()}</TableCell>
                  <TableCell><Badge variant={b.status === "paid" ? "default" : "secondary"} className="capitalize">{b.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {b.status === "unpaid" && (
                      <Button size="sm" onClick={() => { try { db.payBill(b.id); toast.success("Marked as paid"); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}>
                        <CreditCard className="mr-1 h-3.5 w-3.5" />Mark paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {bills.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No invoices yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
