import {
    useCallback,
    useEffect,
    useRef,
} from "react";
import { effect, signal } from "@preact/signals-react"
import { isLoggedIn } from "./auth"
import { API } from '../api/api'
import { debounce } from "lodash";

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


export function useLazyEffect(effect,deps=[],wait=300)
{
    const cleanUp = useRef();
    const effectRef = useRef();
    effectRef.current = useCallback(effect, deps);
    const lazyEffect = useCallback(
        debounce(() => (cleanUp.current = effectRef.current?.()), wait),
        []
    );
    useEffect(lazyEffect, deps);
    useEffect(() => {
        return () =>
        cleanUp.current instanceof Function ? cleanUp.current() : undefined;
        }, []
    );
}