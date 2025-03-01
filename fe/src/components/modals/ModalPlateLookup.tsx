import React, { useEffect } from 'react'
import Title from '../titles/Title'
import CardAlert from '../cards/CardAlert'
import Input from '../inputs/input'
import ButtonLoading from '../buttons/ButtonLoading'
import InputSelect from '../inputs/inputSelect'
import { calculateTicketValue, getCurrentTicketGateInformation, manuallyValidateGateTicket } from '@/services/api'
import Card from '../cards/Card'
import Button from '../buttons/Button'
import toast from 'react-hot-toast'
import LoaderWhite from '../loaders/LoaderWhite'
import { formatThousandsSeparators } from '@/utils/formatNumbers'


interface ModalUserDetailProps {
    plate: string | null
    onClose: () => void
}


function ModalPlateLookup({ plate, onClose }: ModalUserDetailProps) {
    const [parkingDetails, setParkingDetails] = React.useState<any>(null)
    const [toBePaid, setToBePaid] = React.useState(0)

    const handleFetchParkingDetails = async () => {
        if (!plate) return

        const call = await getCurrentTicketGateInformation(plate)

        if (call.success) {
            console.log(call.data)
            setParkingDetails(call.data)


            const call2 = await calculateTicketValue(call.data._id)

            if (call2.success) {
                console.log(call2)
                setToBePaid(call2.data.totalAmount)
            } else {
                toast.error('Error en el calular el valor del ticket')
            }
        }
    }
    const handleValidateExit = async () => {
        if (!plate) return

        const call = await manuallyValidateGateTicket(plate)


        if (call.success) {
            onClose()
            toast.success('Salida validada correctamente')
        } else {
            toast.error('Error al validar salida')
        }

        return true
    }

    useEffect(() => {
        handleFetchParkingDetails()
    }, [])


    if (!parkingDetails) {
        return (
            <div className='w-full h-[400px] flex justify-center items-center'>
                <LoaderWhite />
            </div>
        )
    }



    return (
        <div className='w-full'>
            <Title
                title={`Estacionamiento`}
                subtitle={'Detalles de estacionamiento en curso'}
                actionRight={
                    <div>
                        {
                            parkingDetails &&
                            !parkingDetails.dates.paid &&
                            parkingDetails.dates.entry &&
                            <div style={{
                                padding: '5px 10px',
                                height: '30px',
                                borderRadius: '20px',
                                backgroundColor: 'green',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px'
                            }}>
                                En Curso
                            </div>
                        }
                        {
                            parkingDetails &&
                            parkingDetails.dates.entry &&
                            parkingDetails.dates.paid &&
                            <div style={{
                                padding: '5px 10px',
                                height: '30px',
                                borderRadius: '20px',
                                backgroundColor: 'tomato',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px'
                            }}>
                                Validado
                            </div>
                        }
                    </div>
                }
            />
            {
                toBePaid > 0 &&
                <CardAlert
                    title={`Importante`}
                    message='Si el cliente quiere pagar manualmente, cobrarle el precio aqui abajo. Si es una salida gratis, validar, sin pedir dinero'
                    color='orange'
                    style={{
                        marginBottom: '14px'
                    }}
                />
            }
            <Card
                className='mb-8'
                style={{ width: '100%', padding: '25px 40px', background: '#a0ffa020', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
            >
                <p>
                    Monto a pagar
                </p>
                <p className=''>

                    {formatThousandsSeparators(toBePaid)} RD$
                </p>
            </Card>

            <p style={{ fontSize: '70px', width: '100%', textAlign: 'center' }}>{plate}</p>

            

            <div className='w-[100%] flex flex-col gap-2 mb-4 mt-4'>
                <Card style={{ width: '100%', padding: '20px 20px' }}>
                    <div className='flex flex-row items-center justify-between w-[100%] gap-4'>
                        <p>Entrada</p>
                        <p>
                            {
                                parkingDetails &&
                                    parkingDetails.dates.entry ?
                                    new Date(parkingDetails.dates.entry).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) :
                                    'N/A'
                            }
                        </p>
                    </div>
                </Card>
                {
                    parkingDetails &&
                    parkingDetails.dates.validated &&
                    <Card style={{ width: '100%', padding: '20px 20px' }}>
                        <div className='flex flex-row items-center justify-between w-[100%] gap-4'>
                            <p>Validacion</p>
                            <p>
                                {
                                    parkingDetails &&
                                        parkingDetails.dates.validated ?
                                        new Date(parkingDetails.dates.validated).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) :
                                        'N/A'
                                }
                            </p>
                        </div>
                    </Card>
                }
                {
                    parkingDetails &&
                    parkingDetails.dates.paid &&
                    <Card style={{ width: '100%', padding: '20px 20px' }}>
                        <div className='flex flex-row items-center justify-between w-[100%] gap-4'>
                            <p>Pago</p>
                            <p>
                                {
                                    parkingDetails &&
                                        parkingDetails.dates.paid ?
                                        new Date(parkingDetails.dates.paid).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) :
                                        'N/A'
                                }
                            </p>
                        </div>
                    </Card>
                }
            </div>

            <CardAlert
                title='Atencion'
                message='Validando la salida asi, el pago sera validado, lo que significa, que no se cobrara por el sistema, y que el personal recibio el pago en efectivo, no estan obligados a recibir dinero validando, esto depende de su politca de uso interno. Todos los tikets validados de esta manera, no entraran en la contabilidad.'
                color='red'
                style={{
                    marginBottom: '15px'
                }}
            />

            <ButtonLoading
                text={`${parkingDetails && parkingDetails.dates.validated ? 'Salida validada' : 'Validar salida'}`}
                onClick={() => {
                    return handleValidateExit()
                }}
                deactive={parkingDetails && parkingDetails.dates.validated}
                color='white'
                backgroundColor='yellowgreen'

            />
        </div>
    )
}

export default ModalPlateLookup