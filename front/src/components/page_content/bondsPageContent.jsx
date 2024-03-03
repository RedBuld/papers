import React from 'react'
import BondsTable from "../bonds/bondsTable"
import BondsFolders from "../bonds_folders/bondsFolders"

function BondsPageContent()
{
    return (
        <>
            <BondsFolders
                is_public={false}
            />
            <BondsTable
                getBondsUrl='/bonds/'
                usePagination={true}
                useDelta={false}
                useColumnsConfigurator={true}
                useAdditionalColumn={true}
            />
        </>
    )
}

export default BondsPageContent