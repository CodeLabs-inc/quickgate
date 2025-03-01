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
import { enterTicket, exitTicket, getAllGatesSelect, getGateDashboard, getLast7DaysTickets, getWeeklyDistribution } from '@/services/api'
import Card from '@/components/cards/Card'
import Input from '@/components/inputs/input'
import { EyeIcon } from 'lucide-react'
import ModalPlateLookup from '@/components/modals/ModalPlateLookup'
import Modal from '@/components/_globals/modal'
import NoTicket from '@/components/404/NoTickets'
import { BarChartBig } from '@/components/charts/BarChartLastSeven'
import { BarChartBigWeekly } from '@/components/charts/BarChartWeeklyDistribution'
import InputCard from '@/components/inputs/inputCard'
import InputSelectCard from '@/components/inputs/inputSelectCard'
import InputSelect from '@/components/inputs/inputSelect'
import ButtonLoading from '@/components/buttons/ButtonLoading'




function Index() {
  const [gates, setGates] = useState([])

  const [selectedGate, setSelectedGate] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [selectedMode, setSelectedMode] = useState('enter') // 'enter' or 'exit'


  const handleRegister = async () => {
    //console.log('selectedMode', selectedMode)
    //console.log('licensePlate', licensePlate)
    //console.log('selectedGate', selectedGate)

    if (selectedMode === 'enter') {
      await handleEnter()
      return true
    } else {
      await handleExit()
      return true
    }
  }

  const handleEnter = async () => {
    const call = await enterTicket(licensePlate, selectedGate)
    if (call.success){
      toast.success('Carro entrado, BRAZO LEVANTADO')
    } else {
      toast.error(call.message)
    }

    return true
  }
  const handleExit = async () => {
    const call = await exitTicket(licensePlate, selectedGate)
    if (call.success){
      toast.success('Carro saliendo, BRAZO LEVANTANDO')
    } else {
      toast.error(call.message)
    }

    return true
  }
  const handleFetchGates = async () => {
    const call = await getAllGatesSelect()

    if (call.success){
      console.log('call.data', call.data)
      setSelectedGate(call.data[0]._id)
      setGates(call.data)
    } else {
      toast.error(call.message)
    }
  }

  useEffect(() => {
    handleFetchGates()
  }, [])

  return (
    <div className={styles.main}>

      <Page sidebarHidden>
        <Title
          title={'Gestion Manual Entradas/Salidas'}
          subtitle={'Sistema de control de entradas y salidas de vehículos, gestion manual, en caso la camara no pueda leer la placa.'}

        />
        <Card style={{ padding: '1.5rem', width: '100%' }}>
          <div className='flex justify-between flex-row w-full gap-4 mb-6'>
            <div 
              className='h-[80px] bg-[#ffffff20] rounded-[7px] flex items-center justify-center cursor-pointer' 
              style={{ 
                width: '50%',
                //background: selectedMode === 'enter' ? '#ffffff80' : '#00000020',
                border: selectedMode === 'enter' ? '1px solid #ffffff' : '1px solid #000000'
              }}
              onClick={() => setSelectedMode('enter')}
            >
              <p>
                Entrada
              </p>
            </div>

            <div 
              className='h-[80px] bg-[#ffffff20] rounded-[7px] flex items-center justify-center cursor-pointer' 
              style={{ 
                width: '50%',
                //background: selectedMode === 'enter' ? '#ffffff20' : '#ffffff80'
                border: selectedMode === 'exit' ? '1px solid #ffffff' : '1px solid #000000'

              }}
              onClick={() => setSelectedMode('exit')}
            >
              <p>
                Salida
              </p>
            </div>
          </div>
          <InputSelect
            value={selectedGate}
            onSelect={(value) => {
              setSelectedGate(value)
            }}
            label='Cual Gate/Parqueo'
            placeholder='Seleccione el parqueo'
            options={gates.map((item: any) => {
              return {
                value: item._id,
                label: item.name
              }
            })}
            style={{
              padding: '0 10px',
            }}
          />
          <Input
            value={licensePlate.toUpperCase()}
            onChange={(value) => {
              setLicensePlate(value.toUpperCase())
            }}
            label='Placa'
            placeholder='Ingrese la placa del vehículo'
          />
          <ButtonLoading
            text={ selectedMode === 'enter' ? 'Registrar Entrada' : 'Registrar Salida' }
            onClick={() => {
              return handleRegister()
            }}
            color='white'
            backgroundColor='yellowgreen'
          />
          <CardAlert
            title='Nota'
            message='No es obligatorio cargar una foto de la placa, eso sirve de test para leer la placa, si la lectura es correcta van a ver en el campo de placa el valor leido.'
            color='orange'
            style={{ marginTop: '10rem', marginBottom: '1rem' }}
          />
          <InputUpload
            onOutput={(value) => {
              setLicensePlate(value)
              console.log('onOutput', value)
            }}
          />
        </Card>

      </Page>
    </div>
  )
}

export default Index



