import React from 'react';
import '../styles/LegalPages.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Politique de Confidentialité</h1>
        <p className="last-updated">Dernière mise à jour : 1er décembre 2025</p>

        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            La présente Politique de Confidentialité décrit la manière dont <strong>Génération Josué</strong> (ci-après « nous », « notre » ou « GJ ») 
            collecte, utilise, partage et protège les informations personnelles des utilisateurs de notre site web <strong>gj-camp.fr</strong> 
            (ci-après le « Site »).
          </p>
          <p>
            Nous nous engageons à protéger votre vie privée et à traiter vos données personnelles de manière transparente, 
            conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi française Informatique et Libertés.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Responsable du Traitement</h2>
          <div className="info-box">
            <p><strong>Organisme :</strong> Communauté des Refuges pour Tous (CRPT) - Génération Josué</p>
            <p><strong>Adresse :</strong> [Adresse complète à compléter]</p>
            <p><strong>Email :</strong> contact@gj-camp.fr</p>
            <p><strong>Téléphone :</strong> [Numéro à compléter]</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>3. Données Personnelles Collectées</h2>
          
          <h3>3.1 Données d'inscription</h3>
          <ul>
            <li>Prénom et nom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone</li>
            <li>Date de naissance</li>
            <li>Adresse postale</li>
            <li>Sexe</li>
            <li>Refuge CRPT d'appartenance</li>
            <li>Informations médicales (allergies uniquement)</li>
          </ul>

          <h3>3.2 Données de paiement</h3>
          <ul>
            <li>Montants des transactions</li>
            <li>Identifiants de transaction PayPal (anonymisés)</li>
            <li>Statut de paiement</li>
          </ul>
          <p className="note">
            ⚠️ <strong>Note importante :</strong> Nous ne stockons JAMAIS vos coordonnées bancaires complètes. 
            Les paiements sont traités de manière sécurisée par PayPal, certifié PCI-DSS.
          </p>

          <h3>3.3 Données de navigation</h3>
          <ul>
            <li>Adresse IP</li>
            <li>Type de navigateur</li>
            <li>Pages visitées</li>
            <li>Cookies (avec votre consentement)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Finalités du Traitement</h2>
          <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
          
          <div className="purpose-box">
            <h4>✓ Gestion des inscriptions au camp</h4>
            <p>Base légale : Exécution du contrat</p>
          </div>

          <div className="purpose-box">
            <h4>✓ Traitement des paiements</h4>
            <p>Base légale : Exécution du contrat</p>
          </div>

          <div className="purpose-box">
            <h4>✓ Communication sur les activités et événements</h4>
            <p>Base légale : Consentement / Intérêt légitime</p>
          </div>

          <div className="purpose-box">
            <h4>✓ Gestion de la sécurité alimentaire (allergies)</h4>
            <p>Base légale : Intérêt vital</p>
          </div>

          <div className="purpose-box">
            <h4>✓ Amélioration du site et statistiques anonymes</h4>
            <p>Base légale : Consentement (cookies)</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>5. Destinataires des Données</h2>
          <p>Vos données personnelles peuvent être partagées avec :</p>
          <ul>
            <li><strong>L'équipe d'organisation du camp</strong> : pour la gestion logistique</li>
            <li><strong>Les responsables de refuges CRPT</strong> : pour le suivi des participants</li>
            <li><strong>PayPal</strong> : pour le traitement sécurisé des paiements</li>
            <li><strong>Hébergeur web</strong> : [Nom à compléter] (serveurs situés en UE)</li>
            <li><strong>Service d'emailing</strong> : pour l'envoi de communications (avec consentement)</li>
          </ul>
          <p className="note">
            ℹ️ Nous ne vendons JAMAIS vos données personnelles à des tiers.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Durée de Conservation</h2>
          <table className="data-retention-table">
            <thead>
              <tr>
                <th>Type de données</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Données d'inscription au camp</td>
                <td>3 ans après la dernière participation</td>
              </tr>
              <tr>
                <td>Données de paiement</td>
                <td>10 ans (obligations comptables et fiscales)</td>
              </tr>
              <tr>
                <td>Données de navigation (cookies)</td>
                <td>13 mois maximum</td>
              </tr>
              <tr>
                <td>Compte utilisateur inactif</td>
                <td>Suppression après 3 ans sans connexion</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>7. Vos Droits RGPD</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          
          <div className="rights-grid">
            <div className="right-card">
              <h4>🔍 Droit d'accès</h4>
              <p>Obtenir une copie de vos données personnelles</p>
            </div>
            <div className="right-card">
              <h4>✏️ Droit de rectification</h4>
              <p>Corriger des données inexactes ou incomplètes</p>
            </div>
            <div className="right-card">
              <h4>🗑️ Droit à l'effacement</h4>
              <p>Demander la suppression de vos données</p>
            </div>
            <div className="right-card">
              <h4>⛔ Droit d'opposition</h4>
              <p>Vous opposer au traitement de vos données</p>
            </div>
            <div className="right-card">
              <h4>📦 Droit à la portabilité</h4>
              <p>Recevoir vos données dans un format structuré</p>
            </div>
            <div className="right-card">
              <h4>⏸️ Droit à la limitation</h4>
              <p>Limiter le traitement de vos données</p>
            </div>
          </div>

          <div className="exercise-rights-box">
            <h4>💬 Comment exercer vos droits ?</h4>
            <p>
              Pour exercer l'un de ces droits, contactez-nous par email à <strong>dpo@gj-camp.fr</strong> 
              ou par courrier à l'adresse indiquée ci-dessus. Nous vous répondrons dans un délai maximum d'1 mois.
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la CNIL : 
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>8. Sécurité des Données</h2>
          <p>Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
          <ul>
            <li>✓ Chiffrement HTTPS (SSL/TLS) pour toutes les communications</li>
            <li>✓ Hashage sécurisé des mots de passe (bcrypt)</li>
            <li>✓ Authentification par tokens JWT</li>
            <li>✓ Hébergement sécurisé avec sauvegardes régulières</li>
            <li>✓ Accès restreint aux données (principe du moindre privilège)</li>
            <li>✓ Journalisation des accès administrateurs</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Cookies</h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences 
            via le bandeau de consentement qui apparaît lors de votre première visite.
          </p>
          <p>Types de cookies utilisés :</p>
          <ul>
            <li><strong>Cookies nécessaires :</strong> Authentification, session (obligatoires)</li>
            <li><strong>Cookies analytiques :</strong> Statistiques anonymes (optionnels)</li>
            <li><strong>Cookies marketing :</strong> Publicités ciblées (optionnels)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. Transferts Internationaux</h2>
          <p>
            Vos données sont hébergées et traitées au sein de l'Union Européenne. 
            En cas de recours à PayPal (entreprise américaine), le transfert est encadré par les 
            <strong> Clauses Contractuelles Types</strong> approuvées par la Commission Européenne.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Modifications de la Politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette Politique de Confidentialité à tout moment. 
            Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour. 
            Nous vous encourageons à consulter régulièrement cette page.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Contact</h2>
          <div className="contact-box">
            <p>Pour toute question concernant cette Politique de Confidentialité ou le traitement de vos données :</p>
            <p><strong>Email :</strong> dpo@gj-camp.fr</p>
            <p><strong>Courrier :</strong> DPO - Génération Josué, [Adresse complète]</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
