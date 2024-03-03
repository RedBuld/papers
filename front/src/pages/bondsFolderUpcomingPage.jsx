import React from 'react'
import { useNavigate } from 'react-router-dom'
import { effect } from '@preact/signals-react'
import { user } from '../contexts/auth'
import { pageTitle } from '../contexts/base'
import BondsTableUpcoming from "../components/bonds/bondsTableUpcoming"

function BondsFolderUpcomingPage()
{
    pageTitle.value = 'Папка "Скорое размещение"'

    const navigate = useNavigate()

    effect( () => {
        user.value?.id || navigate("/")
    }, [user])

    return (
        <div className="min-w-full">
            <div className="flex flex-row justify-between items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md shadow-gray-300">
                <div className="inline-flex text-2xl leading-6 font-medium text-gray-800">Скорое размещение</div>
            </div>
            <BondsTableUpcoming
                usePagination={true}
            />
        </div>
    );
}

export default BondsFolderUpcomingPage