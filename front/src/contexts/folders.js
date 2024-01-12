import { effect, signal } from "@preact/signals-react"
import { API } from '../api/api'
import { isLoggedIn } from './auth'

const updateTrigger = signal( Date.now() )
export const personalFolders = signal( [] )

function updateTimestamp() {
    updateTrigger.value = Date.now()
}

async function loadPrivateFolders()
{
    if( isLoggedIn.value )
    {
        await GetAll()
            .then( (data) => {
                personalFolders.value = data
            } )
            .catch( (error) => {
                personalFolders.value = []
            } )
    }
    else
    {
        personalFolders.value = []
    }
}

effect( () => {
    loadPrivateFolders()
}, [updateTrigger,isLoggedIn])

export async function GetAll()
{
    return API
        .get( `/folders/` )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function GetPublic()
{
    return API
        .get( `/folders/folder/public/` )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function GetOne(id)
{
    return API
        .get( `/folders/folder/${id}` )
        .then( (response) => {
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function Create(payload)
{
    return API
        .post( '/folders/', payload )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function Update(id,payload)
{
    return API
        .post( `/folders/folder/${id}`, payload )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function Delete(id)
{
    return API
        .delete( `/folders/folder/${id}` )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function AddBond(folder_id, bond_id)
{
    return API
        .post( `/folders/folder/${folder_id}/bonds/${bond_id}` )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function DeleteBond(folder_id, bond_id)
{
    return API
        .delete( `/folders/folder/${folder_id}/bonds/${bond_id}` )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}

export async function BatchAddBonds(bond_id, folders)
{
    return API
        .post( `/folders/batch/${bond_id}`, folders )
        .then( (response) => {
            updateTimestamp()
            return Promise.resolve(response.data)
        } )
        .catch( (err) => {
            return Promise.reject(err)
        } )
}