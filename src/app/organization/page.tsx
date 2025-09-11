'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useTestUser } from '@/hooks/useTestUser';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  GraduationCap,
  Building,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  User,
  Search
} from 'lucide-react';

// Mock data pour l'école
const mockSchoolData = {
  name: "Lycée Technologique Jean Monnet",
  logo: "/api/placeholder/120/120", // Placeholder pour le logo
  description: "Établissement d'excellence fondé en 1985, spécialisé dans les formations technologiques et professionnelles. Notre mission est de former les leaders de demain dans un environnement stimulant et bienveillant.",
  address: {
    street: "15 Avenue de la République",
    city: "75011 Paris",
    country: "France",
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  contact: {
    phone: "+33 1 43 55 67 89",
    email: "contact@lycee-jmonnet.fr",
    website: "https://lycee-jmonnet.fr"
  },
  director: {
    name: "Madame Catherine Dubois",
    title: "Proviseure",
    email: "direction@lycee-jmonnet.fr",
    avatar: "CD"
  },
  socialMedia: {
    facebook: "https://facebook.com/lycee.jmonnet",
    instagram: "https://instagram.com/lycee_jmonnet",
    linkedin: "https://linkedin.com/school/lycee-jean-monnet",
    twitter: "https://twitter.com/lycee_jmonnet"
  },
  schedule: {
    monday: "7h30 - 18h30",
    tuesday: "7h30 - 18h30", 
    wednesday: "7h30 - 16h30",
    thursday: "7h30 - 18h30",
    friday: "7h30 - 17h00",
    saturday: "Fermé",
    sunday: "Fermé",
    lunchBreak: "12h00 - 13h30"
  },
  stats: {
    students: 850,
    teachers: 65,
    classes: 32,
    foundedYear: 1985
  },
  transport: {
    metro: ["Ligne 3 - Parmentier", "Ligne 11 - Goncourt"],
    bus: ["Ligne 46", "Ligne 75"],
    parking: "Parking gratuit disponible (50 places)"
  },
  facilities: [
    "Laboratoires scientifiques modernes",
    "Ateliers techniques équipés",
    "Centre de documentation et d'information",
    "Gymnase et terrains de sport",
    "Restaurant scolaire",
    "Internat (120 places)"
  ]
};

export default function OrganizationPage() {
  const { user, logout } = useAuth();
  const { isTestUser } = useTestUser(user);

  if (!user) {
    redirect('/');
  }

  if (user.role === 'admin') {
    return (
      <MainLayout user={user} onLogout={logout}>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Structure de l&apos;application</h1>
                <p className="text-gray-600">Gérez la structure et l&apos;organisation de l&apos;application</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-500 mt-2">
                Fonctionnalités prévues : gestion des établissements, modération, statistiques...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Données vides pour l'utilisateur test
  const displayData = isTestUser ? {
    name: "Aucun établissement configuré",
    description: "Aucune information d'établissement disponible pour cet utilisateur de test.",
    address: { street: "", city: "", country: "" },
    contact: { phone: "", email: "", website: "" },
    director: { name: "", title: "", email: "", avatar: "" },
    stats: { students: 0, teachers: 0, classes: 0, foundedYear: 0 },
    socialMedia: { facebook: "", instagram: "", linkedin: "", twitter: "" },
    facilities: [],
    schedule: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: ""
    }
  } : mockSchoolData;

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        
        {/* Header avec logo et nom de l'école */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{displayData.name}</h1>
              <p className="text-gray-600 leading-relaxed">{displayData.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Informations de contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center space-x-2 mb-6">
              <Phone className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            </div>
            
{isTestUser ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center p-8 bg-gray-50 rounded-xl">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Aucune information de contact</p>
                  <p className="text-gray-500 text-sm">Les données de contact ne sont pas encore configurées</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-700">{displayData.address.street}</p>
                    <p className="text-blue-600 text-sm">{displayData.address.city}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                  <Phone className="h-5 w-5 text-green-600" />
                  <p className="font-semibold text-green-700">{displayData.contact.phone}</p>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <p className="font-semibold text-purple-700">{displayData.contact.email}</p>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                  <Globe className="h-5 w-5 text-orange-600" />
                  <a href={displayData.contact.website} className="text-orange-700 font-semibold hover:text-orange-800 flex items-center space-x-2">
                    <span>Site web officiel</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Direction */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Direction</h2>
            </div>
            
{isTestUser ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center p-8 bg-gray-50 rounded-xl">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Aucune information de direction</p>
                  <p className="text-gray-500 text-sm">Les données de l&apos;équipe dirigeante ne sont pas encore configurées</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  {displayData.director.avatar}
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h3 className="font-bold text-purple-700 text-lg mb-2">{displayData.director.name}</h3>
                  <p className="text-purple-600 font-semibold text-base mb-3">{displayData.director.title}</p>
                  <a href={`mailto:${displayData.director.email}`} className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>Contacter</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Horaires */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Horaires</h2>
            </div>
            
{isTestUser ? (
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">Aucun horaire configuré</p>
                <p className="text-gray-500 text-sm">Les horaires d&apos;ouverture ne sont pas encore disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 text-base">Lundi</span>
                  <span className="text-green-600 font-bold text-base">{displayData.schedule.monday}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 text-base">Mardi</span>
                  <span className="text-green-600 font-bold text-base">{displayData.schedule.tuesday}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 text-base">Mercredi</span>
                  <span className="text-blue-600 font-bold text-base">{displayData.schedule.wednesday}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 text-base">Jeudi</span>
                  <span className="text-green-600 font-bold text-base">{displayData.schedule.thursday}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 text-base">Vendredi</span>
                  <span className="text-orange-600 font-bold text-base">{displayData.schedule.friday}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 text-base">Samedi</span>
                  <span className="text-gray-500 font-bold text-base">{displayData.schedule.saturday}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold text-gray-700 text-base">Dimanche</span>
                  <span className="text-gray-500 font-bold text-base">{displayData.schedule.sunday}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Statistiques de l'école - Full width */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Building className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">En chiffres</h2>
          </div>
          
{isTestUser ? (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">Aucune statistique disponible</p>
              <p className="text-gray-500 text-sm">Les données statistiques de l&apos;établissement ne sont pas encore configurées</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{displayData.stats.students}</div>
                <div className="text-base font-medium text-blue-700">Étudiants</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{displayData.stats.teachers}</div>
                <div className="text-base font-medium text-green-700">Enseignants</div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{displayData.stats.classes}</div>
                <div className="text-base font-medium text-purple-700">Classes</div>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{displayData.stats.foundedYear}</div>
                <div className="text-base font-medium text-orange-700">Fondé en</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Réseaux sociaux */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Ses réseaux</h2>
            </div>
            
{isTestUser ? (
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">Aucun réseau social configuré</p>
                <p className="text-gray-500 text-sm">Les liens vers les réseaux sociaux ne sont pas encore disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <a href={displayData.socialMedia.facebook} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Facebook className="h-6 w-6 text-blue-600" />
                    <span className="font-semibold text-blue-700 text-lg">Facebook</span>
                  </div>
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </a>
                
                <a href={displayData.socialMedia.instagram} className="flex items-center justify-between p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    <span className="font-semibold text-pink-700 text-lg">Instagram</span>
                  </div>
                  <ExternalLink className="h-5 w-5 text-pink-600" />
                </a>
                
                <a href={displayData.socialMedia.linkedin} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Linkedin className="h-6 w-6 text-blue-600" />
                    <span className="font-semibold text-blue-700 text-lg">LinkedIn</span>
                  </div>
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </a>
                
                <a href={displayData.socialMedia.twitter} className="flex items-center justify-between p-4 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Twitter className="h-6 w-6 text-sky-600" />
                    <span className="font-semibold text-sky-700 text-lg">Twitter</span>
                  </div>
                  <ExternalLink className="h-5 w-5 text-sky-600" />
                </a>
              </div>
            )}
          </div>

          {/* Localisation GPS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Localisation</h2>
            </div>
            
{isTestUser ? (
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">Aucune localisation configurée</p>
                <p className="text-gray-500 text-sm">Les informations de géolocalisation ne sont pas encore disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Input de recherche d'adresse */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une adresse..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                  />
                </div>
                
                <div className="text-center p-8 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500 font-bold">MAP</span>
                  </div>
                  <p className="text-gray-600 font-medium mb-3">Carte interactive</p>
                  <p className="text-gray-500 text-sm mb-4">Intégration Google Maps à venir</p>
                  
                  {/* Bouton Google Maps discret */}
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium underline hover:no-underline transition-colors">
                    Ouvrir dans Google Maps
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>


      </div>
    </MainLayout>
  );
}