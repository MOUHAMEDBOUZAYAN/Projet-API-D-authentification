import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  
  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])
  
  // Changer l'apparence de la navbar au scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    await logout()
  }
  
  return (
    <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className={`w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md transition-all ${
            scrolled ? 'scale-90' : 'scale-100'
          }`}>
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className={`ml-2 font-bold text-lg transition-colors ${
            scrolled 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-900 dark:text-white'
          }`}>
            SecureAuth
          </span>
        </Link>
        
        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => `
              font-medium transition-all relative 
              ${scrolled 
                ? 'text-gray-800 dark:text-gray-200' 
                : 'text-gray-800 dark:text-white'
              }
              ${isActive ? 'text-primary-600 dark:text-primary-400' : 'hover:text-primary-600 dark:hover:text-primary-400'}
            `}
          >
            Accueil
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `
                  font-medium transition-all relative 
                  ${scrolled 
                    ? 'text-gray-800 dark:text-gray-200' 
                    : 'text-gray-800 dark:text-white'
                  }
                  ${isActive ? 'text-primary-600 dark:text-primary-400' : 'hover:text-primary-600 dark:hover:text-primary-400'}
                `}
              >
                Profil
              </NavLink>
              
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => `
                  font-medium transition-all relative 
                  ${scrolled 
                    ? 'text-gray-800 dark:text-gray-200' 
                    : 'text-gray-800 dark:text-white'
                  }
                  ${isActive ? 'text-primary-600 dark:text-primary-400' : 'hover:text-primary-600 dark:hover:text-primary-400'}
                `}
              >
                Connexion
              </NavLink>
              
              <NavLink 
                to="/register" 
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors"
              >
                Inscription
              </NavLink>
            </>
          )}
        </nav>
        
        {/* Bouton Menu Mobile */}
        <button 
          className="md:hidden text-gray-800 dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => `
                  py-2 px-4 rounded-lg font-medium
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                Accueil
              </NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => `
                      py-2 px-4 rounded-lg font-medium
                      ${isActive 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    Profil
                  </NavLink>
                  
                  <button 
                    onClick={handleLogout}
                    className="py-2 px-4 w-full text-left bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => `
                      py-2 px-4 rounded-lg font-medium
                      ${isActive 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    Connexion
                  </NavLink>
                  
                  <NavLink 
                    to="/register" 
                    className="py-2 px-4 w-full text-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                  >
                    Inscription
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar