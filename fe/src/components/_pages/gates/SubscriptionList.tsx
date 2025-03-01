import React from 'react'



import Table from '@/components/tables/Table'
import TableCard from '@/components/tables/TableCard'
import TableCardHeader from '@/components/tables/TableCardHeader'
import TableHeaderContainer from '@/components/tables/TableHeaderContainer'
import { Download } from 'lucide-react'
import { getAllGateSubscriptions, getAllProfiles } from '@/services/api'
import toast from 'react-hot-toast'
import Input from '@/components/inputs/input'
import Searchbar from '@/components/inputs/inputSearch'
import NoUsers from '@/components/404/NoUsers'
import TableCardSkeleton from '@/components/tables/TableCardSkeleton'
import InputSelect from '@/components/inputs/inputSelect'
import Modal from '@/components/_globals/modal'
import ModalUserDetail from '@/components/modals/ModalUserDetail'


function SubscriptionList() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [profiles, setProfiles] = React.useState<any>([])

    const [loading, setLoading] = React.useState(true)
    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(10)
    const [search, setSearch] = React.useState('')
    const [filter, setFilter] = React.useState('')

    const [userModal, setUserModal] = React.useState<any>(null)

    const [filterOptions] = React.useState([
        { value: 'all', label: 'All' },
        { value: 'admin', label: 'Administrador' },
        { value: 'user', label: 'Usuario' },
        { value: 'operator', label: 'Gater' },
    ])

    const fetchSubscriptions = async (page: number, filter: string) => {
        if (page === 1){
            setLoading(true)
        }

        const call = await getAllGateSubscriptions(page, limit, '', filter)
        
        if (call.success) {
            setProfiles((prev: any) => [...prev, ...call.data])
        } else {
            toast.error(call.message)
        }

        setTimeout(() => {
            setLoading(false)
        }, 700)
    }
    const onSearch = async (value: string, filter: string) => {
        setLoading(true)

        const call = await getAllGateSubscriptions(1, limit, value, filter)
        if (call.success) {
            setProfiles(call.data)
        } else {
            toast.error(call.message)
        }

        setTimeout(() => {
            setLoading(false)
        }, 700)

    }
    const handleScroll = () => {
        if (profiles.length < 5) return;
        const { scrollTop, clientHeight, scrollHeight } = containerRef.current || {};
        if (!clientHeight || !scrollHeight || !scrollTop) return;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (loading) return;
            setPage(prevPage => prevPage + 1);
        }
    };

    
    React.useEffect(() => {
        fetchSubscriptions(page, filter)
    }, [page, limit])
    React.useEffect(() => {
        setPage(1)
        onSearch(search, filter)
    }, [search, filter])




    return (
        <Table>
            <div className='flex flex-row items-center mb-4 mt-3 justify-between w-full'>
                <div className='w-[400px]'>
                    <Searchbar
                        placeholder={'Bucar placa'}
                        onSearch={(value: string) => setSearch(value)}
                        isSearching={loading}
                    />
                </div>
                <div className='w-[150px]' style={{transform: 'translateY(7px)'}}>
                    <InputSelect
                        options={filterOptions}
                        placeholder='Filter'
                        value={filter || ''}
                        onSelect={(value: string) => setFilter(value)}
                        style={{paddingLeft: '10px'}}
                    />
                </div>
            </div>

            {/* Table Head */}
            <TableHeaderContainer>
                <TableCardHeader
                    main='Placa del Vehiculo'
                    others={['Inicio', 'Fin']}
                    isDownloadAvailable={false}
                />
            </TableHeaderContainer>

            {/* Table Data */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                style={{
                    height: 'calc(100vh - 350px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none', // For Internet Explorer and Edge
                }}
                className="no-scrollbar" // For Webkit browsers
            >
                {
                    !loading &&
                    profiles.length > 0 ?
                    profiles.map((profile: any, index: number) => (
                        <TableCard
                            key={profile.licensePlate}
                            main={`${profile.licensePlate}`}
                            others={[
                                new Date(profile.startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' }),
                                new Date(profile.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' }),
                                
                            ]}
                            
                            onClick={() => {
                                //Go to user profile
                                setUserModal(profile)
                            }}
                        />
                    ))
                    :
                    !loading &&
                    profiles.length === 0 ?
                    <NoUsers/>
                    :
                    loading &&
                    <div>
                        {
                            Array.from({ length: 10 }).map((_, index) => {
                                return(
                                    <TableCardSkeleton
                                        key={index}
                                        index={index}
                                        others={['']}
                                    />
                                )
                            })
                        }
                    </div>
                }
            </div>

            {
                userModal &&
                <Modal
                    isOpen={userModal}
                    onClose={() => setUserModal(null)}
                >
                   <ModalUserDetail
                        profile={userModal}
                        onClose={() => setUserModal(null)}
                   />
                </Modal>
            }

        </Table>
    )
}

export default SubscriptionList