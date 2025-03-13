import React, { useContext, useState } from 'react'
import styles from './globals.module.css'
import Sidebar from './sidebar'
import { AuthContext } from '../_context/AuthContext'


interface Props {
    children: React.ReactNode
    sidebarHidden?: boolean
    style?: any
}


function PageSecondary({ children, sidebarHidden,  style }: Props) {
    

    return (
        <div className={styles.pageComponent}>
            {
                !sidebarHidden &&
                <Sidebar/>
            }
            <div className={styles.containerPage} style={{paddingRight: '15px', paddingBottom: '15px', paddingLeft: '0px'}}>
                
                    {children}
                
            </div>
        </div>
    )
}

export default PageSecondary