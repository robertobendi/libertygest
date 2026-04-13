"use client"

import * as React from "react"
import { SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type HotelSettings = {
  // Informazioni
  nome: string
  indirizzo: string
  capCitta: string
  nazione: string
  telefono: string
  email: string
  sitoWeb: string
  // Dati fiscali
  ragioneSociale: string
  partitaIva: string
  iban: string
  valuta: string
  // Impostazioni
  fusoOrario: string
  colore: string
  wifiSsid: string
  wifiPassword: string
  // Normative
  hestaId: string
  polcaCode: string
  istatCode: string
  hestaAutomatico: boolean
}

const defaultSettings: HotelSettings = {
  nome: "Hotel Liberty",
  indirizzo: "Via Roma, 1",
  capCitta: "39100 Bolzano",
  nazione: "IT",
  telefono: "+39 0471 123456",
  email: "info@hotelliberty.it",
  sitoWeb: "www.hotelliberty.it",
  ragioneSociale: "Hotel Liberty S.r.l.",
  partitaIva: "IT01234567890",
  iban: "IT60 X054 2811 1010 0000 0123 456",
  valuta: "EUR",
  fusoOrario: "Europe/Rome",
  colore: "#1a56db",
  wifiSsid: "HotelLiberty",
  wifiPassword: "",
  hestaId: "",
  polcaCode: "",
  istatCode: "",
  hestaAutomatico: false,
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:items-center">
      <Label htmlFor={htmlFor} className="text-muted-foreground sm:text-right sm:pr-4">
        {label}
      </Label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  )
}

export default function HotelSettingsPage() {
  const [settings, setSettings] = React.useState<HotelSettings>(defaultSettings)
  const [saved, setSaved] = React.useState(false)

  const set = <K extends keyof HotelSettings>(key: K, value: HotelSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    // Placeholder: in production this would call an API
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold">Impostazioni Hotel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configura i dati generali, fiscali e normativi dell&apos;hotel
        </p>
      </div>

      {/* Informazioni Hotel */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Informazioni Hotel</CardTitle>
          <CardDescription>Dati identificativi e contatti</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <FormField label="Nome hotel" htmlFor="nome">
              <Input
                id="nome"
                value={settings.nome}
                onChange={(e) => set("nome", e.target.value)}
              />
            </FormField>
            <Separator />
            <FormField label="Indirizzo" htmlFor="indirizzo">
              <Input
                id="indirizzo"
                value={settings.indirizzo}
                onChange={(e) => set("indirizzo", e.target.value)}
              />
            </FormField>
            <FormField label="CAP e Città" htmlFor="capCitta">
              <Input
                id="capCitta"
                value={settings.capCitta}
                onChange={(e) => set("capCitta", e.target.value)}
              />
            </FormField>
            <FormField label="Nazione">
              <Select value={settings.nazione} onValueChange={(v) => set("nazione", v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">Italia</SelectItem>
                  <SelectItem value="CH">Svizzera</SelectItem>
                  <SelectItem value="DE">Germania</SelectItem>
                  <SelectItem value="FR">Francia</SelectItem>
                  <SelectItem value="AT">Austria</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <Separator />
            <FormField label="Telefono" htmlFor="telefono">
              <Input
                id="telefono"
                type="tel"
                value={settings.telefono}
                onChange={(e) => set("telefono", e.target.value)}
              />
            </FormField>
            <FormField label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </FormField>
            <FormField label="Sito web" htmlFor="sitoWeb">
              <Input
                id="sitoWeb"
                value={settings.sitoWeb}
                onChange={(e) => set("sitoWeb", e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Dati Fiscali */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Dati Fiscali</CardTitle>
          <CardDescription>Informazioni per fatturazione e contabilità</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <FormField label="Ragione sociale" htmlFor="ragioneSociale">
              <Input
                id="ragioneSociale"
                value={settings.ragioneSociale}
                onChange={(e) => set("ragioneSociale", e.target.value)}
              />
            </FormField>
            <FormField label="Partita IVA" htmlFor="partitaIva">
              <Input
                id="partitaIva"
                value={settings.partitaIva}
                onChange={(e) => set("partitaIva", e.target.value)}
              />
            </FormField>
            <FormField label="IBAN" htmlFor="iban">
              <Input
                id="iban"
                value={settings.iban}
                onChange={(e) => set("iban", e.target.value)}
              />
            </FormField>
            <FormField label="Valuta">
              <Select value={settings.valuta} onValueChange={(v) => set("valuta", v ?? "")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="CHF">CHF — Franco Svizzero</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Impostazioni */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Impostazioni</CardTitle>
          <CardDescription>Preferenze di sistema e accesso ospiti</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <FormField label="Fuso orario">
              <Select value={settings.fusoOrario} onValueChange={(v) => set("fusoOrario", v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Rome">Europe/Rome (UTC+1/+2)</SelectItem>
                  <SelectItem value="Europe/Zurich">Europe/Zurich (UTC+1/+2)</SelectItem>
                  <SelectItem value="Europe/Berlin">Europe/Berlin (UTC+1/+2)</SelectItem>
                  <SelectItem value="Europe/Paris">Europe/Paris (UTC+1/+2)</SelectItem>
                  <SelectItem value="Europe/Vienna">Europe/Vienna (UTC+1/+2)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Colore principale" htmlFor="colore">
              <div className="flex items-center gap-2">
                <input
                  id="colore"
                  type="color"
                  value={settings.colore}
                  onChange={(e) => set("colore", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
                />
                <Input
                  value={settings.colore}
                  onChange={(e) => set("colore", e.target.value)}
                  className="w-32 font-mono text-xs uppercase"
                  maxLength={7}
                />
              </div>
            </FormField>
            <Separator />
            <FormField label="Wi-Fi SSID" htmlFor="wifiSsid">
              <Input
                id="wifiSsid"
                value={settings.wifiSsid}
                onChange={(e) => set("wifiSsid", e.target.value)}
              />
            </FormField>
            <FormField label="Wi-Fi Password" htmlFor="wifiPassword">
              <Input
                id="wifiPassword"
                type="password"
                value={settings.wifiPassword}
                onChange={(e) => set("wifiPassword", e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Integrazioni Normative */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Integrazioni Normative</CardTitle>
          <CardDescription>Codici per adempimenti legali e statistici</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <FormField label="HESTA ID" htmlFor="hestaId">
              <Input
                id="hestaId"
                value={settings.hestaId}
                onChange={(e) => set("hestaId", e.target.value)}
                placeholder="es. HE-12345"
              />
            </FormField>
            <FormField label="POLCA Code" htmlFor="polcaCode">
              <Input
                id="polcaCode"
                value={settings.polcaCode}
                onChange={(e) => set("polcaCode", e.target.value)}
                placeholder="es. PC-ABC-001"
              />
            </FormField>
            <FormField label="Codice ISTAT" htmlFor="istatCode">
              <Input
                id="istatCode"
                value={settings.istatCode}
                onChange={(e) => set("istatCode", e.target.value)}
                placeholder="es. 021039"
              />
            </FormField>
            <Separator />
            <FormField label="Invio automatico HESTA">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settings.hestaAutomatico}
                  onCheckedChange={(v) => set("hestaAutomatico", v)}
                />
                <span className="text-sm text-muted-foreground">
                  {settings.hestaAutomatico ? "Attivo — invio giornaliero" : "Disattivato"}
                </span>
              </div>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="gap-2">
          <SaveIcon />
          Salva Impostazioni
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Impostazioni salvate
          </span>
        )}
      </div>
    </div>
  )
}
