import Input from '@/components/inputs/input'
import InputCard from '@/components/inputs/inputCard'
const InputMapNoSSR = dynamic(() => import('@/components/inputs/inputCardMap'), { ssr: false });
import InputSelectCard from '@/components/inputs/inputSelectCard'
import InputToggle from '@/components/inputs/inputToggle'
import Title from '@/components/titles/Title'
import { getSettingsGate, updateSettingsGateBooleans, updateSettingsGateInformations, updateSettingsGateMap } from '@/services/api'
import dynamic from 'next/dynamic';
import React from 'react'
import toast from 'react-hot-toast'

function SettingsGate() {
    const [isGateOpen, setIsGateOpen] = React.useState(false)
    const [isPrivate, setIsPrivate] = React.useState(false)

    const [name, setName] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [city, setCity] = React.useState('')
    const [capacity, setCapacity] = React.useState(0)
    const [position, setPosition] = React.useState<any>({ lat: null, lng: null })

    const [openDays, setOpenDays] = React.useState<any>([])
    const [openTime, setOpenTime] = React.useState('')
    const [closeTime, setCloseTime] = React.useState('')



    const handleFetchGateSettings = async () => {
        const call = await getSettingsGate()

        if (call.success) {
            console.log(call.data)
            setName(call.data.name)
            setAddress(call.data.address.street)
            setCity(call.data.address.city)
            setCapacity(call.data.settings.capacity)
            setPosition({
                lat: call.data.address.cords.latitude,
                lng: call.data.address.cords.longitude
            })
            setIsGateOpen(call.data.booleans.isActive)
            setIsPrivate(call.data.booleans.isPrivate)

            setOpenTime(call.data.openingSchedule.hours.open)
            setCloseTime(call.data.openingSchedule.hours.close)
            setOpenDays(call.data.openingSchedule.days)
        }
    }
    const handleUpdateMapPosition = async (lat: string, lng: string) => {
        const call = await updateSettingsGateMap(lat, lng)

        if (call.success) {
            toast.success('Ubicación en el mapa actualizada correctamente')
        }
    }
    const handleUpdateBooleans = async (isGateOpen: boolean, isPrivate: boolean) => {
        const call = await updateSettingsGateBooleans(isGateOpen, isPrivate)

        if (call.succes) {
            toast.success('Configuración de gate actualizada correctamente')
        }

    }
    const handleUpdateInformations = async (name: string, city: string, street: string, capacity: number, daysOpen: any, openTime: string, closeTime: string) => {
        const call = await updateSettingsGateInformations(name, city, street, capacity, daysOpen, openTime, closeTime)

        if (call.success) {
            //toast.success('Información del gate actualizada correctamente')
        }

    }





    const handleCheckboxChange = (event: any) => {
        const { id, checked } = event.target;

        setOpenDays((prevDays: any) => {
            if (checked) {
                // Add the selected day to the array
                return [...prevDays, Number(id)];
            } else {
                // Remove the deselected day from the array
                return prevDays.filter((day: any) => day != id);
            }


        });
    };

    React.useEffect(() => {
        handleFetchGateSettings()
    }, [])


    return (
        <div>
            <section>
                <div className='flex flex-col gap-2'>
                    <InputToggle
                        label='Estado del Gate'
                        description='El gate esta abierto, los vehiculos pueden entrar y salir?'
                        value={isGateOpen}
                        onChange={() => {
                            setIsGateOpen(!isGateOpen)
                            handleUpdateBooleans(!isGateOpen, isPrivate)
                        }}
                        style={{
                            marginBottom: '10px',
                        }}
                    />
                    <InputToggle
                        label='Gate Privado'
                        description='El gate es privado, solo pueden entrar los usuarios autorizados (ex. Residencial) ?'
                        value={isPrivate}
                        onChange={() => {
                            setIsPrivate(!isPrivate)
                            handleUpdateBooleans(isGateOpen, !isPrivate)
                        }}
                        style={{
                            marginBottom: '20px',
                        }}

                    />

                    <br />
                    <Title
                        title='Detalles del Gate'
                        subtitle='Información general del gate'
                    />
                    <InputCard
                        label="Nombre del Gate"
                        placeholder="Ex. Mall X / Parqueo Y"
                        value={name}
                        onChange={(value) => {
                            setName(value)
                            handleUpdateInformations(value, city, address, capacity, openDays, openTime, closeTime)
                        }}
                    />
                    <InputCard
                        label="Dirección del Gate"
                        placeholder="Ex. Calle 1, #123"
                        value={address}
                        onChange={(value) => {
                            setAddress(value)
                            handleUpdateInformations(name, city, value, capacity, openDays, openTime, closeTime)
                        }}
                    />
                    <InputSelectCard
                        label="Ciudad del Gate"
                        placeholder="Seleccionar ciudad"
                        value={
                            [
                                { label: 'Santo Domingo', value: 'SD' },
                                { label: 'Santiago', value: 'STI' },
                                { label: 'La Romana', value: 'LR' },
                                { label: 'Punta Cana', value: 'PC' },
                            ].find((c) => c.value === city)?.value || ''
                        }
                        onSelect={(value) => {
                            setCity(value)
                            handleUpdateInformations(name, value, address, capacity, openDays, openTime, closeTime)
                        }}
                        options={[
                            { label: 'Santo Domingo', value: 'SD' },
                            { label: 'Santiago', value: 'STI' },
                            { label: 'La Romana', value: 'LR' },
                            { label: 'Punta Cana', value: 'PC' },
                        ]}
                        style={{
                            padding: '10px',
                            background: 'var(--steam-color)',
                        }}
                    />
                    <InputCard
                        label="Capacidad Máxima"
                        placeholder="Ex. 100"
                        value={capacity.toString()}
                        onChange={(e) => {
                            setCapacity(parseInt(e))
                            handleUpdateInformations(name, city, address, e, openDays, openTime, closeTime)
                        }}
                        type='number'
                    />
                    <InputMapNoSSR
                        label='Ubicación en el mapa'
                        position={position}
                        onChange={(lat: string, lng: string) => {
                            handleUpdateMapPosition(lat, lng)
                            setPosition({ lat: lat, lng: lng })
                        }}
                    />

                    <br />

                    <Title
                        title='Horarios del Gate'
                        subtitle='Horarios de apertura y cierre del gate'
                    />
                    <div className="flex flex-row gap-6 mb-6 items-center justify-center">
                        <div className="flex flex-row gap-1">
                            <input
                                type="checkbox"
                                id="1"
                                onClick={(event: any) => {

                                    const { id, checked } = event.target


                                    let newOpenDays;
                                    if (checked) {
                                        // Add the selected day to the array
                                        newOpenDays = [...openDays, Number(id)];
                                    } else {
                                        // Remove the deselected day from the array
                                        newOpenDays = openDays.filter((day: any) => day != id);
                                    }
                                    handleCheckboxChange(event)
                                    handleUpdateInformations(name, city, address, capacity, newOpenDays, openTime, closeTime)
                                }}
                                checked={openDays.includes(1)}
                            />
                            <label htmlFor="mon">Lunes</label>
                        </div>
                        <div className="flex flex-row gap-1">
                            <input
                                type="checkbox"
                                id="2"
                                onClick={(event: any) => {

                                    const { id, checked } = event.target


                                    let newOpenDays;
                                    if (checked) {
                                        // Add the selected day to the array
                                        newOpenDays = [...openDays, Number(id)];
                                    } else {
                                        // Remove the deselected day from the array
                                        newOpenDays = openDays.filter((day: any) => day != id);
                                    }
                                    handleCheckboxChange(event)
                                    handleUpdateInformations(name, city, address, capacity, newOpenDays, openTime, closeTime)
                                }}
                                checked={openDays.includes(2)}
                            />
                            <label htmlFor="tue">Martes</label>
                        </div>
                        <div className="flex flex-row gap-1">
                            <input
                                type="checkbox"
                                id="3"
                                onClick={(event: any) => {

                                    const { id, checked } = event.target


                                    let newOpenDays;
                                    if (checked) {
                                        // Add the selected day to the array
                                        newOpenDays = [...openDays, Number(id)];
                                    } else {
                                        // Remove the deselected day from the array
                                        newOpenDays = openDays.filter((day: any) => day != id);
                                    }
                                    handleCheckboxChange(event)
                                    handleUpdateInformations(name, city, address, capacity, newOpenDays, openTime, closeTime)
                                }}
                                checked={openDays.includes(3)}
                            />
                            <label htmlFor="wed">Miércoles</label>
                        </div>
                        <div className="flex flex-row gap-1">
                            <input
                                type="checkbox"
                                id="4"
                                onClick={(event: any) => {

                                    const { id, checked } = event.target


                                    let newOpenDays;
                                    if (checked) {
                                        // Add the selected day to the array
                                        newOpenDays = [...openDays, Number(id)];
                                    } else {
                                        // Remove the deselected day from the array
                                        newOpenDays = openDays.filter((day: any) => day != id);
                                    }
                                    handleCheckboxChange(event)
                                    handleUpdateInformations(name, city, address, capacity, newOpenDays, openTime, closeTime)
                                }}
                                checked={openDays.includes(4)}
                            />
                            <label htmlFor="thu">Jueves</label>
                        </div>
                        <div className="flex flex-row gap-1">
                            <input
                                type="checkbox"
                                id="5"
                                onClick={(event: any) => {

                                    const { id, checked } = event.target


                                    let newOpenDays;
                                    if (checked) {
                                        // Add the selected day to the array
                                        newOpenDays = [...openDays, Number(id)];
                                    } else {
                                        // Remove the deselected day from the array
                                        newOpenDays = openDays.filter((day: any) => day != id);
                                    }
                                    handleCheckboxChange(event)
                                    handleUpdateInformations(name, city, address, capacity, newOpenDays, openTime, closeTime)
                                }}
                                checked={openDays.includes(5)}
                            />
                            <label htmlFor="fri">Viernes</label>
                        </div>
                        <div className="flex flex-row gap-1">
                            <input
                                type="checkbox"
                                id="6"
                                onClick={(event: any) => {

                                    const { id, checked } = event.target


                                    let newOpenDays;
                                    if (checked) {
                                        // Add the selected day to the array
                                        newOpenDays = [...openDays, Number(id)];
                                    } else {
                                        // Remove the deselected day from the array
                                        newOpenDays = openDays.filter((day: any) => day != id);
                                    }
                                    handleCheckboxChange(event)
                                    handleUpdateInformations(name, city, address, capacity, newOpenDays, openTime, closeTime)
                                }}
                                checked={openDays.includes(6)}
                            />
                            <label htmlFor="sat">Sábado</label>
                        </div>
                        <div className="flex flex-row gap-1">
                            <input
                                type="checkbox"
                                id="0"
                                onClick={(event: any) => {

                                    const { id, checked } = event.target


                                    let newOpenDays;
                                    if (checked) {
                                        // Add the selected day to the array
                                        newOpenDays = [...openDays, Number(id)];
                                    } else {
                                        // Remove the deselected day from the array
                                        newOpenDays = openDays.filter((day: any) => day != id);
                                    }
                                    handleCheckboxChange(event)
                                    handleUpdateInformations(name, city, address, capacity, newOpenDays, openTime, closeTime)
                                }}
                                checked={openDays.includes(0)}
                            />
                            <label htmlFor="sun">Domingo</label>
                        </div>
                    </div>

                    <div className='flex flex-row gap-2'>
                        <InputCard
                            value={openTime}
                            onChange={(value) => {
                                setOpenTime(value)
                                const regex = /^[0-9]{2}:[0-9]{2}$/
                                if (regex.test(value)) {
                                    handleUpdateInformations(name, city, address, capacity, openDays, value, closeTime)
                                }
                            }}
                            label='Horario de apertura'
                            placeholder='08:00'
                            rules={[
                                { type: 'regex', value: /^[0-9]{2}:[0-9]{2}$/, message: 'Formato horario incorrecto, por favor respetar el formato hh:mm' }
                            ]}

                        />
                        <InputCard
                            value={closeTime}
                            onChange={(value) => {
                                setCloseTime(value)
                                const regex = /^[0-9]{2}:[0-9]{2}$/
                                if (regex.test(value)) {
                                    handleUpdateInformations(name, city, address, capacity, openDays, openTime, value)
                                }
                            }}
                            label='Horario de cierre'
                            placeholder='18:00'
                            rules={[
                                { type: 'regex', value: /^[0-9]{2}:[0-9]{2}$/, message: 'Formato horario incorrecto, por favor respetar el formato hh:mm' }
                            ]}

                        />
                    </div>
                </div>
            </section>


        </div>
    )
}

export default SettingsGate