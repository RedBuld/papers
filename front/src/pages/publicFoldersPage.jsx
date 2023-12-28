import React from 'react'
import BondsFolders from "../components/bonds_folders/bondsFolders"

function PublicFoldersPage() {
  return (
    <div className="min-w-full">
      <BondsFolders
        is_public={true}
      />
    </div>
  )
}

export default PublicFoldersPage