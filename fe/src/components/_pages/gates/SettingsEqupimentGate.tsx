"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Computer,
  Camera,
  DoorOpenIcon as Gate,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { getDevices } from "@/services/api"
import toast from "react-hot-toast"
import LoaderWhite from "@/components/loaders/LoaderWhite"

// Device type definition
type DeviceStatus = "online" | "offline" | "warning" | "maintenance"
type DeviceType = "computer" | "camera" | "gate"

interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  lastSeen: string
  location: string
  ipAddress: string
}

// Sample data
const devices1: Device[] = [
  {
    id: "comp-001",
    name: "Main Office PC",
    type: "computer",
    status: "online",
    lastSeen: "Just now",
    location: "Servidor Central",
    ipAddress: "192.168.1.101",
  },
  {
    id: "cam-001",
    name: "Camera",
    type: "camera",
    status: "offline",
    lastSeen: "Just now",
    location: "Entrada P1",
    ipAddress: "192.168.1.201",
  },
  {
    id: "cam-002",
    name: "Camera",
    type: "camera",
    status: "warning",
    lastSeen: "5 minutes ago",
    location: "Salida P1",
    ipAddress: "192.168.1.202",
  },
  {
    id: "gate-002",
    name: "Gate",
    type: "gate",
    status: "maintenance",
    lastSeen: "1 hour ago",
    location: "Entrada/Salida P1",
    ipAddress: "192.168.1.302",
  },
]

export default function SettingsEquipmentGate() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const [isLoading, setIsLoading] = useState(true)
  const [devices, setDevices] = useState<any>([])



  const handleRefresh = async () => {
    handleFetchDevices()
  }
  const handleFetchDevices = async () => {
    setIsLoading(true)
    setDevices([])

    const call = await getDevices()
    setIsLoading(false)

    if (call.status == 400) {
      toast.error('Error nel cargar los dispositivos')
      return
    }


    if (call.status == 201) {
      return
    }

    if (call.status === 200) {
      const deviceObject = {
        id: call.data.data.id ?? 'no_id',
        name: call.data.data.name ?? 'Servidor Principal',
        type: 'computer',
        status: call.data.data.status ?? 'offline',
        lastSeen: new Date(call.data.data.lastSeen).toLocaleDateString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) ?? '--',
        location: 'Servidor',
        ipAddress: call.data.data.ipAddress ?? '--'
      }

      let camerasObjects = []
      if (call.data.data.cameras && call.data.data.cameras.length > 0) {

        camerasObjects = call.data.data.cameras.map((camera: any) => {
          return {
            id: camera.id,
            name: camera.name,
            type: 'camera',
            status: 'online',
            lastSeen: camera.lastSeen,
            location: camera.location,
            ipAddress: camera.ipAddress
          }
        })

      }


      setDevices((prevDevices: any) => [...prevDevices, deviceObject, ...camerasObjects])
    }

    console.log(call)
  }


  useEffect(() => {
    handleFetchDevices()
  }, [])

  // Filter devices based on search query and active tab
  const filteredDevices = devices.filter((device: any) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return device.type === activeTab && matchesSearch
  })

  // Get device icon based on type
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case "computer":
        return <Computer className="h-5 w-5" />
      case "camera":
        return <Camera className="h-5 w-5" />
      case "gate":
        return <Gate className="h-5 w-5" />
    }
  }
  // Get status badge based on device status
  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-950 text-green-400 border-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Online
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-red-950 text-red-400 border-red-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Offline
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-950 text-amber-400 border-amber-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Warning
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-blue-950 text-blue-400 border-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Maintenance
          </Badge>
        )
    }
  }


  return (
    <div className="dark w-full min-h-screentext-gray-200 ">
      <div className=" mx-auto">
        <div className="flex flex-col space-y-6">

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#ffffff30]" />
              <Input
                type="text"
                placeholder="Search devices..."
                className="pl-9 text-gray-200 placeholder:text-[#ffffff30] focus-visible:ring-[#ffffff30]"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                style={{
                  background: "var(--steam-color)"
                }}

              />
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex flex-row gap-2 items-center jusitfy-center py-2 px-4 rounded-[20px] cursor-pointer"
                style={{
                  background: "var(--steam-color)",
                  cursor: 'pointer!'
                }}
                onClick={
                  handleRefresh
                }
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className=""
              style={{
                background: "var(--steam-color)"
              }}
            >
              <TabsTrigger value="all" className="data-[state=active]:bg-[#ffffff30]">
                Todos
              </TabsTrigger>
              <TabsTrigger value="computer" className="data-[state=active]:bg-[#ffffff30]">
                Servidores
              </TabsTrigger>
              <TabsTrigger value="camera" className="data-[state=active]:bg-[#ffffff30]">
                Camaras
              </TabsTrigger>
              <TabsTrigger value="gate" className="data-[state=active]:bg-[#ffffff30]">
                Gates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <DeviceList devices={filteredDevices} getDeviceIcon={getDeviceIcon} getStatusBadge={getStatusBadge} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="computer" className="mt-4">
              <DeviceList devices={filteredDevices} getDeviceIcon={getDeviceIcon} getStatusBadge={getStatusBadge} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="camera" className="mt-4">
              <DeviceList devices={filteredDevices} getDeviceIcon={getDeviceIcon} getStatusBadge={getStatusBadge} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="gate" className="mt-4">
              <DeviceList devices={filteredDevices} getDeviceIcon={getDeviceIcon} getStatusBadge={getStatusBadge} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface DeviceListProps {
  devices: Device[]
  getDeviceIcon: (type: DeviceType) => JSX.Element
  getStatusBadge: (status: DeviceStatus) => JSX.Element
  isLoading: boolean
}

function DeviceList({ devices, getDeviceIcon, getStatusBadge, isLoading }: DeviceListProps) {

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
        <LoaderWhite/>
      </div>
    )
  }


  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium">Ningun dispositivo encontrado</h3>
        <p className="text-gray-500 mt-2">Cambiar los parametros de busqueda</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {devices.map((device) => (
        <Card key={device.id}
          className="overflow-hidden"
          style={{
            background: "var(--status-background)",
            borderRadius: '30px'
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--card-background)] text-gray-300">
                  {getDeviceIcon(device.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{device.name}</h3>

                    {/* <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-gray-500">Last seen:</span> {device.lastSeen}
                    </div> */}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1 w-[220px]">
                      <span className="text-gray-500">ID:</span> {device.id}
                    </div>
                    <div className="flex items-center gap-1 w-[220px]">
                      <span className="text-gray-500">IP:</span> {device.ipAddress}
                    </div>
                    <div className="flex items-center gap-1 w-[220px]">
                      <span className="text-gray-500">Location:</span> {device.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                {getStatusBadge(device.status)}
                {/*  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 bg-[#ffffff20]">
                  Details
                </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

