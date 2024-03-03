import React from 'react'
import { useNavigate } from 'react-router-dom'
import { effect } from '@preact/signals-react'
import { user } from '../contexts/auth'
import { pageTitle } from '../contexts/base'
import BondsTable from "../components/bonds/bondsTable"

function BondsFolderFreshPage()
{
    pageTitle.value = 'Папка "Недавно торгуются"'

    const navigate = useNavigate()

    effect( () => {
        user.value?.id || navigate("/")
    }, [user])

    return (
        <div className="min-w-full">
            <div className="flex flex-row justify-between items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md shadow-gray-300">
                <div className="inline-flex text-2xl leading-6 font-medium text-gray-800">Недавно торгуются</div>
            </div>
            <BondsTable
                Fresh={true}
                usePagination={true}
                useDelta={false}
                useColumnsConfigurator={true}
                useAdditionalColumn={true}
                data_key={`folder_fresh`}
            />
        </div>
    );
}

export default BondsFolderFreshPage