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
import { createManualProfile } from '@/services/api'

interface ModalNewUserProps {
    isOpen: boolean,
    onClose: () => void,

}

function ModalNewUser({ isOpen, onClose }: ModalNewUserProps) {

    const [formData, setFormData] = React.useState({
        email: '',
        name: '',
        surname: '',
        role: ''
    })

    const handleCreateUser = async () => {

        if (!formData.email || !formData.name || !formData.surname || !formData.role) {
            ToastCustom('error', 'Completar todos los campos')
            return true
        }

        const call = await createManualProfile(formData.name, formData.surname, formData.email, formData.role)

        if (call.success){
            ToastCustom('success', 'Usuario creado correctamente')
            onClose()
            setTimeout(() => {
                window.location.reload()
            }, 1000)

            return true
        }

        ToastCustom('error', 'Un error occurió al crear el usuario')

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
                        title={'Información del usuario'}
                        subtitle={'Completar los campos para crear un nuevo usuario'}
                        />
                    <CardAlert
                        title={'Creación de usuario'}
                        message={'Completar los campos para crear un nuevo usuario. El usuario recibirá un correo con las instrucciones para acceder a la plataforma.'}
                        learnMoreLink='/'
                        color='yellowgreen'
                    />

                    <div className='w-[100%] flex flex-col gap-2 mb-4 mt-4'>
                        <Input
                            label={'Correo electrónico'}
                            placeholder='foo@codelabs.com'
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e
                                })
                            }}
                        />
                        <Input
                            label={'Nombre'}
                            placeholder='John'
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    name: e
                                })
                            }}
                        />
                        <Input
                            label={'Appellido'}
                            placeholder='Doe'
                            value={formData.surname}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    surname: e
                                })
                            }}
                        />
                    </div>


                    <Title
                        title={'Permisos del usuario'}
                        subtitle={'Seleccionar el rol del usuario'}
                    />
                    <CardAlert
                        title={'Atención'}
                        message={'El rol del usuario determinará los permisos y accesos que tendrá en la plataforma.'}
                        learnMoreLink='/'
                        color='tomato'
                    />
                    <div className='w-[100%] flex flex-col gap-2 mb-10 mt-4'>
                        <InputSelect
                            label={'Rol'}
                            placeholder={'Seleccionar rol'}
                            options={[
                                { value: 'admin', label: 'Administrador' },
                                { value: 'operator', label: 'Gater' },
                                { value: 'user', label: 'Usuario' },
                            ]}
                            value={formData.role}
                            onSelect={(value) => {
                                setFormData({
                                    ...formData,
                                    role: value
                              })
                            }}
                            style={{
                                
                                paddingLeft:'10px'
                            }}
                        />
                        <ButtonLoading
                            text={'Crear'}
                            onClick={()=>{
                                return handleCreateUser()
                            }}
                            color='white'
                            backgroundColor='var(--accent)'
                        />
                    </div>
                </Modal>
            }
        </div>
    )
}

export default ModalNewUser