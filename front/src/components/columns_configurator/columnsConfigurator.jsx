import React, { useState } from 'react'
import { compact } from '../../contexts/design'
import ColumnsConfiguratorModal from './columnsConfiguratorModal'

function ColumnsConfigurator(props)
{
    const {
        groups, columns,
        columnsActive, setColumnsActive, resetColumnsActive,
        columnsOrder, setColumnsOrder, resetColumnsOrder
    } = props

    const [modalOpen,setModalOpen] = useState(false)
    
    function openColumnsModal()
    {
        setModalOpen(true)
    }

    function closeColumnsModal()
    {
        setModalOpen(false)
    }

    return (
        <>
            <ColumnsConfiguratorModal
                open={modalOpen}
                close={closeColumnsModal}
                groups={groups}
                columns={columns}
                columnsActive={columnsActive}
                setColumnsActive={setColumnsActive}
                resetColumnsActive={resetColumnsActive}
                columnsOrder={columnsOrder}
                setColumnsOrder={setColumnsOrder}
                resetColumnsOrder={resetColumnsOrder}
            />
            <button onClick={openColumnsModal} title="Настройки колонок" className="inline-flex items-center justify-between font-medium text-sm rounded-lg bg-gray-50 text-gray-300 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 650" fill="none" className={"text-inherit " + (compact.value ? "w-4 h-4" : "w-6 h-6") }>
                    <path fill="currentColor" d="m650,500h-200v150h75c33.15001,0,64.94999-13.17501,88.39998-36.60002,23.42501-23.44999,36.60002-55.24998,36.60002-88.39998v-25Zm-250,150h-150v-150h150v150ZM0,500v25C0,558.15001,13.175,589.95,36.6,613.39999c23.45001,23.42501,55.25,36.60002,88.40001,36.60002h75v-150H0Zm200-150v100H0v-100h200Zm200,0v100h-150v-100h150Zm250,0v100h-200v-100h200Zm-450-50H0v-100h200v100Zm200,0h-150v-100h150v100Zm250,0h-200v-100h200v100ZM0,150h650v-25c0-33.15001-13.17501-64.95-36.60002-88.40001C589.95,13.175,558.15001,0,525,0H125C91.85,0,60.05,13.175,36.6,36.6,13.175,60.05,0,91.85,0,125c0,0,0,25,0,25Z" fillRule="evenodd"/>
                </svg>
            </button>
        </>
    )
}

export default ColumnsConfigurator