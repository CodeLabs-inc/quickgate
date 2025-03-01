'use client'
import Header from '@/components/_globals/header'
import React, { useContext, useEffect, useState } from 'react'
import styles from './page.module.css'
import Page from '@/components/_globals/page'
import { AuthContext } from '@/components/_context/AuthContext'
import CardAlert from '@/components/cards/CardAlert'
import Title from '@/components/titles/Title'
import InputUpload from '@/components/inputs/InputUpload'
import toast from 'react-hot-toast'
import { CircularProgressbar } from 'react-circular-progressbar'
import { getGateDashboard, getLast7DaysTickets, getWeeklyDistribution } from '@/services/api'
import Card from '@/components/cards/Card'
import Input from '@/components/inputs/input'
import { EyeIcon } from 'lucide-react'
import ModalPlateLookup from '@/components/modals/ModalPlateLookup'
import Modal from '@/components/_globals/modal'
import NoTicket from '@/components/404/NoTickets'
import { BarChartBig } from '@/components/charts/BarChartLastSeven'
import { BarChartBigWeekly } from '@/components/charts/BarChartWeeklyDistribution'




function Index() {
  const { role } = useContext(AuthContext)


  if (role === 'operator') {
    return (
      <OperatorDashboard />
    )
  }

  if (role === 'admin') {
    return (
      <AdminDashboard />
    )
  }

}

export default Index



const OperatorDashboard = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [vehicleData, setVehicleData] = useState<any>(null)
  const [modalPlate, setModalPlate] = useState<string | null>(null)

  const [last7Days, setLast7Days] = useState<any>(null)
  const [weeklyDistribution, setWeeklyDistribution] = useState<any>(null)

  const handleFetchDashboardData = async () => {
    const call = await getGateDashboard()

    if (call.success) {
      console.log(call.data)
      setDashboardData(call.data)
      setVehicleData(call.data.vehiclesList)
    }
  }

  const handleFetchAnalytics = async () => {
    const call = await getLast7DaysTickets()
    const call1 = await getWeeklyDistribution()

    if (call.success){
      console.log(call.data)
      setLast7Days(call.data)
    }

    if (call1.success){
      console.log(call1.data)
      setWeeklyDistribution(call1.data)
    }
  }

  useEffect(() => {
    handleFetchDashboardData()
    handleFetchAnalytics()
  }, [])


  return (
    <div className={styles.main}>
      <Header title={'Overview'} />
      <Page>
        <Title
          title={'Dashboard'}
          subtitle={'Overview'}

        />
        {/* Line 1 Dashboard */}
        <div className='flex flex-row items-center justify-center w-full gap-4'>
          <Card style={{ width: '30%', position: 'relative', height: '277px', }}>
            <p style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '20px', textAlign: 'left', width: '100%', marginBottom: '20px' }}>Ocupacion Corriente</p>
            <CircularProgressbar
              styles={{
                root: { width: '180px', marginTop: '7px', transform: 'translateY(20px)', position: 'absolute' },
                trail: { stroke: 'var(--background)' },
                path: { stroke: 'yellowgreen' },
                text: { fill: 'white', transform: 'translate(-13px, 4px)' },

              }}
              value={dashboardData?.vehiclesList.length}
              maxValue={dashboardData?.settings.capacity}
              text={`${dashboardData ? `${((dashboardData.vehiclesList.length / dashboardData.settings.capacity) * 100).toFixed(0)}` : '...'}%`}
            //text={`2`}
            />
          </Card>
          <Card style={{ padding: '20px 20px', width: '70%' }}>
            <h2 style={{ fontSize: '20px', textAlign: 'left', width: '100%', marginBottom: '20px' }}>Status de los servicios</h2>

            <div className='w-full flex flex-col gap-2'>

              <div className='w- full flex flex-row items-center justify-between gap-2'>
                <div>
                  <p style={{ fontSize: '15px' }}>Puertas</p>
                  <p style={{ fontSize: '12px', color: '#FFFFFF70' }}>Entrada y Salida</p>
                </div>
                <div style={{ height: '10px', width: '10px', borderRadius: '50%', background: 'yellowgreen' }} />
              </div>

              <div className='w- full flex flex-row items-center justify-between gap-2'>
                <div>
                  <p style={{ fontSize: '15px' }}>Salud Brazos</p>
                  <p style={{ fontSize: '12px', color: '#FFFFFF70' }}>Calidad del funcionamiento mecanico</p>
                </div>
                <div style={{ height: '10px', width: '10px', borderRadius: '50%', background: 'yellowgreen' }} />
              </div>

              <div className='w- full flex flex-row items-center justify-between gap-2'>
                <div>
                  <p style={{ fontSize: '15px' }}>Limpieza Camaras</p>
                  <p style={{ fontSize: '12px', color: '#FFFFFF70' }}>Claridad de lectura placas debido a la limpieza</p>
                </div>
                <div style={{ height: '10px', width: '10px', borderRadius: '50%', background: 'yellowgreen' }} />
              </div>

              <div className='w- full flex flex-row items-center justify-between gap-2'>
                <div>
                  <p style={{ fontSize: '15px' }}>Applicacion</p>
                  <p style={{ fontSize: '12px', color: '#FFFFFF70' }}>Conexion clientes</p>
                </div>
                <div style={{ height: '10px', width: '10px', borderRadius: '50%', background: 'yellowgreen' }} />
              </div>

            </div>
          </Card>
        </div>

        {/* Line 2 Dashboard */}
        <div className='flex flex-row items-center justify-center w-full gap-4 mt-6'>
          <Card style={{ width: '100%', height: '400px', alignItems: 'center', justifyContent: "flex-start", overflow: 'auto', padding: '20px 20px' }}>

            <div className='flex flex-row items-center justify-between w-full mt-6'>
              <p style={{ fontSize: '20px', textAlign: 'left', width: '100%', marginBottom: '20px' }}>Vehiculos parqueados</p>
              <div className='w-[300px]'>
                <Input
                  type='search'
                  placeholder='Buscar'
                  style={{ width: '50%', height: '40px' }}
                  value={searchValue}
                  onChange={(value) => {
                    //regex only letter and numbers
                    const regex = /^[a-zA-Z0-9]*$/
                    if (!regex.test(value)) {
                      toast.error('Solo se permiten letras y numeros')
                      return
                    }


                    setSearchValue(value)

                    const filtered = dashboardData.vehiclesList.filter((vehicle: any) => {
                      return vehicle.toLowerCase().includes(value.toLowerCase())
                    })
                    setVehicleData(filtered)
                  }}

                />
              </div>
            </div>

            <div className='w-full'>
              {
                vehicleData &&
                vehicleData.length > 0 ?
                vehicleData.map((vehicle: any, index: number) => (
                  <div
                    key={index}
                    className='flex flex-row items-center justify-between w-full gap-4' style={{ padding: '10px 20px', background: index % 2 === 0 ? 'var(--background)' : 'var(--background-2)' }}
                    onClick={() => setModalPlate(vehicle)}
                  >
                    <p>
                      {vehicle}
                    </p>
                    <EyeIcon width={20} className='cursor-pointer'/>
                  </div>
                ))
                :
                <div className='w-[100%] h-[200px] flex items-center justify-center'>
                  <p style={{color: "#FFFFFF70", fontSize: '14px'}}>
                    Esta placa no esta en el sistema
                  </p>
                </div>
              }
            </div>

            {
              modalPlate &&
              <Modal
                isOpen={modalPlate ? true : false}
                onClose={() => setModalPlate(null)}
              >
                <ModalPlateLookup 
                  plate={modalPlate} 
                  onClose={()=>{
                    setModalPlate(null)
                  }}
                />
              </Modal>
            }

          </Card>
        </div>

        {/* Line 3 Dashboard  */}
        <div className='flex flex-row items-center justify-center w-full gap-4 mt-6'>
          {
            last7Days &&
            <BarChartBig
              chartData={last7Days.map((day: any) => {
                return {
                  date: day.date,
                  desktop: day.count
                }
              })}
            />
          }
        </div>

        {/* Line 4 Dashboard  */}
        <div className='flex flex-row items-center justify-center w-full gap-4 mt-6'>
          {
            weeklyDistribution &&
            <BarChartBigWeekly
              chartData={weeklyDistribution.map((day: any) => {
                return {
                  date: day.day,
                  desktop: day.count
                }
              })}
            />
          }
        </div>
      </Page>
    </div>
  )
}

const AdminDashboard = () => {
  return (
    <div className={styles.main}>
      <Header title={'Overview'} />
      <Page>
        <Title
          title={'Dashboard'}
          subtitle={'Overview'}

        />
        <CardAlert
          title={'Welcome to the dashboard'}
          message={'This is the dashboard of the application. Here you can see all the information you need to manage your account.'}
          color='orange'
        />

      </Page>
    </div>
  )
}