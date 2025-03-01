import Input from '@/components/inputs/input'
import InputCard from '@/components/inputs/inputCard'
import InputSelect from '@/components/inputs/inputSelect'
import InputSelectCard from '@/components/inputs/inputSelectCard'
import InputToggle from '@/components/inputs/inputToggle'
import Title from '@/components/titles/Title'
import React from 'react'
import SubscriptionList from './SubscriptionList'
import ModalNewSubscriptions from '@/components/modals/ModalNewSubscription'
import PriceList from './PriceList'
import { getSettingsGate, updateSettingsGateBilling } from '@/services/api'
import toast from 'react-hot-toast'

function SettingsSubscriptions() {

    const [bankAccount, setBankAccount] = React.useState('')
    const [currency, setCurrency] = React.useState('')
    const [hourlyRate, setHourlyRate] = React.useState<number | null>(null)
    const [dailyRate, setDailyRate] = React.useState<number | null>(null)

    const [modalCreateSubscription, setModalCreateSubscription] = React.useState(false)

    const handleToggleModalCreateSubscription = () => {
        setModalCreateSubscription(!modalCreateSubscription)
    }
    const handleFetchSettingsData = async () => {
        const call = await getSettingsGate()

        if (call.success){
            console.log(call.data)
            setBankAccount(call.data.settings.payment_address)
            setCurrency(call.data.settings.currency)
            setHourlyRate(call.data.rates.hourly)
            setDailyRate(call.data.rates.daily)
        }
    }
    const handleUpdateBilling = async (bankAccount: string, currency: string) => {
        const call = await updateSettingsGateBilling(bankAccount, currency)

        if (call.success) {
            //toast.success('Configuraciones de facturación actualizadas')
        }   
    }

    React.useEffect(() => {
        handleFetchSettingsData()
    }, [])


    return (
        <div>
            <section>
                <div className='flex flex-col gap-2'>
                    <InputCard
                        label="Cuenta Bancaria"
                        placeholder="Numero de Cuenta o IBAN"
                        value={bankAccount}
                        onChange={(value) => {
                            setBankAccount(value)
                            handleUpdateBilling(value, currency)
                        }}
                    />
                    <InputSelectCard
                        label="Divisa de Pago"
                        placeholder="Ex. USD"
                        value={currency}
                        onSelect={(value) => {
                            setCurrency(value)
                            handleUpdateBilling(bankAccount, value)
                        }}
                        options={[
                            { label: 'DOP', value: 'DOP' },
                            { label: 'USD', value: 'USD' },
                        ]}
                        style={{
                            padding: '10px',
                            background: 'var(--steam-color)',
                        }}
                    />
                </div>
            </section>

            <br />
            <br />
            <br />

            <section>
                <Title
                    title="Configuraciones de Precios"
                    subtitle="Configuraciones de los precios de estacionamiento"
                />
                <PriceList
                    daily={dailyRate}
                    hourly={hourlyRate}
                />
                
            </section>

            <br />
            <br />
            <br />

            <section>
                <Title
                    title="Configuraciones Acceso Libre"
                    subtitle="Vehiculos con acceso libre al gate"
                    actionRight={
                        <div
                            style={{
                                border: '1px solid #ffffff80',
                                borderRadius: '20px',
                                padding: '7px 20px',
                                cursor: 'pointer',
                                fontSize: 'var(--text-sm)',
                            }}
                            onClick={() => handleToggleModalCreateSubscription()}
                        >
                            Enregistrar Vehiculo
                            <ModalNewSubscriptions
                                gateId=''
                                isOpen={modalCreateSubscription}
                                onClose={handleToggleModalCreateSubscription}
                            />
                        </div>
                    }
                />
                <SubscriptionList />
            </section>
        </div>
    )
}

export default SettingsSubscriptions