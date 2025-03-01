import React from 'react'
import Button from '../buttons/Button'

import styles from './noresults.module.css'
import { useRouter } from 'next/navigation'

function NoTicket() {
    const router = useRouter()
    const [isMouseOver, setIsMouseOver] = React.useState(false)

    const handleMouseOver = () => {
        console.log('Mouse over')   
        setIsMouseOver(!isMouseOver)
    }


  return (
    <div className='w-[90%] flex justify-center items-center flex-col'>
        <img src="/icons/magnifing_glass.png" width={300} height={300} alt="" />
        <h1 style={{color: '#ffffff60'}} className='text-4xl font-bold'>No se encontraron Tickets</h1>
        <p style={{color: '#ffffff60'}}>Buscar con otros parametros</p>
    </div>
  )
}

export default NoTicket