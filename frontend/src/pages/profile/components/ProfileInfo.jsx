import { useState } from 'react'
import { useAuthStore } from '../../../store/authStore'

const ProfileInfo = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || ''
  })
  const [isEditing, setIsEditing] = useState(false)
  
  const { updateProfile, isLoading } = useAuthStore()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await updateProfile(formData)
    if (success) {
      setIsEditing(false)
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Informations Personnelles
        </h2>
        {!isEditing && (
          <button
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="label">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="label">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-primary py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              className="btn-secondary py-2"
              onClick={() => {
                setFormData({
                  name: user.name || '',
                  email: user.email || ''
                })
                setIsEditing(false)
              }}
              disabled={isLoading}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Nom complet
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {user.name}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Adresse e-mail
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {user.email}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rôle
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Membre depuis
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileInfo