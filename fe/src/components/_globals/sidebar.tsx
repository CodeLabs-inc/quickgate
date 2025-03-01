import React, { useContext, useEffect } from 'react'
import styles from './globals.module.css'
import Link from 'next/link'
import { ArrowDownUp, Blocks, CarFront, CircleHelp, Fence, FolderKanban, Home, ListTodo, LogOut, PanelsTopLeft, Server, Settings, Settings2, Tags, Ticket, Tickets, Users, Users2, Users2Icon } from 'lucide-react'

import { logout } from '@/services/api'
import { on } from 'events'
import { AuthContext } from '../_context/AuthContext'
import { usePathname } from 'next/navigation'
import Image from 'next/image'


function Sidebar() {
  const { isSidepanelOpen, role } = useContext(AuthContext)
  const path = usePathname()

  //Handlers
  const handleLogout = () => {
    logout()
  }

  useEffect(() => { }, [role])

  return (
    <div
      className={styles.sidebar}
      style={{
        width: isSidepanelOpen ? '250px' : '50px'
      }}
    >

      {
        role === 'admin' &&
        <div
          className={styles.containerLinks}
        >
          {/* Top Elements */}
          <div>
            <ElementSidebar
              currentPath={path}
              icon={<PanelsTopLeft width={18} />}
              text="dashboard"
              isOpen={isSidepanelOpen}
              href="/dashboard"
              textStyle={{
                fontWeight: 500,
                textTransform: 'uppercase'
              }}
            />
            <br />
            <ElementSidebar
              currentPath={path}
              icon={<Fence width={18} />}
              text="Gates"
              isOpen={isSidepanelOpen}
              href="/dashboard/gates"
            />
            <ElementSidebar
              currentPath={path}
              icon={<ArrowDownUp width={18} />}
              text="Tránsitos"
              isOpen={isSidepanelOpen}
              href="/dashboard/transits"
            />
            <ElementSidebar
              currentPath={path}
              icon={<CarFront width={18} />}
              text="Vehiculos"
              isOpen={isSidepanelOpen}
              href="/dashboard/vehicles"
            />
            <ElementSidebar
              currentPath={path}
              icon={<Users width={18} />}
              text="Usuarios"
              isOpen={isSidepanelOpen}
              href="/dashboard/users"
            />

          </div>


          {/* Bottom Elements */}
          <div className='flex flex-col items-center'>
            <ElementSidebar
              currentPath={path}
              icon={
                <Settings2 width={20} />
              }
              text="Settings"
              isOpen={isSidepanelOpen}
              href="/dashboard/settings"
            />
            <ElementSidebar
              currentPath={path}
              icon={
                <CircleHelp width={18} />
              }
              text="F.A.Q"
              isOpen={isSidepanelOpen}
              href="/dashboard/faq"
            />
            <ElementSidebar
              currentPath={path}
              icon={<LogOut width={18} />}
              text="Logout"
              isOpen={isSidepanelOpen}
              onClick={handleLogout}
            />

          </div>

        </div>
      }

      {
        role === 'operator' &&
        <div
          className={styles.containerLinks}
        >
          {/* Top Elements */}
          <div>
            <ElementSidebar
              currentPath={path}
              icon={<PanelsTopLeft width={18} />}
              text="dashboard"
              isOpen={isSidepanelOpen}
              href="/dashboard"
              textStyle={{
                fontWeight: 500,
                textTransform: 'uppercase'
              }}
            />
            <br />
            <ElementSidebar
              currentPath={path}
              icon={<Ticket width={18} />}
              text="Tickets"
              isOpen={isSidepanelOpen}
              href="/dashboard/transits"
            />
            <ElementSidebar
              currentPath={path}
              icon={<CarFront width={18} />}
              text="Vehiculos"
              isOpen={isSidepanelOpen}
              href="/dashboard/vehicles"
            />
            <br />
            <ElementSidebar
              currentPath={path}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 3873 4841.25"
                  width={30}
                  height={80}
                  fill="#FFFFFF"
                  style={
                    {
                      transform: 'rotateY(180deg) translateY(3px) translateX(12px)',
                    }
                  }
                >
                  <g>
                    <g>
                      <path
                        d="M1284,2885.2c-33.4,0-60.5-27.1-60.5-60.5v-1618c0-228.8-186.2-415-415-415s-415,186.2-415,415v1618    c0,33.4-27.1,60.5-60.5,60.5s-60.5-27.1-60.5-60.5v-1618c0-295.2,238.6-536.1,536.1-536.1c295.2,0,536.1,238.6,536.1,536.1v1618    C1344.5,2858.1,1317.4,2885.2,1284,2885.2z"
                      />
                    </g>
                    <g>
                      <path
                        d="M1382.4,3202.3H234.5c-33.4,0-60.5-27.1-60.5-60.5v-317c0-33.4,27.1-60.5,60.5-60.5h1147.9c33.4,0,60.5,27.1,60.5,60.5    v317C1442.9,3175.2,1415.8,3202.3,1382.4,3202.3z M295,3081.2h1026.8v-196H295V3081.2z"
                      />
                    </g>
                    <g>
                      <path
                        d="M808.4,1508.5c-163,0-295.6-132.6-295.6-295.6s132.6-295.6,295.6-295.6s295.6,132.6,295.6,295.6    S971.4,1508.5,808.4,1508.5z M808.4,1038.4c-96.2,0-174.5,78.3-174.5,174.5s78.3,174.5,174.5,174.5s174.5-78.3,174.5-174.5    C983,1116.7,904.7,1038.4,808.4,1038.4z"
                      />
                    </g>
                    <g>
                      <path
                        d="M3441.7,1641.7H1284c-33.4,0-60.5-27.1-60.5-60.5s27.1-60.5,60.5-60.5h2157.7c75.1,0,136.3-61.1,136.3-136.3    s-61.1-136.3-136.3-136.3H1284c-33.4,0-60.5-27.1-60.5-60.5s27.1-60.5,60.5-60.5h2157.7c141.9,0,257.3,115.4,257.3,257.3    S3583.6,1641.7,3441.7,1641.7z"
                      />
                    </g>
                    <g>
                      <path
                        d="M1540,1593l-78.6-393.6c-6.5-32.8,14.7-64.6,47.5-71.2c32.8-6.5,64.6,14.7,71.2,47.5l78.6,393.6    c6.5,32.8-14.7,64.6-47.5,71.2C1578.2,1647.1,1546.6,1625.6,1540,1593z"
                      />
                    </g>
                    <g>
                      <path
                        d="M1900.5,1593l-78.6-393.6c-6.5-32.8,14.7-64.6,47.5-71.2c32.8-6.5,64.6,14.7,71.2,47.5l78.6,393.6    c6.5,32.8-14.7,64.6-47.5,71.2C1938.7,1647.1,1907.1,1625.6,1900.5,1593z"
                      />
                    </g>
                    <g>
                      <path
                        d="M2260.9,1593l-78.6-393.6c-6.5-32.8,14.7-64.6,47.5-71.2c32.8-6.5,64.6,14.7,71.2,47.5l78.6,393.6    c6.5,32.8-14.7,64.6-47.5,71.2C2299.1,1647.1,2267.5,1625.6,2260.9,1593z"
                      />
                    </g>
                    <g>
                      <path
                        d="M2621.4,1593l-78.6-393.6c-6.5-32.8,14.7-64.6,47.5-71.2c32.8-6.5,64.6,14.7,71.2,47.5l78.6,393.6    c6.5,32.8-14.7,64.6-47.5,71.2C2659.6,1647.1,2628,1625.6,2621.4,1593z"
                      />
                    </g>
                    <g>
                      <path
                        d="M2981.8,1593l-78.6-393.6c-6.5-32.8,14.7-64.6,47.5-71.2c32.8-6.5,64.6,14.7,71.2,47.5l78.6,393.6    c6.5,32.8-14.7,64.6-47.5,71.2C3020,1647.1,2988.4,1625.6,2981.8,1593z"
                      />
                    </g>
                    <g>
                      <path
                        d="M3342.3,1593l-78.6-393.6c-6.5-32.8,14.7-64.6,47.5-71.2c32.8-6.5,64.6,14.7,71.2,47.5l78.6,393.6    c6.5,32.8-14.7,64.6-47.5,71.2C3380.5,1647.1,3348.9,1625.6,3342.3,1593z"
                      />
                    </g>
                    <g>
                      <path
                        d="M1284,2048.9H332.9c-33.4,0-60.5-27.1-60.5-60.5s27.1-60.5,60.5-60.5H1284c33.4,0,60.5,27.1,60.5,60.5    C1344.5,2021.8,1317.4,2048.9,1284,2048.9z" /></g><g><path d="M1284,2569.6H332.9c-33.4,0-60.5-27.1-60.5-60.5s27.1-60.5,60.5-60.5H1284c33.4,0,60.5,27.1,60.5,60.5    S1317.4,2569.6,1284,2569.6z"
                        />
                    </g>
                  </g>
                </svg>

              }
              text="Ajustes Gate"
              isOpen={isSidepanelOpen}
              href="/dashboard/gates/settings/gate"
            />
            <ElementSidebar
              currentPath={path}
              icon={
                <Tickets width={20} />
              }
              text="Ajustes Suscripciones"
              isOpen={isSidepanelOpen}
              href="/dashboard/gates/settings/subscriptions"
            />
            <ElementSidebar
              currentPath={path}
              icon={
                <Blocks width={20} />
              }
              text="Ajustes Amenities"
              isOpen={isSidepanelOpen}
              href="/dashboard/gates/settings/amenities"
            />

            <ElementSidebar
              currentPath={path}
              icon={
                <Server width={20} />
              }
              text="Ajustes Equipo"
              isOpen={isSidepanelOpen}
              href="/dashboard/gates/settings/equipment"
            />

          </div>


          {/* Bottom Elements */}
          <div className='flex flex-col items-center'>
            <ElementSidebar
              currentPath={path}
              icon={
                <Settings2 width={20} />
              }
              text="Ajustes"
              isOpen={isSidepanelOpen}
              href="/dashboard/settings"
            />
            <ElementSidebar
              currentPath={path}
              icon={
                <CircleHelp width={18} />
              }
              text="Soporte"
              isOpen={isSidepanelOpen}
              href="/dashboard/support"
            />
            <ElementSidebar
              currentPath={path}
              icon={<LogOut width={18} />}
              text="Logout"
              isOpen={isSidepanelOpen}
              onClick={handleLogout}
            />

          </div>

        </div>
      }


    </div>
  )
}

export default Sidebar





interface ElementSidebarProps {
  icon: React.ReactNode
  text: string
  isOpen: boolean
  currentPath: string
  href?: string
  textStyle?: React.CSSProperties
  onClick?: () => void
}
const ElementSidebar = ({
  icon,
  text,
  isOpen,
  currentPath,
  href,
  textStyle,
  onClick
}: ElementSidebarProps) => {

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={styles.elementSidebar}
        style={{
          justifyContent: 'flex-start',
          paddingLeft: isOpen ? '15px' : '12px',

          ...textStyle
        }}
      >
        {icon}

        <div
          style={{
            opacity: isOpen ? 1 : 0,
            left: isOpen ? '40px' : '60px',

          }}
          className={styles.nameElement}>
          {text}
        </div>
        {
          currentPath === href &&
          <div className={styles.selectorBar} />
        }

      </div>
    )
  }


  return (
    <Link href={href ?? ''} className={styles.elementSidebar} style={{
      justifyContent: 'flex-start',
      paddingLeft: isOpen ? '15px' : '12px',
      ...textStyle
    }}>
      {icon}

      <div
        style={{
          opacity: isOpen ? 1 : 0,
          left: isOpen ? '40px' : '60px',

        }}
        className={styles.nameElement}>
        {text}
      </div>

      <div
        className={styles.selectorBar}
        style={{
          transition: 'opacity .5s ease, left .5s ease',
          opacity: currentPath === href ? 1 : 0,

        }}
      />


    </Link>
  )
}