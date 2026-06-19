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
import { billSchema, scrub, validate } from "@/lib/validation";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing - MediCore" }] }),
  component: BillingPage,
});

type DraftItem = { itemName: string; quantity: number; unitPrice: number };
function toBillItem(d: DraftItem): BillItem {
  return {
    itemName: d.itemName,
    quantity: d.quantity,
    unitPrice: d.unitPrice,
    totalPrice: d.quantity * d.unitPrice,
  };
}

function BillingPage() {
  const bills = useDB((d) => d.billings);
  const patients = useDB((d) => d.patients);

  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [items, setItems] = useState<DraftItem[]>([{ itemName: "", quantity: 1, unitPrice: 0 }]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer" | "insurance">("cash");

  const submit = async () => {
    const data = validate(billSchema, { patientId, items });
    if (!data) return;
    const billItems = items.map(toBillItem);
    // const totalAmount = billItems.reduce((s, i) => s + i.totalPrice, 0);
    try {
      await db.addBill({
        // invoiceNumber: `INV-${Date.now()}`,
        patientId,
        billItems,
        // totalAmount,
        paymentMethod,
        notes,
      });
      toast.success("Invoice created");
      setOpen(false);
      setPatientId("");
      setItems([{ itemName: "", quantity: 1, unitPrice: 0 }]);
      setNotes("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create invoice");
    }
  };

  const draftTotal = items.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0), 0);

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
                <div className="space-y-1.5">
                  <Label>Patient</Label>
                  <Select value={patientId} onValueChange={setPatientId}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Payment method</Label>
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Items</Label>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setItems([...items, { itemName: "", quantity: 1, unitPrice: 0 }])}>
                      <Plus className="mr-1 h-3.5 w-3.5" />Add item
                    </Button>
                  </div>
                  {items.map((it, i) => (
                    <div key={i} className="grid grid-cols-[1fr_80px_120px_auto] gap-2">
                      <Input maxLength={120} placeholder="Description" value={it.itemName} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, itemName: scrub(e.target.value) } : x))} />
                      <Input type="number" min={0} max={10000000} placeholder="Quantity" value={it.quantity || ""} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, quantity: Number(e.target.value) } : x))} />
                      <Input type="number" min={0} placeholder="Unit price" value={it.unitPrice || ""} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, unitPrice: Number(e.target.value) } : x))} />
                      {items.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="rounded-md border bg-muted/40 px-3 py-2 text-right text-sm">
                    Total: <span className="font-semibold">{draftTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Notes</Label>
                  <Input placeholder="Optional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submit}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card><CardContent className="p-4 overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Invoice</TableHead><TableHead>Patient</TableHead><TableHead>Items</TableHead>
            <TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {bills.map((b) => {
              const p = patients.find((x) => x.id === b.patientId);
              const total = b.billItems?.reduce((s, i) => s + (i.totalPrice ?? 0), 0) ?? b.totalAmount ?? 0;
              return (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.invoiceNumber}</TableCell>
                  <TableCell className="font-medium">{p ? `${p.firstName} ${p.lastName}` : "—"}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                    {(b.billItems ?? []).map((i) => `${i.itemName} ×${i.quantity}`).join(", ")}
                  </TableCell>
                  <TableCell className="font-semibold">{total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={b.paymentStatus === "paid" ? "default" : "secondary"} className="capitalize">
                      {b.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {b.paymentStatus === "pending" && (
                      <Button size="sm" onClick={async () => {
                        try { await db.payBill(b.id); toast.success("Marked as paid"); }
                        catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                      }}>
                        <CreditCard className="mr-1 h-3.5 w-3.5" />Mark paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {bills.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No invoices yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
