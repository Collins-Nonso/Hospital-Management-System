import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pill } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDB, db } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacy — MediCore" }] }),
  component: PharmacyPage,
});

function PharmacyPage() {
  const prescriptions = useDB((d) => d.prescriptions);
  const dispenses = useDB((d) => d.dispenses);
  const patients = useDB((d) => d.patients);
  const { user } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);

  const dispense = (rxId: string, patientId: string, drugs: string[]) => {
    setBusy(rxId);
    try {
      db.dispensePrescription({ prescriptionId: rxId, patientId, pharmacistId: user?.id ?? "u-unknown", drugs });
      toast.success("Prescription dispensed");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy" description="Dispense prescriptions and track issuance." />

      <Card><CardContent className="p-4 overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Patient</TableHead><TableHead>Medications</TableHead>
            <TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {prescriptions.map((rx) => {
              const p = patients.find((x) => x.id === rx.patientId);
              const dispensed = dispenses.find((dp) => dp.prescriptionId === rx.id);
              const drugList = rx.medications.map((m) => m.name);
              return (
                <TableRow key={rx.id}>
                  <TableCell className="font-medium">{p ? `${p.firstName} ${p.lastName}` : "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{drugList.join(", ")}</TableCell>
                  <TableCell><Badge variant={dispensed ? "default" : "secondary"} className="capitalize">{dispensed ? "dispensed" : "pending"}</Badge></TableCell>
                  <TableCell className="text-right">
                    {!dispensed && (
                      <Button size="sm" disabled={busy === rx.id} onClick={() => dispense(rx.id, rx.patientId, drugList)}>
                        <Pill className="mr-1 h-3.5 w-3.5" /> Dispense
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {prescriptions.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No prescriptions yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
