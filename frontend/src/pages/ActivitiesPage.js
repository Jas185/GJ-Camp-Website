import PlanningCarousel from '../components/PlanningCarousel';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/ActivitiesPage.css';

function ActivitiesPage() {
  const { user, token, updateUserActivities } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  // Pour la sélection exclusive par créneau :
  // { '08:00-09:00': 'activityId1', '10:00-11:00': 'activityId2', ... }
  const [selectedCreneaux, setSelectedCreneaux] = useState(user?.selectedCreneaux || {});
  const [showCarousel, setShowCarousel] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);

  useEffect(() => {
    fetchActivities();
    // Charger les choix enregistrés si présents (mapping creneau -> activité)
    if (user?.selectedCreneaux) {
      setSelectedCreneaux(user.selectedCreneaux);
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/activities');
      console.log('📋 Activités reçues:', response.data);
      setActivities(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des activités');
      console.error('❌ Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sélectionner une activité pour un créneau (radio)
  const handleSelectCreneau = (creneauKey, activityId) => {
    setSelectedCreneaux(prev => ({ ...prev, [creneauKey]: activityId }));
  };

  // Sauvegarder les choix de créneaux (mapping creneau -> activitéId)
  const handleSaveSelection = async () => {
    if (!token) {
      setError('Vous devez être connecté pour enregistrer vos activités');
      return;
    }
    try {
      setLoading(true);
      // On envoie le mapping creneau -> activitéId au backend
      const response = await axios.patch(
        '/api/auth/update-selected-creneaux',
        { selectedCreneaux },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // updateUserActivities peut être adapté pour stocker selectedCreneaux
      setSuccess('✅ Vos choix ont été enregistrés avec succès !');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de vos choix');
      console.error('❌ Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivitiesByDay = (day) => {
    const filtered = activities.filter(activity => activity.jour === day);
    // Trier par heure de début
    return filtered.sort((a, b) => {
      if (!a.heureDebut) return 1;
      if (!b.heureDebut) return -1;
      return a.heureDebut.localeCompare(b.heureDebut);
    });
  };

  const getActivitiesByType = (day, type) => {
    return getActivitiesByDay(day).filter(activity => activity.type === type);
  };

  // Vérifie si une activité est sélectionnée pour son créneau
  const isActivitySelected = (creneauKey, activityId) => {
    return selectedCreneaux[creneauKey] === activityId;
  };

  const openActivityDetail = (activity) => {
    setSelectedActivityDetail(activity);
  };

  const closeActivityDetail = () => {
    setSelectedActivityDetail(null);
  };

  const currentDayActivities = getActivitiesByDay(selectedDay);
  const obligatoireActivities = getActivitiesByType(selectedDay, 'obligatoire');
  const optionnelleActivities = getActivitiesByType(selectedDay, 'optionnelle');
  // Regrouper les activités optionnelles par créneau horaire
  const optionnellesByCreneau = {};
  optionnelleActivities.forEach(act => {
    const key = `${act.heureDebut || ''}-${act.heureFin || ''}`;
    if (!optionnellesByCreneau[key]) optionnellesByCreneau[key] = [];
    optionnellesByCreneau[key].push(act);
  });

  // Debug logs
  console.log('🔍 Total activities:', activities.length);
  console.log('🔍 Current day:', selectedDay);
  console.log('🔍 Activities for day', selectedDay, ':', currentDayActivities.length);
  console.log('🔍 Obligatoires:', obligatoireActivities.length);
  console.log('🔍 Optionnelles:', optionnelleActivities.length);

  const activityCounts = [1, 2, 3, 4].map(day => ({
    day,
    count: getActivitiesByDay(day).length
  }));

  if (loading && activities.length === 0) {
    return (
      <div className="activities-page">
        <div className="loading-spinner">⏳ Chargement des activités...</div>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="activities-hero">
        <h1>🎯 Mon Planning</h1>
        <p>Sélectionnez vos activités pour chaque créneau, puis validez.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Sélecteur de jour */}
      <div className="day-selector">
        {activityCounts.map(({ day, count }) => (
          <button
            key={day}
            className={`day-button ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            <span className="day-label">Jour {day}</span>
            <span className="activity-count">{count} activité{count > 1 ? 's' : ''}</span>
          </button>
        ))}
      </div>

      {/* Carousel interactif pour la sélection du planning du jour */}
      {showCarousel && currentDayActivities.length > 0 && (
        <PlanningCarousel
          activities={currentDayActivities}
          selectedCreneaux={selectedCreneaux}
          onValidateCreneau={(creneauKey, actId) => setSelectedCreneaux(prev => ({ ...prev, [creneauKey]: actId }))}
          day={selectedDay}
          onFinish={(choix) => {
            setSelectedCreneaux(choix);
            setShowCarousel(false);
            // Tu peux ici appeler handleSaveSelection(choix) pour sauvegarder côté backend
          }}
        />
      )}

      {/* Récapitulatif après validation */}
      {!showCarousel && (
        <div className="planning-recap">
          <h2>✅ Récapitulatif de mes choix pour le jour {selectedDay}</h2>
          <ul>
            {Object.entries(selectedCreneaux).map(([creneau, actId]) => {
              const act = currentDayActivities.find(a => a._id === actId);
              return act ? (
                <li key={creneau}><b>{act.titre}</b> ({act.heureDebut}{act.heureFin && ` - ${act.heureFin}`})</li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ActivitiesPage;
