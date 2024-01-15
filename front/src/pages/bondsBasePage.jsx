import React, { useState } from 'react'
import BondsTable from "../components/bonds/bondsTable"
import BondsFolders from "../components/bonds_folders/bondsFolders"

function BondsBasePage()
{
    const [personalFolders,setPersonalFolders] = useState([])

    return (
        <div className="min-w-full">
            <BondsFolders
                is_public={false}
                setPersonalFolders={setPersonalFolders}
            />
            <BondsTable
                getBondsUrl='/bonds/'
                usePagination={true}
                useDelta={false}
                useColumnsConfigurator={true}
                useAdditionalColumn={true}
                personalFolders={personalFolders}
            />
        </div>
    );
}

export default BondsBasePage