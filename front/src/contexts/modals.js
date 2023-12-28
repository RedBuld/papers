import { signal } from "@preact/signals-react"

export const loginModalOpen = signal(false)
export const registrationModalOpen = signal(false)
export const folderEditModalOpen = signal(false)
export const filtersSettingsModalOpen = signal(false)
export const currentFolder = signal(null)

export const OpenLoginModal = async () => {
    loginModalOpen.value = true
}
export const CloseLoginModal = async () => {
    loginModalOpen.value = false
}

export const OpenRegistrationModal = async () => {
    registrationModalOpen.value = true
}
export const CloseRegistrationModal = async () => {
    registrationModalOpen.value = false
}

export const LoginToRegistrationModal = async () => {
    registrationModalOpen.value = true
    loginModalOpen.value = false
}
export const RegistrationToLoginModal = async () => {
    loginModalOpen.value = true
    registrationModalOpen.value = false
}
