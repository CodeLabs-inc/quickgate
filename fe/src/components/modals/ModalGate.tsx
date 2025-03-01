import React, { useEffect } from 'react'
import Modal from '../_globals/modal'
import Title from '../titles/Title'
import toast from 'react-hot-toast'
import CardAlert from '../cards/CardAlert'
import ButtonLoading from '../buttons/ButtonLoading'
import { MapPin } from 'lucide-react'
import { addOperatorToGate, DeleteOperatorFromGate, getAllProfiles, getGate } from '@/services/api'

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import InputSelect from '../inputs/inputSelect'

interface ModalLeadProps {
    isOpen: boolean
    onClose: () => void
    leadId: string
}

function ModalGate({ isOpen, onClose, leadId }: ModalLeadProps) {
    const [lead, setLead] = React.useState<any>(null)
    const [operators, setOperators] = React.useState<any>([])


    const [loading, setLoading] = React.useState(true)

    const handleFetchLead = async () => {
        setLoading(true)
        const call = await getGate(leadId)

        if (call.success) {
            console.log(call.data)
            setLead(call.data)
            //setEmail(call.data.email)
        } else {
            toast.error(call.message)
        }

        setTimeout(() => {
            setLoading(false)
        }, 200)
    }
    const handleFetchOperators = async () => {
        const call = await getAllProfiles(1, 1000, '', 'operator')

        if (call.success) {
            console.log(call.data)
            //Filter out operatore that have a gateId
            setOperators(call.data)
        } else {
            toast.error(call.message)
        }
    }
    const handleAddOperator = async (operatorId: string) => {
       const call = await addOperatorToGate(operatorId, leadId)

        if (call.success) {
            toast.success('Operador agregado correctamente')
            console.log(call.data)
           
            setLead(
                {
                    ...lead,
                    operators: [...lead.operators, { user: call.data.user, _id: call.data._id, email: call.data.email }]
                }
            )
            handleFetchOperators()
            return true
        } else {
            toast.error(call.message)
            return false
        }
    }
    const handleDeleteOperator = async (operatorId: string) => {
        const call = await DeleteOperatorFromGate(operatorId, leadId)

        if (call.success) {
            toast.success('Operador eliminado correctamente')
            setLead(
                {
                    ...lead,
                    operators: lead.operators.filter((operator: any) => operator._id !== operatorId)
                }
            )
            handleFetchOperators()
            return true
        } else {
            toast.error(call.message)
            return false
        }
    }



    useEffect(() => {
        if (leadId) {
            handleFetchLead()
        }
    }, [leadId])

    useEffect(() => {
        handleFetchOperators()
    }, [])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <Title
                title={'Detalles del Gate'}
                subtitle={'Usuarios y analíticas'}
                actionRight={
                    <div
                        style={{
                            backgroundColor: lead && lead.status === 'Pending' ? 'gray' : lead && lead.booleans.isActive ? 'yellowgreen' : '#F44336',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '14px'
                        }}
                    >
                        {
                            lead &&
                                lead.booleans.isActive ? 'Activo' : 'Inactivo'
                        }
                    </div>
                }
            />
            <div className='w-full flex items-start justify-center flex-col gap-1' style={{ fontSize: '14px' }}>
                <div className='w-full flex justify-between'><span>Name</span><span>{lead && lead.name}</span></div>
                <a
                    className='w-full flex justify-between'
                    href={`https://www.google.com/maps/search/?q=${lead && lead.address.city},${lead && lead.name}`}
                    target='_blank'
                >
                    <span>Direccion </span><span className='flex flex-row gap-2' style={{ color: '#007BFF' }}>{lead && lead.address.city}, {lead && lead.address.street}  <MapPin width={18} /></span>
                </a>


            </div>



            <div className='flex flex-col w-full gap-1'>

                <CardAlert
                    title='Attencion'
                    message='Los cambios realizados en esta sección son permanentes y no se pueden deshacer.'
                    color='yellowgreen'
                    style={{ marginTop: '20px', marginBottom: '40px' }}
                />

                <Title
                    title={'Analiticas'}
                    subtitle={'Datos en tiempo real'}
                />
                {
                    lead &&
                    <div className='flex flex-row items-center justify-between w-full gap-4'>

                        <div className='w-[150px] w-full items-center flex flex-col gap-2'>
                            <p className='mb-4'>Ocupacion Corriente</p>
                            <CircularProgressbar
                                styles={{
                                    trail: { stroke: 'var(--background)' },
                                    path: { stroke: 'yellowgreen' },
                                    text: { fill: 'white' },

                                }}
                                value={lead && lead.vehiclesList}
                                maxValue={lead && lead.settings.capacity}
                                text={`${lead ? `${((lead.vehiclesList / lead.settings.capacity) * 100)}` : '...'}%`}
                            />
                        </div>
                        <div className='w-[150px] w-full items-center flex flex-col gap-2'>
                            <p className='mb-4'>Pasajes Hoy</p>
                            <CircularProgressbar
                                styles={{
                                    trail: { stroke: 'var(--background)' },
                                    path: { stroke: 'yellowgreen' },
                                    text: { fill: 'white' },

                                }}
                                value={lead && lead.vehiclesList}
                                maxValue={lead && lead.settings.capacity}
                                text={`0`}
                            />
                        </div>
                        <div className='w-[150px] w-full items-center flex flex-col gap-2'>
                            <p className='mb-4'> --- ? </p>
                            <CircularProgressbar
                                styles={{
                                    trail: { stroke: 'var(--background)' },
                                    path: { stroke: 'yellowgreen' },
                                    text: { fill: 'white' },

                                }}
                                value={lead && lead.vehiclesList}
                                maxValue={lead && lead.settings.capacity}
                                text={`--- `}
                            />
                        </div>

                    </div>
                }


            </div>

            <div className='flex flex-col w-full gap-1 mt-10'>

               

                <Title
                    title={'Acceso panel de Control'}
                    subtitle={'Accesos y usuarios a este gate'}
                />
                <div className='flex flex-col w-full'>

                    <InputSelect
                        label='Usuarios'
                        options={
                            operators.map((operator: any) => {
                                return {
                                    label: operator.email,
                                    value: operator._id
                                }
                            })
                        }
                        value={operators[0]?._id}
                        onSelect={(value) => handleAddOperator(value)}
                        placeholder='Seleccionar'
                        style={{
                            padding: '10px',
                        }}
                    />
                    {
                        lead && 
                        lead.operators.length > 0 
                        ?
                        lead.operators.map((operator: any, index: number) => (
                            <div
                                key={operator._id}
                                className='flex flex-row justify-between items-center w-full gap-4 p-4'
                                style={{
                                    backgroundColor: index % 2 === 0 ? 'var(--background)' : 'var(--background-2)',
                                    borderRadius: '10px'
                                }}
                            >
                                <p className='text-[14px]'>{operator.user.name} {operator.user.surname} - {operator.email}</p>
                                <div className='w-[100px]'>
                                    <ButtonLoading
                                        text={'Eliminar'}
                                        onClick={() => handleDeleteOperator(operator._id)}
                                        color='white'
                                        backgroundColor='tomato'
                                    />
                                </div>
                            </div>
                        ))
                        :
                        <CardAlert
                            title='Sin operadores'
                            message='No hay operadores asignados a este gate, por favor asigna uno, con el menu desplegable arriba.'
                            color='tomato'
                            style={{ marginTop: '0px', marginBottom: '10px' }}
                        />
                    }



                </div>


            </div>

        </Modal>
    )
}

export default ModalGate