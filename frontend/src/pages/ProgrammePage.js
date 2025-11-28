import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/ProgrammePage.css';


function ProgrammePage() {
  const [activities, setActivities] = useState([]);
  // On détecte tous les jours disponibles dans les activités
  const joursDisponibles = Array.from(new Set(activities.map(act => act.jour))).sort((a, b) => a - b);
  const [selectedDay, setSelectedDay] = useState(joursDisponibles[0] || 1);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const { isAuthenticated, token } = useContext(AuthContext);

  // Charger les activités depuis l'API
  async function fetchActivities() {
    try {
      const response = await axios.get('/api/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des activités', error);
    }
  }

  // Charger les activités sélectionnées de l'utilisateur
  async function fetchUserSelectedActivities() {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedActivities(response.data.selectedActivities || []);
    } catch (error) {
      console.error('Erreur lors du chargement des activités sélectionnées', error);
    }
  }

  // Sélectionner/désélectionner une activité optionnelle
  async function toggleActivitySelection(activityId) {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour sélectionner des activités');
      return;
    }
    try {
      const isSelected = selectedActivities.includes(activityId);
      const newSelected = isSelected
        ? selectedActivities.filter(id => id !== activityId)
        : [...selectedActivities, activityId];
      await axios.patch(
        '/api/auth/update-selected-activities',
        { selectedActivities: newSelected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedActivities(newSelected);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des activités sélectionnées', error);
      alert('Erreur lors de la mise à jour de vos activités');
    }
  }

  useEffect(() => {
    fetchActivities();
    if (isAuthenticated) {
      fetchUserSelectedActivities();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Filtrer et trier les activités du jour sélectionné
  const currentDayActivities = activities
    .filter(act => act.jour === selectedDay)
    .sort((a, b) => {
      const parseHeure = h => h ? h.replace('h', ':') : '';
      const toMinutes = h => {
        if (!h) return 0;
        const [hh, mm] = parseHeure(h).split(':');
        return parseInt(hh, 10) * 60 + (parseInt(mm, 10) || 0);
      };
      return toMinutes(a.heureDebut) - toMinutes(b.heureDebut);
    });

  // Les activités obligatoires du jour
  const activitesObligatoires = currentDayActivities.filter(act => act.type === 'obligatoire');
  // Les activités optionnelles choisies par l'utilisateur pour ce jour (enregistrées)
  const activitesOptionnellesChoisies = currentDayActivities.filter(
    act => act.type === 'optionnelle' && selectedActivities.includes(act._id)
  );

  return (
    <div className="programme-page-container">
      <h2 className="programme-title">Mon programme personnalisé</h2>
      {/* Boutons de sélection de jour */}
      <div className="jour-selector">
        {joursDisponibles.map(jour => (
          <button
            key={jour}
            className={`jour-btn${jour === selectedDay ? ' active' : ''}`}
            onClick={() => setSelectedDay(jour)}
          >
            Jour {jour}
          </button>
        ))}
      </div>

      {/* Timeline verticale simple des activités */}
      <div className="activities-timeline-vertical">
        {currentDayActivities.length === 0 ? (
          <div className="no-activities">
            <p>Aucune activité programmée pour ce jour</p>
          </div>
        ) : (
          <ul className="timeline-list">
            {/* Affichage des activités obligatoires */}
            {activitesObligatoires.map((activity, index) => (
              <li key={activity._id} className="timeline-item obligatoire">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-time">{activity.heureDebut}{activity.heureFin && ` - ${activity.heureFin}`}</div>
                  <div className="timeline-title-row">
                    <h3 className="timeline-title">{activity.titre}</h3>
                    <span className="timeline-badge obligatoire">Obligatoire</span>
                  </div>
                  <p className="timeline-desc">{activity.description}</p>
                  {activity.fichierPdf && (
                    <a
                      href={`http://localhost:5000${activity.fichierPdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="timeline-pdf-link"
                    >
                      Voir le document
                    </a>
                  )}
                  <div className="obligatoire-notice">Activité obligatoire pour tous</div>
                </div>
              </li>
            ))}
            {/* Affichage des activités optionnelles choisies (une seule par créneau, déjà enregistrée) */}
            {activitesOptionnellesChoisies.map((activity, index) => (
              <li key={activity._id} className="timeline-item optionnelle">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-time">{activity.heureDebut}{activity.heureFin && ` - ${activity.heureFin}`}</div>
                  <div className="timeline-title-row">
                    <h3 className="timeline-title">{activity.titre}</h3>
                    <span className="timeline-badge optionnelle">Optionnelle (choisie)</span>
                  </div>
                  <p className="timeline-desc">{activity.description}</p>
                  {activity.fichierPdf && (
                    <a
                      href={`http://localhost:5000${activity.fichierPdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="timeline-pdf-link"
                    >
                      Voir le document
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Activités choisies pour ce jour (programme personnalisé) */}
      {isAuthenticated && (activitesObligatoires.length > 0 || activitesOptionnellesChoisies.length > 0) && (
        <div className="selected-summary">
          <h3>📌 Mon programme pour le jour {selectedDay}</h3>
          <ul>
            {activitesObligatoires.map(act => (
              <li key={act._id}><b>{act.titre}</b> <span style={{color:'#764ba2'}}>(Obligatoire)</span></li>
            ))}
            {activitesOptionnellesChoisies.map(act => (
              <li key={act._id}>{act.titre} <span style={{color:'#d4af37'}}>(Choix)</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProgrammePage;

