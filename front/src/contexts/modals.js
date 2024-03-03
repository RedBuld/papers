import { signal } from "@preact/signals-react"

export const loginModalOpen = signal(false)
export const registrationModalOpen = signal(false)
export const folderEditModalOpen = signal(false)
export const filtersSettingsModalOpen = signal(false)
export const currentFolder = signal(null)

export const OpenLoginModal = () => {
    loginModalOpen.value = true
}
export const CloseLoginModal = () => {
    loginModalOpen.value = false
}

export const OpenRegistrationModal = () => {
    registrationModalOpen.value = true
}
export const CloseRegistrationModal = () => {
    registrationModalOpen.value = false
}

export const LoginToRegistrationModal = () => {
    registrationModalOpen.value = true
    loginModalOpen.value = false
}
export const RegistrationToLoginModal = () => {
    loginModalOpen.value = true
    registrationModalOpen.value = false
}
