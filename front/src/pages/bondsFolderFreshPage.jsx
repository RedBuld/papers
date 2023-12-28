import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../api/api'
import BondsTable from "../components/bonds/bondsTable"

function BondsFolderFreshPage()
{
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
            />
        </div>
    );
}

export default BondsFolderFreshPage