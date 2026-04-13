"use client"

import * as React from "react"
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RoomType = {
  id: number
  nome: { it: string; en: string; de: string; fr: string }
  capacita: number
  numCamere: number
  maxOta: number
  amenities: string
  attivo: boolean
}

const initialRoomTypes: RoomType[] = [
  { id: 1, nome: { it: "Singola", en: "Single", de: "Einzelzimmer", fr: "Chambre Simple" }, capacita: 1, numCamere: 3, maxOta: 3, amenities: "Wi-Fi, TV, Aria condizionata", attivo: true },
  { id: 2, nome: { it: "Doppia Standard", en: "Double Standard", de: "Doppelzimmer Standard", fr: "Chambre Double Standard" }, capacita: 2, numCamere: 6, maxOta: 6, amenities: "Wi-Fi, TV, Aria condizionata, Minibar", attivo: true },
  { id: 3, nome: { it: "Doppia Superiore", en: "Double Superior", de: "Doppelzimmer Superior", fr: "Chambre Double Supérieure" }, capacita: 2, numCamere: 4, maxOta: 4, amenities: "Wi-Fi, TV, Aria condizionata, Minibar, Vista panoramica", attivo: true },
  { id: 4, nome: { it: "Tripla Standard", en: "Triple Standard", de: "Dreibettzimmer Standard", fr: "Chambre Triple Standard" }, capacita: 3, numCamere: 3, maxOta: 3, amenities: "Wi-Fi, TV, Aria condizionata", attivo: true },
  { id: 5, nome: { it: "Quadrupla Standard", en: "Quadruple Standard", de: "Vierbettzimmer Standard", fr: "Chambre Quadruple Standard" }, capacita: 4, numCamere: 2, maxOta: 2, amenities: "Wi-Fi, TV, Aria condizionata", attivo: true },
  { id: 6, nome: { it: "Suite", en: "Suite", de: "Suite", fr: "Suite" }, capacita: 2, numCamere: 2, maxOta: 2, amenities: "Wi-Fi, TV, Aria condizionata, Minibar, Vasca idromassaggio, Salotto", attivo: true },
  { id: 7, nome: { it: "Junior Suite", en: "Junior Suite", de: "Junior Suite", fr: "Junior Suite" }, capacita: 2, numCamere: 3, maxOta: 3, amenities: "Wi-Fi, TV, Aria condizionata, Minibar, Salotto", attivo: true },
  { id: 8, nome: { it: "Twin", en: "Twin", de: "Zweibettzimmer", fr: "Chambre Twin" }, capacita: 2, numCamere: 4, maxOta: 4, amenities: "Wi-Fi, TV, Aria condizionata, Letti singoli separati", attivo: true },
]

const emptyForm = (): Omit<RoomType, "id" | "numCamere"> => ({
  nome: { it: "", en: "", de: "", fr: "" },
  capacita: 1,
  maxOta: 1,
  amenities: "",
  attivo: true,
})

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = React.useState<RoomType[]>(initialRoomTypes)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [form, setForm] = React.useState(emptyForm())

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm())
    setDialogOpen(true)
  }

  const openEdit = (rt: RoomType) => {
    setEditingId(rt.id)
    setForm({
      nome: { ...rt.nome },
      capacita: rt.capacita,
      maxOta: rt.maxOta,
      amenities: rt.amenities,
      attivo: rt.attivo,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingId !== null) {
      setRoomTypes((prev) =>
        prev.map((rt) =>
          rt.id === editingId ? { ...rt, ...form } : rt
        )
      )
    } else {
      const newId = Math.max(0, ...roomTypes.map((r) => r.id)) + 1
      setRoomTypes((prev) => [
        ...prev,
        { id: newId, numCamere: 0, ...form },
      ])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    setRoomTypes((prev) => prev.filter((rt) => rt.id !== id))
  }

  const setNome = (lang: keyof RoomType["nome"], value: string) => {
    setForm((f) => ({ ...f, nome: { ...f.nome, [lang]: value } }))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tipologie di Stanze</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestisci le tipologie di stanze disponibili nell&apos;hotel
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={openAdd}>
                <PlusIcon />
                Aggiungi Tipologia
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingId !== null ? "Modifica Tipologia" : "Nuova Tipologia"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              {/* Nome multilingue */}
              <div className="flex flex-col gap-2">
                <Label>Nome</Label>
                <Tabs defaultValue="it">
                  <TabsList>
                    <TabsTrigger value="it">IT</TabsTrigger>
                    <TabsTrigger value="en">EN</TabsTrigger>
                    <TabsTrigger value="de">DE</TabsTrigger>
                    <TabsTrigger value="fr">FR</TabsTrigger>
                  </TabsList>
                  <TabsContent value="it" className="mt-2">
                    <Input
                      placeholder="Nome in italiano"
                      value={form.nome.it}
                      onChange={(e) => setNome("it", e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="en" className="mt-2">
                    <Input
                      placeholder="Name in English"
                      value={form.nome.en}
                      onChange={(e) => setNome("en", e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="de" className="mt-2">
                    <Input
                      placeholder="Name auf Deutsch"
                      value={form.nome.de}
                      onChange={(e) => setNome("de", e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="fr" className="mt-2">
                    <Input
                      placeholder="Nom en français"
                      value={form.nome.fr}
                      onChange={(e) => setNome("fr", e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Capacita e Max OTA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="capacita">Capacità nominale</Label>
                  <Input
                    id="capacita"
                    type="number"
                    min={1}
                    value={form.capacita}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, capacita: parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="maxOta">Max disponibilità OTA</Label>
                  <Input
                    id="maxOta"
                    type="number"
                    min={0}
                    value={form.maxOta}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, maxOta: parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Input
                  id="amenities"
                  placeholder="Wi-Fi, TV, Aria condizionata, ..."
                  value={form.amenities}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amenities: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Separa con virgole
                </p>
              </div>

              {/* Stato */}
              <div className="flex items-center gap-3">
                <Label htmlFor="attivo">Stato</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="attivo"
                    type="checkbox"
                    checked={form.attivo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, attivo: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm text-muted-foreground">Attivo</span>
                </div>
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

      {/* Table */}
      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome (IT)</TableHead>
              <TableHead>Capacità</TableHead>
              <TableHead>N. Camere</TableHead>
              <TableHead>Max OTA</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypes.map((rt) => (
              <TableRow key={rt.id}>
                <TableCell className="font-medium">{rt.nome.it}</TableCell>
                <TableCell>{rt.capacita} {rt.capacita === 1 ? "persona" : "persone"}</TableCell>
                <TableCell>{rt.numCamere}</TableCell>
                <TableCell>{rt.maxOta}</TableCell>
                <TableCell>
                  <Badge variant={rt.attivo ? "default" : "secondary"}>
                    {rt.attivo ? "Attivo" : "Inattivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(rt)}
                    >
                      <PencilIcon />
                      <span className="sr-only">Modifica</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(rt.id)}
                    >
                      <TrashIcon />
                      <span className="sr-only">Elimina</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
