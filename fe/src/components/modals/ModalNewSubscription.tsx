import React from 'react'
import styles from './modal.module.css'
import Modal from '../_globals/modal'
import Title from '../titles/Title'
import CardAlert from '../cards/CardAlert'
import InputCode from '../inputs/inputCode'
import Input from '../inputs/input'
import ButtonLoading from '../buttons/ButtonLoading'
import InputSelect from '../inputs/inputSelect'
import ToastCustom from '../toast/Toast'
import { createGateSubscription, createManualProfile } from '@/services/api'

interface ModalNewUserProps {
    isOpen: boolean,
    onClose: () => void,
    gateId: string
}   

function ModalNewSubscriptions({ isOpen, onClose, gateId }: ModalNewUserProps) {

    const [formData, setFormData] = React.useState({
        duration: 0,
        licensePlate: '',
    })

    const handleCreateUser = async () => {

        if (formData.duration === 0  || formData.licensePlate === "" ) {
            ToastCustom('error', 'Completar todos los campos')
            return true
        }

        const call = await createGateSubscription(formData.licensePlate, formData.duration)
        console.log(call)
        if (call.success) {
            ToastCustom('success', 'Vehiculo añdido correctamente')
            onClose()
            setTimeout(() => {
                window.location.reload()
            }, 1000)

            return true
        }

        ToastCustom('error', 'Un error occurió al añadir el vehiculo')

    }



    return (
        <div>
            {
                isOpen &&
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    width={'50%'}
                >
                    <Title
                        title={'Añadir Vehiculo con Acceso Libre'}
                        subtitle={'El vehiculo tendra acceso al gate sin costo hasta la fecha de expiracion'}
                    />
                    <CardAlert
                        title={'Atención'}
                        message={'Las placas que se registren en esta sección tendrán acceso sin costo al gate hasta la fecha de expiración de la subscripción. Eso le permite de cobrar de manera indipendente sus membrecias de acceso, o la entrad/salida de residentes enregistrados en el caso de residenciales.'}
                        learnMoreLink='/'
                        color='yellowgreen'
                    />

                    <div className='w-[100%] flex flex-col gap-2 mb-4 mt-4'>
                        <Input
                            label={'Placa del Vehiculo'}
                            placeholder='A000111'
                            value={formData.licensePlate}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    licensePlate: e
                                })
                            }}
                        />
                        <Input
                            label={'Duracion acceso libre (en dias)'}
                            placeholder='Numero de dias'
                            value={formData.duration.toString()}
                            type='number'
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    duration: Number(e)
                                })
                            }}
                        />
                    </div>

                    <ButtonLoading
                        text={'Añadir Vehiculo'}
                        onClick={() => {
                            return handleCreateUser()
                        }}
                        color='white'
                        backgroundColor='var(--accent)'
                    />
                </Modal>
            }
        </div>
    )
}

export default ModalNewSubscriptions