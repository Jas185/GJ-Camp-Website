import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/App.css';

const DataManagementPage = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(user?.marketingConsent || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '80px' }}>
        <div className="form-container">
          <h2>Accès refusé</h2>
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleExportData = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.get('/api/user/data/export', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Télécharger le fichier JSON
      const dataStr = JSON.stringify(response.data.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mes-donnees-gj-camp-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage('✅ Vos données ont été exportées avec succès !');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'export des données');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConsents = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.put('/api/user/consents/update', 
        { marketingConsent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Vos préférences de consentement ont été mises à jour !');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.delete('/api/user/account/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { confirmDelete: true }
      });

      setMessage('✅ Votre compte a été supprimé. Vous allez être déconnecté...');
      
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="form-container" style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--color-red)' }}>
          Gestion de mes données personnelles
        </h1>

        {message && <div className="form-success" style={{ marginBottom: '20px' }}>{message}</div>}
        {error && <div className="form-error" style={{ marginBottom: '20px' }}>{error}</div>}

        {/* Section Export des données */}
        <div style={{ marginBottom: '40px', padding: '25px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h2 style={{ color: 'var(--color-red)', fontSize: '20px', marginBottom: '15px' }}>
            📥 Télécharger mes données
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            Conformément au RGPD, vous avez le droit d'obtenir une copie de toutes vos données personnelles 
            dans un format structuré et lisible par machine (JSON).
          </p>
          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
            Cet export inclut : profil, inscriptions, historique des consentements, activités sélectionnées.
          </p>
          <button 
            onClick={handleExportData} 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Export en cours...' : 'Télécharger mes données'}
          </button>
        </div>

        {/* Section Consentements */}
        <div style={{ marginBottom: '40px', padding: '25px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h2 style={{ color: 'var(--color-red)', fontSize: '20px', marginBottom: '15px' }}>
            ⚙️ Gérer mes consentements
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  style={{ marginRight: '10px', cursor: 'not-allowed' }}
                />
                <span>
                  <strong>Traitement des données personnelles</strong> (obligatoire)<br/>
                  <small style={{ color: '#666' }}>
                    Nécessaire pour utiliser les services GJ Camp. Ne peut pas être désactivé.
                  </small>
                </span>
              </label>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '15px' }}>
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                />
                <span>
                  <strong>Communications marketing</strong> (optionnel)<br/>
                  <small style={{ color: '#666' }}>
                    Recevoir des newsletters et informations sur les événements GJ Camp.
                  </small>
                </span>
              </label>
            </div>
          </div>

          <button 
            onClick={handleUpdateConsents} 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Mise à jour...' : 'Enregistrer mes préférences'}
          </button>

          <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
            Dernière acceptation de la politique : {user.privacyPolicyAcceptedAt 
              ? new Date(user.privacyPolicyAcceptedAt).toLocaleDateString('fr-FR')
              : 'Non disponible'}
          </p>
        </div>

        {/* Section Suppression du compte */}
        <div style={{ marginBottom: '40px', padding: '25px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
          <h2 style={{ color: '#856404', fontSize: '20px', marginBottom: '15px' }}>
            🗑️ Supprimer mon compte
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#856404' }}>
            <strong>Attention :</strong> Cette action est irréversible. Toutes vos données personnelles seront 
            anonymisées et vous ne pourrez plus accéder à votre compte.
          </p>
          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#856404' }}>
            Les données liées aux inscriptions et paiements seront conservées de manière anonyme pour 
            nos obligations comptables légales (3 ans).
          </p>

          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Demander la suppression de mon compte
            </button>
          ) : (
            <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
              <p style={{ marginBottom: '15px', color: '#721c24', fontWeight: 'bold' }}>
                ⚠️ Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Suppression...' : 'Oui, supprimer définitivement'}
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informations légales */}
        <div style={{ padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px', fontSize: '14px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>ℹ️ Vos droits RGPD</h3>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Droit d'accès :</strong> Télécharger une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> Modifier vos informations depuis votre profil</li>
            <li><strong>Droit à l'effacement :</strong> Supprimer votre compte</li>
            <li><strong>Droit de portabilité :</strong> Recevoir vos données au format JSON</li>
            <li><strong>Droit d'opposition :</strong> Refuser le marketing (décochez ci-dessus)</li>
          </ul>
          <p style={{ marginTop: '15px' }}>
            Pour toute question : <a href="mailto:dpo@gj-camp.fr" style={{ color: 'var(--color-red)' }}>dpo@gj-camp.fr</a>
          </p>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;
