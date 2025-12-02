import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/LegalPages.css';

const DataManagementPage = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Télécharger mes données
  const handleDownloadData = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.get('/api/auth/my-data', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mes-donnees-gj-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ Vos données ont été téléchargées avec succès !');
    } catch (err) {
      setError('❌ Erreur lors du téléchargement de vos données. Veuillez réessayer.');
      console.error('Erreur téléchargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  // Demander la suppression de mon compte
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ ATTENTION : Cette action est irréversible !\n\n' +
      'En supprimant votre compte, vous perdrez :\n' +
      '- Toutes vos inscriptions au camp\n' +
      '- Les inscriptions de vos invités\n' +
      '- Votre historique de paiements\n' +
      '- Tous vos accès au site\n\n' +
      'Les paiements déjà effectués ne seront PAS remboursés automatiquement.\n\n' +
      'Êtes-vous absolument sûr(e) de vouloir continuer ?'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      '⚠️ DERNIÈRE CONFIRMATION :\n\n' +
      'Tapez OK pour confirmer définitivement la suppression de votre compte.'
    );

    if (!doubleConfirm) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.delete('/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Votre demande de suppression a été enregistrée. Vous recevrez un email de confirmation.');
      
      // Déconnexion automatique après 3 secondes
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }, 3000);
    } catch (err) {
      setError('❌ Erreur lors de la suppression du compte. Contactez-nous à dpo@gj-camp.fr');
      console.error('Erreur suppression compte:', err);
    } finally {
      setLoading(false);
    }
  };

  // Demander une correction de données
  const handleRequestCorrection = () => {
    window.location.href = `mailto:dpo@gj-camp.fr?subject=Demande de rectification de données&body=Bonjour,%0D%0A%0D%0AJe souhaite rectifier les informations suivantes dans mon compte :%0D%0A%0D%0ANom : ${user?.firstName} ${user?.lastName}%0D%0AEmail : ${user?.email}%0D%0A%0D%0ADonnées à corriger :%0D%0A[Décrivez les modifications souhaitées]%0D%0A%0D%0ACordialement`;
  };

  // Demander l'opposition au traitement
  const handleObjectToProcessing = () => {
    window.location.href = `mailto:dpo@gj-camp.fr?subject=Opposition au traitement de mes données&body=Bonjour,%0D%0A%0D%0AJe m'oppose au traitement de mes données personnelles pour :%0D%0A%0D%0A☐ Recevoir la newsletter%0D%0A☐ Communications marketing%0D%0A☐ Autre (précisez) :%0D%0A%0D%0ANom : ${user?.firstName} ${user?.lastName}%0D%0AEmail : ${user?.email}%0D%0A%0D%0ACordialement`;
  };

  // Demander la limitation du traitement
  const handleLimitProcessing = () => {
    window.location.href = `mailto:dpo@gj-camp.fr?subject=Demande de limitation du traitement&body=Bonjour,%0D%0A%0D%0AJe souhaite limiter le traitement de mes données personnelles.%0D%0A%0D%0ANom : ${user?.firstName} ${user?.lastName}%0D%0AEmail : ${user?.email}%0D%0ARaison de la demande : [Expliquez votre demande]%0D%0A%0D%0ACordialement`;
  };

  if (!user) {
    return (
      <div className="legal-page">
        <div className="legal-container">
          <h1>Gestion de Mes Données</h1>
          <div className="important-box">
            <p>⚠️ Vous devez être connecté pour accéder à cette page.</p>
          </div>
          <a href="/connexion" className="action-btn">Se connecter</a>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Gestion de Mes Données Personnelles</h1>
        <p className="last-updated">
          Bonjour <strong>{user.firstName} {user.lastName}</strong>, 
          gérez vos données RGPD depuis cette page.
        </p>

        {message && (
          <div className="note" style={{ background: '#d4edda', borderColor: '#28a745', color: '#155724' }}>
            {message}
          </div>
        )}

        {error && (
          <div className="note" style={{ background: '#f8d7da', borderColor: '#dc3545', color: '#721c24' }}>
            {error}
          </div>
        )}

        <section className="legal-section">
          <h2>Vos Droits RGPD</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez 
            de plusieurs droits concernant vos données personnelles. Utilisez les actions ci-dessous 
            pour exercer vos droits.
          </p>
        </section>

        {/* Droit d'accès */}
        <div className="action-card">
          <h3>🔍 Droit d'Accès - Télécharger Mes Données</h3>
          <p>
            Obtenez une copie complète de toutes les données personnelles que nous détenons sur vous 
            au format JSON (lisible et portable).
          </p>
          <p><strong>Inclus :</strong> Informations de profil, inscriptions au camp, historique de paiements, données invités.</p>
          <button 
            onClick={handleDownloadData} 
            className="action-btn"
            disabled={loading}
          >
            {loading ? '⏳ Téléchargement...' : '📥 Télécharger Mes Données'}
          </button>
        </div>

        {/* Droit de rectification */}
        <div className="action-card">
          <h3>✏️ Droit de Rectification - Modifier Mes Informations</h3>
          <p>
            Vous avez détecté une erreur dans vos informations ? Demandez la correction de vos données 
            (nom, email, téléphone, adresse, etc.).
          </p>
          <p><strong>Délai de réponse :</strong> 1 mois maximum.</p>
          <button 
            onClick={handleRequestCorrection} 
            className="action-btn"
            disabled={loading}
          >
            ✉️ Demander une Rectification
          </button>
        </div>

        {/* Droit à l'effacement */}
        <div className="action-card">
          <h3>🗑️ Droit à l'Effacement - Supprimer Mon Compte</h3>
          <div className="disclaimer-box">
            <h4>⚠️ ATTENTION - Action Irréversible</h4>
            <p>
              La suppression de votre compte entraînera la perte définitive de :
            </p>
            <ul>
              <li>❌ Toutes vos inscriptions au camp</li>
              <li>❌ Les inscriptions de vos invités</li>
              <li>❌ Votre historique de paiements</li>
              <li>❌ Vos accès au site</li>
            </ul>
            <p>
              <strong>Les paiements déjà effectués ne seront PAS remboursés automatiquement.</strong> 
              Si vous souhaitez un remboursement, contactez-nous AVANT de supprimer votre compte.
            </p>
          </div>
          <button 
            onClick={handleDeleteAccount} 
            className="action-btn danger"
            disabled={loading}
          >
            {loading ? '⏳ Suppression...' : '🗑️ Supprimer Mon Compte Définitivement'}
          </button>
        </div>

        {/* Droit d'opposition */}
        <div className="action-card">
          <h3>⛔ Droit d'Opposition - Refuser Certains Traitements</h3>
          <p>
            Vous pouvez vous opposer au traitement de vos données à des fins de marketing, 
            prospection commerciale ou statistiques.
          </p>
          <p><strong>Exemples :</strong> Ne plus recevoir la newsletter, refuser les communications marketing.</p>
          <button 
            onClick={handleObjectToProcessing} 
            className="action-btn"
            disabled={loading}
          >
            🚫 M'opposer au Traitement
          </button>
        </div>

        {/* Droit à la limitation */}
        <div className="action-card">
          <h3>⏸️ Droit à la Limitation - Geler le Traitement</h3>
          <p>
            Demandez la suspension temporaire du traitement de vos données dans certaines situations 
            (contestation de l'exactitude, traitement illicite, etc.).
          </p>
          <p><strong>Effet :</strong> Vos données seront conservées mais plus utilisées temporairement.</p>
          <button 
            onClick={handleLimitProcessing} 
            className="action-btn"
            disabled={loading}
          >
            ⏸️ Limiter le Traitement
          </button>
        </div>

        <section className="legal-section">
          <h2>📋 Informations Complémentaires</h2>
          
          <h3>Délais de Réponse</h3>
          <p>
            Nous nous engageons à traiter toute demande dans un délai maximum d'<strong>1 mois</strong> 
            à compter de la réception de votre demande. Ce délai peut être prolongé de 2 mois si nécessaire, 
            auquel cas nous vous en informerons.
          </p>

          <h3>Vérification d'Identité</h3>
          <p>
            Pour garantir la sécurité de vos données, nous pouvons vous demander de prouver votre identité 
            avant de traiter certaines demandes (copie de pièce d'identité pour suppression de compte par exemple).
          </p>

          <h3>Réclamation CNIL</h3>
          <p>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation 
            auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
          </p>
          <div className="contact-box">
            <p><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{color: '#ffd700'}}>www.cnil.fr</a></p>
            <p><strong>Adresse :</strong> CNIL - 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
            <p><strong>Téléphone :</strong> 01 53 73 22 22</p>
          </div>

          <h3>Contact Délégué à la Protection des Données (DPO)</h3>
          <div className="info-box">
            <p>Pour toute question concernant vos données personnelles :</p>
            <p><strong>📧 Email DPO :</strong> dpo@gj-camp.fr</p>
            <p><strong>📧 Email Contact :</strong> contact@gj-camp.fr</p>
            <p><strong>⏰ Délai de réponse :</strong> 48h ouvrées</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>📖 Documents Légaux</h2>
          <p>Consultez nos autres documents légaux :</p>
          <ul>
            <li><a href="/politique-confidentialite">📄 Politique de Confidentialité</a></li>
            <li><a href="/conditions-utilisation">📜 Conditions Générales d'Utilisation</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DataManagementPage;
