import Input from '@/components/inputs/input'
import InputSelect from '@/components/inputs/inputSelect'
import InputToggle from '@/components/inputs/inputToggle'
import { getSettingsGate, updateSettingsAmenitiesBooleans } from '@/services/api'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

function SettingsAmenitiesGate() {

  const [isEV, setIsEV] = React.useState(false)
  const [isHandicap, setIsHandicap] = React.useState(false)

  const handleFetchSettingsData = async () => {
    const call = await getSettingsGate()

    if (call.success) {
      console.log(call.data)
      setIsEV(call.data.booleans.isEV)
      setIsHandicap(call.data.booleans.isHandicapped)
    }
  }

  const handleUpdateBooleans = async (isEV: boolean, isHandicapped: boolean) => {
    const call = await updateSettingsAmenitiesBooleans(isEV, isHandicapped)

    if (call.succes) {
      toast.success('Configuración de gate actualizada correctamente')
    }

  }

  useEffect(() => {
    handleFetchSettingsData()
  } , [])


  return (
    <div>
      <section>
        <div className='flex flex-col gap-2'>

          <InputToggle
            label='Vehiculos Electricos'
            description='El gate tiene soporte para vehiculos electricos?'
            value={isEV}
            onChange={() => {
              setIsEV(!isEV)
              handleUpdateBooleans(!isEV, isHandicap)
            }}

          />
          <InputToggle
            label='Vehiculos con Discapacidad'
            description='El gate tiene soporte para vehiculos con discapacidad?'
            value={isHandicap}
            onChange={() => {
              setIsHandicap(!isHandicap)
              handleUpdateBooleans(isEV, !isHandicap)
            }}

          />


        </div>
      </section>


    </div>
  )
}

export default SettingsAmenitiesGate