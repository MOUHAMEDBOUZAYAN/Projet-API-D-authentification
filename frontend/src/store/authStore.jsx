import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Vérifier l'authentification à partir du token
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isAuthenticated: false, user: null })
      return false
    }

    set({ isLoading: true })
    try {
      // Configuration des headers pour l'API
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      // Récupérer les informations de l'utilisateur
      const response = await axios.get('/api/auth/me', config)
      
      set({ 
        user: response.data.data, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      })
      return true
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error)
      localStorage.removeItem('token')
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: error.response?.data?.error || 'Erreur de connexion. Veuillez vous reconnecter.' 
      })
      return false
    }
  },

  // Inscription
  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { token } = response.data
      
      // Stocker le token
      localStorage.setItem('token', token)
      
      // Mettre à jour le state
      set({ 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      })
      
      // Récupérer les infos utilisateur
      await get().checkAuth()
      
      toast.success('Inscription réussie! Bienvenue!')
      return true
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      const errorMessage = error.response?.data?.error || 'Erreur lors de l\'inscription. Veuillez réessayer.'
      set({ isLoading: false, error: errorMessage })
      toast.error(errorMessage)
      return false
    }
  },

  // Connexion
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/auth/login', credentials)
      const { token } = response.data
      
      // Stocker le token
      localStorage.setItem('token', token)
      
      // Mettre à jour le state
      set({ 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      })
      
      // Récupérer les infos utilisateur
      await get().checkAuth()
      
      toast.success('Connexion réussie!')
      return true
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      const errorMessage = error.response?.data?.error || 'Identifiants invalides. Veuillez réessayer.'
      set({ isLoading: false, error: errorMessage })
      toast.error(errorMessage)
      return false
    }
  },

  // Déconnexion
  logout: async () => {
    set({ isLoading: true })
    try {
      // Appel API pour déconnecter côté serveur
      if (get().token) {
        await axios.get('/api/auth/logout', {
          headers: {
            Authorization: `Bearer ${get().token}`
          }
        })
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // Supprimer le token local
      localStorage.removeItem('token')
      
      // Réinitialiser le state
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      })
      
      toast.success('Vous êtes déconnecté.')
    }
  },

  // Demande de réinitialisation de mot de passe
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null })
    try {
      await axios.post('/api/auth/forgotpassword', { email })
      set({ isLoading: false })
      toast.success('Un email de réinitialisation a été envoyé à votre adresse email.')
      return true
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error)
      const errorMessage = error.response?.data?.error || 'Erreur lors de la demande de réinitialisation. Veuillez réessayer.'
      set({ isLoading: false, error: errorMessage })
      toast.error(errorMessage)
      return false
    }
  },

  // Réinitialisation de mot de passe
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null })
    try {
      await axios.put(`/api/auth/resetpassword/${token}`, { password })
      set({ isLoading: false })
      toast.success('Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.')
      return true
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error)
      const errorMessage = error.response?.data?.error || 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.'
      set({ isLoading: false, error: errorMessage })
      toast.error(errorMessage)
      return false
    }
  },

  // Mise à jour du profil
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${get().token}`
        }
      }
      
      const response = await axios.put('/api/auth/updatedetails', userData, config)
      set({ 
        user: response.data.data, 
        isLoading: false,
        error: null 
      })
      
      toast.success('Profil mis à jour avec succès!')
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      const errorMessage = error.response?.data?.error || 'Erreur lors de la mise à jour du profil. Veuillez réessayer.'
      set({ isLoading: false, error: errorMessage })
      toast.error(errorMessage)
      return false
    }
  },

  // Mise à jour du mot de passe
  updatePassword: async (passwordData) => {
    set({ isLoading: true, error: null })
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${get().token}`
        }
      }
      
      await axios.put('/api/auth/updatepassword', passwordData, config)
      set({ isLoading: false, error: null })
      
      toast.success('Mot de passe mis à jour avec succès!')
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error)
      const errorMessage = error.response?.data?.error || 'Erreur lors de la mise à jour du mot de passe. Veuillez réessayer.'
      set({ isLoading: false, error: errorMessage })
      toast.error(errorMessage)
      return false
    }
  },

  // Effacer les erreurs
  clearErrors: () => {
    set({ error: null })
  }
}))