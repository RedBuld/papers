import { signal, effect } from "@preact/signals-react"
import { RAW } from '../api/api'

export const user = signal( getUser() )
export const session = signal( getSession() )
export const isLoggedIn = signal( getLoggedIn() )

effect( () => {
    isLoggedIn.value = getLoggedIn()
}, [user,session] )

effect( () => {
    localStorage.setItem( 'session', JSON.stringify(session.value) )
}, [session] )

effect( () => {
    localStorage.setItem( 'user', JSON.stringify(user.value) )
}, [user] )

// 

function getSession() {
    let session = localStorage.getItem('session')
    if(!session)
    {
        return {}
    }
    try {
        return JSON.parse(session)
    } catch (e) {
        return {}
    }
}

function getUser() {
    let user = localStorage.getItem('user')
    if(!user)
    {
        return {}
    }
    try {
        return JSON.parse(user)
    } catch (e) {
        return {}
    }
}

function getLoggedIn() {
    return Object.keys(session.value).length>0 && Object.keys(user.value).length>0
}

//

export async function LogIn(payload) {

    return RAW
        .post( '/auth/login', payload )
        .then( (response) => {
            user.value = response.data.user
            session.value = {
                'access_token':response.data.access_token,
                'refresh_token':response.data.refresh_token
            }
            return Promise.resolve(true)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function LogOut() {
    user.value = {}
    session.value = {}
    return Promise.resolve(true)
}

export async function Registration(payload) {
    
    return RAW
        .post( '/auth/registration', payload )
        .then( (response) => {
            user.value = response.data
            return Promise.resolve(true)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function ConfirmRegistration(payload) {
    
    return RAW
        .post( '/auth/confirmation', payload )
        .then( (response) => {
            user.value = response.data.user
            session.value = {
                'access_token':response.data.access_token,
                'refresh_token':response.data.refresh_token
            }
            return Promise.resolve(true)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function ForgotPassword(payload) {
    
    return RAW
        .post( '/auth/forgot_password', payload )
        .then( (response) => {
            user.value = response.data.user
            session.value = {}
            return Promise.resolve(true)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function ResetPassword(payload) {
    
    return RAW
        .post( '/auth/reset_password', payload )
        .then( (response) => {
            user.value = response.data.user
            session.value = {
                'access_token':response.data.access_token,
                'refresh_token':response.data.refresh_token
            }
            return Promise.resolve(true)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}