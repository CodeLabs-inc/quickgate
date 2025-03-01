import React, { useEffect } from 'react'

import Card from '@/components/cards/Card'
import InputCard from '@/components/inputs/inputCard'
import ButtonLoading from '@/components/buttons/ButtonLoading'
import { updateSettingsGateRates } from '@/services/api'
import toast from 'react-hot-toast'

interface Props {
    daily: number | null
    hourly: number | null
}

function PriceList({ daily, hourly }: Props) {
    const [dailyRate, setDailyRate] = React.useState<number | null>(daily)
    const [dailyChanged, setDailyChanged] = React.useState(false)

    const [hourlyRate, setHourlyRate] = React.useState<number | null>(hourly)
    const [hourlyChanged, setHourlyChanged] = React.useState(false)


    useEffect(() => {
        setDailyRate(daily)
        setHourlyRate(hourly)
    }, [daily, hourly])


    const handleUpdateRates = async () => {
        if (!dailyRate || !hourlyRate) return

        const call = await updateSettingsGateRates(dailyRate, hourlyRate)

        if (call.success){
            setDailyChanged(false)
            setHourlyChanged(false)
            toast.success('Tarifas actualizadas correctamente')
        }

        return true
    }




    return (
        <div>
            <div className='flex flex-row justify-between items-center gap-4'>
                <Card style={{ width: '50%', display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div className='w-full flex flex-col justify-between items-center gap-4'>
                        <InputCard
                            label="Tarifa Horaria (RD$)"
                            placeholder="ex. 50"
                            value={hourlyRate?.toString() ?? '0'}
                            type='number'
                            onChange={(value) => {
                                setHourlyRate(value)
                                setHourlyChanged(true)
                            }}
                        />
                    </div>
                    <ButtonLoading
                        text={'Guardar Cambios'}
                        onClick={() => { 
                            return handleUpdateRates()
                        }}
                        color='primary'
                        deactive={hourlyRate == 0 || !hourlyChanged}
                        backgroundColor='var(--green)'
                    />
                </Card>
                <Card style={{ width: '50%', display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div className='w-full flex flex-col justify-between items-center gap-4'>
                        <InputCard
                            label="Tarifa Diaria (RD$)"
                            placeholder="ex. 500"
                            value={dailyRate?.toString() ?? '0'}
                            type='number'
                            onChange={(value) => { 
                                setDailyRate(value)
                                setDailyChanged(true)
                            }}
                        />
                    </div>
                    <ButtonLoading
                        text={'Guardar Cambios'}
                        onClick={() => { 
                            return handleUpdateRates()
                        }}
                        color='primary'
                        deactive={dailyRate == 0 || !dailyChanged} //!dailyChanged
                        backgroundColor='var(--green)'
                    />
                </Card>
            </div>
        </div>
    )
}

export default PriceList