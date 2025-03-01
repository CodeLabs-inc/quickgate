'use client'

import React, { useEffect, useState } from 'react'
import style from './input.module.css'


/**
 * 
 * @param props
 * @label the name of the input field
 * @value the value of the input field
 * @onChange the event triggered when inputing in the element
 * @type text || number
 * @required true || false
 * @rules {type: minLength || maxLength || email || regex, value: number || regex}
 * @returns 
 */


function InputToggle(
    props: {
        label?: string,
        description?: string,
        value: boolean,
        onChange: (e: any) => void,
        style?: React.CSSProperties,
        
    }
) {


    return (
        <div className={style.componentToggle} style={{...props.style}}>
            <div className='flex flex-col w-full'>
                <p className='text-[13px]'>
                    {
                        props.label &&
                        props.label
                    }
                </p>
                <p className='text-[12px] text-[#ffffff70]'>
                    {
                        props.description &&
                        props.description
                    }
                </p>
            </div>

            <div 
                onClick={props.onChange}
                className={style.toggleElement}
                style={{
                    backgroundColor: props.value ? '#00FF0090' : 'tomato'
                }}
            >
                <div 
                    className={style.dot}
                    style={{
                        transform: props.value ? 'translateX(0px)' : 'translateX(33px)'
                    }}
                />
            </div>
        </div>
    )
}

export default InputToggle