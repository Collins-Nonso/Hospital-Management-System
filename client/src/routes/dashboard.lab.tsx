import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlaskConical, Upload } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDB, db } from "@/lib/store";

export const Route = createFileRoute("/dashboard/lab")({
  head: () => ({ meta: [{ title: "Laboratory — MediCore" }] }),
  component: LabPage,
});

function LabPage() {
  const requests = useDB((d) => d.labRequests);
  const results = useDB((d) => d.labResults);
  const patients = useDB((d) => d.patients);
  const doctors = useDB((d) => d.doctors);

  const [openReq, setOpenReq] = useState(false);
  const [reqForm, setReqForm] = useState({ patientId: "", doctorId: "", testType: "" });

  const [openRes, setOpenRes] = useState<{ id: string } | null>(null);
  const [resultText, setResultText] = useState("");

  const submitReq = () => {
    if (!reqForm.patientId || !reqForm.doctorId || !reqForm.testType.trim()) { toast.error("All fields required"); return; }
    db.addLabRequest(reqForm); toast.success("Lab request created");
    setOpenReq(false); setReqForm({ patientId: "", doctorId: "", testType: "" });
  };

  const submitRes = () => {
    if (!openRes) return;
    if (!resultText.trim()) { toast.error("Result text required"); return; }
    try { db.addLabResult({ labRequestId: openRes.id, result: resultText }); toast.success("Result uploaded"); setOpenRes(null); setResultText(""); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laboratory"
        description="Create lab requests and upload results."
        actions={
          <Dialog open={openReq} onOpenChange={setOpenReq}>
            <DialogTrigger asChild><Button><FlaskConical className="mr-1 h-4 w-4" />New lab request</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create lab request</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5"><Label>Patient</Label>
                  <Select value={reqForm.patientId} onValueChange={(v) => setReqForm({ ...reqForm, patientId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Doctor</Label>
                  <Select value={reqForm.doctorId} onValueChange={(v) => setReqForm({ ...reqForm, doctorId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    <SelectContent>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Test type</Label><Input value={reqForm.testType} onChange={(e) => setReqForm({ ...reqForm, testType: e.target.value })} placeholder="Blood test" /></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpenReq(false)}>Cancel</Button><Button onClick={submitReq}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card><CardContent className="p-4 overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Patient</TableHead><TableHead>Doctor</TableHead><TableHead>Test</TableHead>
            <TableHead>Status</TableHead><TableHead>Result</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {requests.map((r) => {
              const p = patients.find((x) => x.id === r.patientId);
              const d = doctors.find((x) => x.id === r.doctorId);
              const result = results.find((x) => x.labRequestId === r.id);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{p ? `${p.firstName} ${p.lastName}` : "—"}</TableCell>
                  <TableCell>{d?.name ?? "—"}</TableCell>
                  <TableCell>{r.testType}</TableCell>
                  <TableCell><Badge variant={r.status === "completed" ? "default" : "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                  <TableCell className="max-w-[260px] truncate text-muted-foreground">{result?.result ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {!result && <Button size="sm" variant="outline" onClick={() => setOpenRes({ id: r.id })}><Upload className="mr-1 h-3.5 w-3.5" />Upload result</Button>}
                  </TableCell>
                </TableRow>
              );
            })}
            {requests.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No lab requests yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!openRes} onOpenChange={(o) => !o && setOpenRes(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload lab result</DialogTitle></DialogHeader>
          <Textarea rows={5} placeholder="Result findings…" value={resultText} onChange={(e) => setResultText(e.target.value)} />
          <DialogFooter><Button variant="outline" onClick={() => setOpenRes(null)}>Cancel</Button><Button onClick={submitRes}>Upload</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
