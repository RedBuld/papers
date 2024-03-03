import React, { useEffect } from 'react'
import { effect } from '@preact/signals-react'
import { pageTitle, hasHistoryUnread, setHasHistoryUnread } from '../contexts/base'
import BorrowersRatingsHistoryTable from "../components/borrowers/borrowersRatingsHistoryTable"

function BorrowersRatingsHistoryPage()
{
    pageTitle.value = 'История рейтингов'

    effect( () => {
        hasHistoryUnread.value && setHasHistoryUnread(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasHistoryUnread])

    useEffect( () => {
        hasHistoryUnread.value && setHasHistoryUnread(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="min-w-full">
            <BorrowersRatingsHistoryTable
                usePagination={true}
            />
        </div>
    );
}

export default BorrowersRatingsHistoryPage