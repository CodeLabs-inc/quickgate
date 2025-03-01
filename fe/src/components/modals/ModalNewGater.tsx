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
import { createGater, createManualProfile } from '@/services/api'

interface ModalNewUserProps {
    isOpen: boolean,
    onClose: () => void,

}

function ModalNewGater({ isOpen, onClose }: ModalNewUserProps) {

    const [formData, setFormData] = React.useState({
        name: '',
        city: '',
        street: '',
    })

    const handleCreateGater = async () => {
        if (!formData.name || !formData.city || !formData.street) {
            return ToastCustom('error', 'Todos los campos son requeridos')
        }

        const call = await createGater(
            formData.name,
            formData.city,
            formData.street
        )
        
        if (call.success) {
            ToastCustom('success', 'Usuario creado exitosamente')
            onClose()
        } else {
            ToastCustom('error', call.message)
        }
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
                        title={'Creación de Gate'}
                        subtitle={'Completar los campos para crear un nuevo Gate'}
                    />
                    <CardAlert
                        title={'Atención'}
                        message={'El gate sera creado sin usuario, tendras que añadirlo en seguida a la creacion. Esos usuarios tendran control sobre su proprio gate, y acceso a las analiticas'}
                        learnMoreLink='/'
                        color='var(--green)'
                    />

                    <div className='w-[100%] flex flex-col gap-2 mb-4 mt-4'>
                        <Input
                            label={'Nombre Gate'}
                            placeholder='Ex. Parqueo Mall X / Gate Hotel Y'
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    name: e
                                })
                            }}
                        />
                        <Input
                            label={'Ciudad'}
                            placeholder='Ex. Santo Domingo'
                            value={formData.city}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    city: e
                                })
                            }}
                        />
                        <Input
                            label={'Dirección'}
                            placeholder='Ex. Calle 1 #1'
                            value={formData.street}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    street: e
                                })
                            }}
                        />
                    </div>




                    <ButtonLoading
                        text={'Crear'}
                        onClick={() => {
                            return handleCreateGater()
                        }}
                        color='white'
                        backgroundColor='var(--green)'
                    />
 
                </Modal>
            }
        </div>
    )
}

export default ModalNewGater