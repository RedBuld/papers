import React from 'react'
import LoginModal from './loginModal'
import RegistrationModal from './registrationModal'

function Modals()
{
    return (
        <div className="relative z-20">
            {/* <SingleBondModal/>
            <SingleBorrowerModal/> */}
            <LoginModal />
            <RegistrationModal />
        </div>
    )
}

export default Modals