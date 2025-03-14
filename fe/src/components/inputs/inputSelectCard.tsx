import React from 'react'
import styles from './input.module.css'
import { ChevronDownIcon } from '@heroicons/react/24/outline'


interface InputSelectProps {
    label?: string
    placeholder: string
    options: {
        value: string
        label: string
        picture?: string
    }[]

    radiusImage?: string


    value: string
    onSelect: (value: string) => void

    style?: React.CSSProperties
}

function InputSelectCard({ options, placeholder, onSelect, style, radiusImage, value, label }: InputSelectProps) {
    //states
    const [selected, setSelected] = React.useState<string | null>(null)
    const [isOpen, setIsOpen] = React.useState(false)

    //handlers
    const toggleDropdown = () => {
        setIsOpen(prev => !prev)
    }
    const handleSelect = (event: any, value: string, label: string) => {
        event.stopPropagation()

        onSelect(value)
        setSelected(label)
        toggleDropdown()
    }

    return (
        <div
            className={styles.selectComponent}
            style={{
                background: 'var(--status-background)',
                padding: '10px',
                marginBottom: '0px',
                borderRadius: '7px',
            }}
        >
            {
                label &&
                <p style={{ color: "white", fontSize: '13px', marginBottom: '5px' }}>{label}</p>
            }
            <div style={{ ...style }} onClick={toggleDropdown} className={styles.containerSelect}>
                {
                    value !== "" ?
                        <div>
                            {
                                selected ? selected :
                                    options.find(option => option.value === value)?.label
                            }
                        </div>
                        :
                        <div style={{ color: '#ffffff80' }}>{placeholder}</div>
                }
                <ChevronDownIcon style={{ width: '20px' }} />
                {
                    isOpen &&
                    <div
                        style={{
                            background: 'var(--steam-color)',
                        }}
                        className={styles.dropdown}
                        onMouseLeave={toggleDropdown}
                    >
                        {options.map((option, index) => (
                            <div key={index} onClick={(e) => handleSelect(e, option.value, option.label)} className={styles.option} style={{ userSelect: 'none'}}>
                                {
                                    option.picture &&
                                    <img src={option.picture} alt="flag" style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: radiusImage ? radiusImage : '0px', objectFit: 'cover' }} />
                                }
                                {option.label}
                            </div>
                        ))}
                    </div>
                }

            </div>
        </div>
    )
}

export default InputSelectCard