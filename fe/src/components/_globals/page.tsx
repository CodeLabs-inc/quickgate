import React, { useContext, useState } from 'react'
import styles from './globals.module.css'
import Sidebar from './sidebar'
import { AuthContext } from '../_context/AuthContext'


interface Props {
    children: React.ReactNode
    sidebarHidden?: boolean
}


function Page({ children, sidebarHidden }: Props) {
    

    return (
        <div className={styles.pageComponent}>
            {
                !sidebarHidden &&
                <Sidebar/>
            }
            <div className={styles.containerPage} style={{paddingRight: '15px', paddingBottom: '15px', paddingLeft: '0px'}}>
                <div className={styles.cardPage}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Page