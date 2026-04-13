"use client"

import * as React from "react"
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

type Ruolo =
  | "proprietario"
  | "admin"
  | "revenue_manager"
  | "reception"
  | "housekeeping"
  | "contabile"
  | "sola_lettura"

type User = {
  id: number
  nome: string
  email: string
  ruolo: Ruolo
  attivo: boolean
  ultimoAccesso: string | null
}

const ruoloConfig: Record<Ruolo, { label: string; className: string }> = {
  proprietario: { label: "Proprietario", className: "bg-purple-100 text-purple-700 border-purple-200" },
  admin: { label: "Admin", className: "bg-blue-100 text-blue-700 border-blue-200" },
  revenue_manager: { label: "Revenue Manager", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  reception: { label: "Reception", className: "bg-green-100 text-green-700 border-green-200" },
  housekeeping: { label: "Housekeeping", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  contabile: { label: "Contabile", className: "bg-orange-100 text-orange-700 border-orange-200" },
  sola_lettura: { label: "Sola Lettura", className: "bg-gray-100 text-gray-600 border-gray-200" },
}

const initialUsers: User[] = [
  {
    id: 1,
    nome: "Rocco Rossi",
    email: "rocco@hotelliberty.it",
    ruolo: "proprietario",
    attivo: true,
    ultimoAccesso: "2026-04-13T09:15:00",
  },
  {
    id: 2,
    nome: "Maria Bianchi",
    email: "maria@hotelliberty.it",
    ruolo: "reception",
    attivo: true,
    ultimoAccesso: "2026-04-13T08:30:00",
  },
  {
    id: 3,
    nome: "Luca Ferrari",
    email: "luca@hotelliberty.it",
    ruolo: "housekeeping",
    attivo: false,
    ultimoAccesso: "2026-03-28T14:00:00",
  },
]

const emptyForm = () => ({
  nome: "",
  email: "",
  ruolo: "reception" as Ruolo,
  attivo: true,
})

function formatDate(iso: string | null): string {
  if (!iso) return "Mai"
  const d = new Date(iso)
  return d.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [form, setForm] = React.useState(emptyForm())

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm())
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingId(user.id)
    setForm({
      nome: user.nome,
      email: user.email,
      ruolo: user.ruolo,
      attivo: user.attivo,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingId !== null) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...form } : u))
      )
    } else {
      const newId = Math.max(0, ...users.map((u) => u.id)) + 1
      setUsers((prev) => [
        ...prev,
        { id: newId, ultimoAccesso: null, ...form },
      ])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Gestione Utenti</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestisci gli utenti e i permessi di accesso al sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={openAdd}>
                <PlusIcon />
                Crea Utente
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId !== null ? "Modifica Utente" : "Nuovo Utente"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome e cognome"
                  value={form.nome}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nome: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@hotelliberty.it"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Ruolo</Label>
                <Select
                  value={form.ruolo}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, ruolo: v as Ruolo }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proprietario">Proprietario</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="revenue_manager">Revenue Manager</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="contabile">Contabile</SelectItem>
                    <SelectItem value="sola_lettura">Sola Lettura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="attivo-switch">Utente attivo</Label>
                <Switch
                  id="attivo-switch"
                  checked={form.attivo}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, attivo: v }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Annulla
              </DialogClose>
              <Button onClick={handleSave}>
                {editingId !== null ? "Salva Modifiche" : "Crea Utente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats summary */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{users.length}</strong> utenti totali
        </span>
        <span>·</span>
        <span>
          <strong className="text-foreground">{users.filter((u) => u.attivo).length}</strong> attivi
        </span>
        <span>·</span>
        <span>
          <strong className="text-foreground">{users.filter((u) => !u.attivo).length}</strong> inattivi
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Ultimo Accesso</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const ruolo = ruoloConfig[user.ruolo]
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium ${ruolo.className}`}
                    >
                      {ruolo.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.attivo ? "default" : "secondary"}>
                      {user.attivo ? "Attivo" : "Inattivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums text-xs">
                    {formatDate(user.ultimoAccesso)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(user)}
                      >
                        <PencilIcon />
                        <span className="sr-only">Modifica</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        <TrashIcon />
                        <span className="sr-only">Elimina</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
