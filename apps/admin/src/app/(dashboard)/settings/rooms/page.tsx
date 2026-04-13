"use client"

import * as React from "react"
import { PlusIcon, PencilIcon, TrashIcon, ArrowUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

type RoomStatus = "disponibile" | "pulizia" | "manutenzione" | "fuori_servizio"

type Room = {
  id: number
  numero: string
  tipologiaId: number
  piano: number
  note: string
  stato: RoomStatus
}

const roomTypes = [
  { id: 1, nome: "Singola" },
  { id: 2, nome: "Doppia Standard" },
  { id: 3, nome: "Doppia Superiore" },
  { id: 4, nome: "Tripla Standard" },
  { id: 5, nome: "Quadrupla Standard" },
  { id: 6, nome: "Suite" },
  { id: 7, nome: "Junior Suite" },
  { id: 8, nome: "Twin" },
]

const initialRooms: Room[] = [
  // Piano 1
  { id: 1, numero: "11", tipologiaId: 1, piano: 1, note: "", stato: "disponibile" },
  { id: 2, numero: "12", tipologiaId: 2, piano: 1, note: "", stato: "disponibile" },
  { id: 3, numero: "13", tipologiaId: 2, piano: 1, note: "", stato: "pulizia" },
  { id: 4, numero: "14", tipologiaId: 3, piano: 1, note: "", stato: "disponibile" },
  { id: 5, numero: "15", tipologiaId: 8, piano: 1, note: "", stato: "disponibile" },
  { id: 6, numero: "16", tipologiaId: 4, piano: 1, note: "Balcone laterale", stato: "manutenzione" },
  // Piano 2
  { id: 7, numero: "21", tipologiaId: 1, piano: 2, note: "", stato: "disponibile" },
  { id: 8, numero: "22", tipologiaId: 2, piano: 2, note: "", stato: "disponibile" },
  { id: 9, numero: "23", tipologiaId: 3, piano: 2, note: "Vista giardino", stato: "disponibile" },
  { id: 10, numero: "24", tipologiaId: 8, piano: 2, note: "", stato: "disponibile" },
  { id: 11, numero: "25", tipologiaId: 4, piano: 2, note: "", stato: "pulizia" },
  { id: 12, numero: "26", tipologiaId: 5, piano: 2, note: "", stato: "disponibile" },
  // Piano 3
  { id: 13, numero: "31", tipologiaId: 2, piano: 3, note: "", stato: "disponibile" },
  { id: 14, numero: "32", tipologiaId: 3, piano: 3, note: "Vista lago", stato: "disponibile" },
  { id: 15, numero: "33", tipologiaId: 7, piano: 3, note: "", stato: "disponibile" },
  { id: 16, numero: "34", tipologiaId: 6, piano: 3, note: "Attico, vasca panoramica", stato: "fuori_servizio" },
  { id: 17, numero: "35", tipologiaId: 7, piano: 3, note: "", stato: "disponibile" },
  { id: 18, numero: "36", tipologiaId: 5, piano: 3, note: "", stato: "disponibile" },
]

const statusConfig: Record<RoomStatus, { label: string; className: string }> = {
  disponibile: { label: "Disponibile", className: "bg-green-100 text-green-700 border-green-200" },
  pulizia: { label: "Pulizia", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  manutenzione: { label: "Manutenzione", className: "bg-orange-100 text-orange-700 border-orange-200" },
  fuori_servizio: { label: "Fuori servizio", className: "bg-red-100 text-red-700 border-red-200" },
}

const emptyForm = () => ({
  numero: "",
  tipologiaId: 2,
  piano: 1,
  note: "",
  stato: "disponibile" as RoomStatus,
})

type SortKey = "numero" | "piano"

export default function RoomsPage() {
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [form, setForm] = React.useState(emptyForm())

  // Filters
  const [filterTipologia, setFilterTipologia] = React.useState<string>("all")
  const [filterPiano, setFilterPiano] = React.useState<string>("all")

  // Sort
  const [sortKey, setSortKey] = React.useState<SortKey>("numero")
  const [sortAsc, setSortAsc] = React.useState(true)

  const floors = [...new Set(rooms.map((r) => r.piano))].sort()

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm())
    setDialogOpen(true)
  }

  const openEdit = (room: Room) => {
    setEditingId(room.id)
    setForm({
      numero: room.numero,
      tipologiaId: room.tipologiaId,
      piano: room.piano,
      note: room.note,
      stato: room.stato,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingId !== null) {
      setRooms((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
      )
    } else {
      const newId = Math.max(0, ...rooms.map((r) => r.id)) + 1
      setRooms((prev) => [...prev, { id: newId, ...form }])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== id))
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a)
    else { setSortKey(key); setSortAsc(true) }
  }

  const filtered = rooms
    .filter((r) => filterTipologia === "all" || r.tipologiaId === parseInt(filterTipologia))
    .filter((r) => filterPiano === "all" || r.piano === parseInt(filterPiano))
    .sort((a, b) => {
      const av = sortKey === "numero" ? a.numero : a.piano
      const bv = sortKey === "numero" ? b.numero : b.piano
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })

  const getTipologiaNome = (id: number) =>
    roomTypes.find((t) => t.id === id)?.nome ?? "—"

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Camere</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestisci le camere fisiche dell&apos;hotel
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={openAdd}>
                <PlusIcon />
                Aggiungi Camera
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId !== null ? "Modifica Camera" : "Nuova Camera"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="numero">Numero stanza</Label>
                  <Input
                    id="numero"
                    placeholder="es. 101"
                    value={form.numero}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, numero: e.target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="piano">Piano</Label>
                  <Input
                    id="piano"
                    type="number"
                    min={0}
                    value={form.piano}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, piano: parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Tipologia</Label>
                <Select
                  value={String(form.tipologiaId)}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, tipologiaId: parseInt(v ?? "0") }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona tipologia" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Stato</Label>
                <Select
                  value={form.stato}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, stato: v as RoomStatus }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponibile">Disponibile</SelectItem>
                    <SelectItem value="pulizia">Pulizia</SelectItem>
                    <SelectItem value="manutenzione">Manutenzione</SelectItem>
                    <SelectItem value="fuori_servizio">Fuori servizio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="note">Note (opzionale)</Label>
                <Textarea
                  id="note"
                  placeholder="Note sulla camera..."
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Annulla
              </DialogClose>
              <Button onClick={handleSave}>
                {editingId !== null ? "Salva Modifiche" : "Aggiungi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-muted-foreground">Tipologia:</Label>
          <Select value={filterTipologia} onValueChange={(v) => setFilterTipologia(v ?? "all")}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              {roomTypes.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-muted-foreground">Piano:</Label>
          <Select value={filterPiano} onValueChange={(v) => setFilterPiano(v ?? "all")}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              {floors.map((p) => (
                <SelectItem key={p} value={String(p)}>
                  Piano {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} {filtered.length === 1 ? "camera" : "camere"}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2.5 h-auto py-0 font-medium"
                  onClick={() => toggleSort("numero")}
                >
                  Numero
                  <ArrowUpDownIcon className="ml-1 size-3 text-muted-foreground" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2.5 h-auto py-0 font-medium"
                  onClick={() => toggleSort("piano")}
                >
                  Piano
                  <ArrowUpDownIcon className="ml-1 size-3 text-muted-foreground" />
                </Button>
              </TableHead>
              <TableHead>Tipologia</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((room) => {
              const status = statusConfig[room.stato]
              return (
                <TableRow key={room.id}>
                  <TableCell className="font-medium tabular-nums">
                    {room.numero}
                  </TableCell>
                  <TableCell>{room.piano}</TableCell>
                  <TableCell>{getTipologiaNome(room.tipologiaId)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(room)}
                      >
                        <PencilIcon />
                        <span className="sr-only">Modifica</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(room.id)}
                      >
                        <TrashIcon />
                        <span className="sr-only">Elimina</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nessuna camera trovata
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
