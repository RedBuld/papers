import { effect, signal } from "@preact/signals-react"
import { isLoggedIn } from "./auth"
import { API } from '../api/api'

export const hasChatUnread = signal( 0 )
export const hasFeatureUnread = signal( false )
export const hasHistoryUnread = signal( false )

async function getHistoryStatus()
{
    // if(!isLoggedIn.value) return
    const response = await API.get('/updates/history')
    if( response.status === 200 )
    {
        let lastHistory = localStorage.getItem('last_history_id')
        if( ''+response.data !== ''+lastHistory)
        {
            setHasHistoryUnread(true)
        }
    }
}

async function getFeaturesStatus()
{
    console.log('getFeaturesStatus')
    // if(!isLoggedIn.value) return
    const response = await API.get('/updates/features')
    if( response.status === 200 )
    {
        let lastFeature = localStorage.getItem('last_feature_id')
        if( ''+response.data !== ''+lastFeature)
        {
            setHasFeatureUnread(true)
        }
    }
}

async function getFeedbackStatus()
{
    console.log('getFeedbackStatus')
    if(!isLoggedIn.value) return
    const response = await API.get('/updates/chats')
    if( response.status === 200 )
    {
        setHasChatUnread(response.data)
    }
}

export function setHasChatUnread(value)
{
    hasChatUnread.value = value
}
export function setHasFeatureUnread(value)
{
    hasFeatureUnread.value = value
}
export function setHasHistoryUnread(value)
{
    hasHistoryUnread.value = value
}

effect( () => {
    const update_interval = setInterval(() => {
        Promise.all([
            getFeedbackStatus(),
            getFeaturesStatus(),
            getHistoryStatus()
        ])
    }, 60000)
    return () => clearInterval(update_interval)
}, [isLoggedIn])

getFeedbackStatus()
getFeaturesStatus()
getHistoryStatus()
