import React from 'react';
import '../styles/LegalPages.css';

const TermsOfServicePage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Conditions Générales d'Utilisation</h1>
        <p className="last-updated">Dernière mise à jour : 1er décembre 2025</p>

        <section className="legal-section">
          <h2>1. Présentation du Service</h2>
          <p>
            Le site web <strong>gj-camp.fr</strong> (ci-après « le Site ») est édité par 
            <strong> Génération Josué</strong>, un mouvement de jeunesse au sein de la 
            <strong> Communauté des Refuges pour Tous (CRPT)</strong>.
          </p>
          <p>
            Le Site permet aux utilisateurs de :
          </p>
          <ul>
            <li>Créer un compte utilisateur</li>
            <li>S'inscrire au camp annuel de Génération Josué</li>
            <li>Inscrire des invités (amis, famille)</li>
            <li>Effectuer des paiements en ligne (montants flexibles de 20€ à 120€)</li>
            <li>Consulter leur tableau de bord avec l'état de leurs inscriptions</li>
            <li>Recevoir des informations via newsletter</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. Acceptation des Conditions</h2>
          <div className="important-box">
            <p>
              L'utilisation du Site implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU). 
              En créant un compte ou en vous inscrivant au camp, vous reconnaissez avoir lu, compris et accepté ces CGU.
            </p>
          </div>
          <p>
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Création de Compte</h2>
          
          <h3>3.1 Conditions d'éligibilité</h3>
          <ul>
            <li>Le camp est destiné aux <strong>jeunes âgés de 18 à 30 ans</strong></li>
            <li>Vous devez fournir des informations exactes et à jour</li>
            <li>Chaque utilisateur ne peut créer qu'un seul compte</li>
            <li>Les mineurs doivent obtenir l'autorisation parentale</li>
          </ul>

          <h3>3.2 Responsabilités de l'utilisateur</h3>
          <ul>
            <li>Maintenir la confidentialité de vos identifiants de connexion</li>
            <li>Informer immédiatement GJ de toute utilisation non autorisée de votre compte</li>
            <li>Vous êtes responsable de toutes les activités effectuées depuis votre compte</li>
            <li>Ne pas partager vos identifiants avec des tiers</li>
          </ul>

          <h3>3.3 Vérification de l'email</h3>
          <p>
            Après création de compte, vous devez vérifier votre adresse email en cliquant sur le lien 
            envoyé par email. Les comptes non vérifiés après 7 jours seront automatiquement supprimés.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Inscription au Camp</h2>
          
          <h3>4.1 Processus d'inscription</h3>
          <ol>
            <li>Créer un compte et vérifier votre email</li>
            <li>Remplir le formulaire d'inscription au camp</li>
            <li>Effectuer un paiement minimum de 20€</li>
            <li>Votre inscription est confirmée après réception du paiement</li>
          </ol>

          <h3>4.2 Tarification</h3>
          <div className="pricing-box">
            <p><strong>Tarif du camp :</strong> 120€ par participant</p>
            <p><strong>Paiement minimum requis :</strong> 20€</p>
            <p><strong>Paiements partiels autorisés :</strong> Oui (minimum 1€ par versement)</p>
          </div>
          <p>
            Vous pouvez effectuer des paiements partiels jusqu'à atteindre le montant total de 120€. 
            Le solde doit être réglé <strong>avant le début du camp</strong>.
          </p>

          <h3>4.3 Inscription d'invités</h3>
          <p>
            Les utilisateurs inscrits peuvent inviter des amis ou membres de leur famille :
          </p>
          <ul>
            <li>Les invités suivent les mêmes règles de tarification (20€ minimum, 120€ total)</li>
            <li>Vous êtes responsable du paiement des inscriptions de vos invités</li>
            <li>Les informations des invités doivent être exactes</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Paiements et Remboursements</h2>
          
          <h3>5.1 Moyens de paiement</h3>
          <p>
            Les paiements sont traités de manière sécurisée via <strong>PayPal</strong>. 
            Vous pouvez payer avec :
          </p>
          <ul>
            <li>Carte bancaire (via PayPal)</li>
            <li>Compte PayPal</li>
          </ul>

          <h3>5.2 Politique de remboursement</h3>
          <div className="refund-policy-box">
            <h4>Annulation par le participant :</h4>
            <ul>
              <li><strong>Plus de 30 jours avant le camp :</strong> Remboursement de 80% du montant payé</li>
              <li><strong>Entre 15 et 30 jours avant :</strong> Remboursement de 50%</li>
              <li><strong>Moins de 15 jours avant :</strong> Aucun remboursement</li>
            </ul>

            <h4>Annulation par Génération Josué :</h4>
            <p>
              En cas d'annulation du camp par GJ (force majeure, nombre insuffisant de participants, etc.), 
              vous serez intégralement remboursé dans un délai de 30 jours.
            </p>
          </div>

          <h3>5.3 Demande de remboursement</h3>
          <p>
            Pour demander un remboursement, envoyez un email à <strong>inscriptions@gj-camp.fr</strong> 
            avec votre numéro d'inscription et la raison de votre annulation.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Utilisation du Site</h2>
          
          <h3>6.1 Usages autorisés</h3>
          <ul>
            <li>Consulter les informations sur le camp</li>
            <li>S'inscrire et gérer vos inscriptions</li>
            <li>Contacter l'équipe organisatrice</li>
            <li>S'abonner à la newsletter</li>
          </ul>

          <h3>6.2 Usages interdits</h3>
          <p>Il est strictement interdit de :</p>
          <ul>
            <li>❌ Utiliser le Site à des fins illégales ou frauduleuses</li>
            <li>❌ Tenter de contourner les mesures de sécurité</li>
            <li>❌ Créer plusieurs comptes pour la même personne</li>
            <li>❌ Partager ou revendre des places d'inscription</li>
            <li>❌ Extraire, copier ou utiliser le contenu du Site sans autorisation</li>
            <li>❌ Diffuser du contenu offensant, diffamatoire ou inapproprié</li>
            <li>❌ Perturber le fonctionnement du Site (spam, attaques, etc.)</li>
          </ul>

          <h3>6.3 Sanctions</h3>
          <p>
            Toute violation de ces règles peut entraîner la suspension ou la suppression définitive de votre compte, 
            sans remboursement des montants payés.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Propriété Intellectuelle</h2>
          <p>
            L'ensemble du contenu du Site (textes, images, logos, vidéos, graphismes, etc.) est la propriété 
            exclusive de Génération Josué ou de ses partenaires, et est protégé par les lois françaises et 
            internationales sur la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, distribution, modification ou utilisation non autorisée est strictement interdite.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Protection des Données</h2>
          <p>
            Vos données personnelles sont traitées conformément à notre 
            <a href="/politique-confidentialite"> Politique de Confidentialité</a> et au RGPD.
          </p>
          <p>Points clés :</p>
          <ul>
            <li>Nous ne vendons jamais vos données</li>
            <li>Vous disposez de droits (accès, rectification, suppression, etc.)</li>
            <li>Vos données sont sécurisées par chiffrement</li>
            <li>Conservation limitée dans le temps</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Disponibilité du Service</h2>
          <p>
            Nous mettons tout en œuvre pour assurer l'accessibilité du Site 24h/24, 7j/7. Toutefois, 
            nous ne pouvons garantir une disponibilité absolue et nous nous réservons le droit :
          </p>
          <ul>
            <li>D'interrompre temporairement le Site pour maintenance</li>
            <li>De modifier ou suspendre certaines fonctionnalités</li>
            <li>D'arrêter le Service avec préavis de 30 jours</li>
          </ul>
          <p>
            Génération Josué ne pourra être tenue responsable des dommages résultant d'une interruption 
            ou d'un dysfonctionnement du Site.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Limitation de Responsabilité</h2>
          <div className="disclaimer-box">
            <h4>⚠️ Avertissement important</h4>
            <p>
              Le Site est fourni "en l'état". Génération Josué ne garantit pas :
            </p>
            <ul>
              <li>L'absence d'erreurs ou de bugs</li>
              <li>La compatibilité avec tous les navigateurs et appareils</li>
              <li>La disponibilité ininterrompue du Service</li>
            </ul>
            <p>
              Génération Josué ne pourra être tenue responsable des dommages directs ou indirects 
              résultant de l'utilisation ou de l'impossibilité d'utiliser le Site, sauf en cas de 
              faute lourde ou intentionnelle.
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>11. Liens Externes</h2>
          <p>
            Le Site peut contenir des liens vers des sites tiers (PayPal, réseaux sociaux, etc.). 
            Nous ne sommes pas responsables du contenu, des politiques de confidentialité ou des 
            pratiques de ces sites externes.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Modification des CGU</h2>
          <p>
            Génération Josué se réserve le droit de modifier les présentes CGU à tout moment. 
            Les utilisateurs seront informés par email des modifications importantes.
          </p>
          <p>
            La date de dernière mise à jour est indiquée en haut de cette page. 
            Continuer à utiliser le Site après modification vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Droit Applicable et Juridiction</h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de litige, 
            nous vous encourageons à nous contacter à <strong>contact@gj-camp.fr</strong> 
            pour trouver une solution amiable.
          </p>
          <p>
            À défaut d'accord amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Contact</h2>
          <div className="contact-box">
            <p><strong>Pour toute question concernant ces CGU :</strong></p>
            <p>📧 Email : contact@gj-camp.fr</p>
            <p>📍 Adresse : [Adresse complète à compléter]</p>
            <p>📞 Téléphone : [Numéro à compléter]</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>15. Dispositions Finales</h2>
          <p>
            Si une disposition des présentes CGU est jugée invalide ou inapplicable, 
            les autres dispositions resteront en vigueur.
          </p>
          <p>
            Le fait pour Génération Josué de ne pas exercer un droit prévu par les CGU 
            ne constitue pas une renonciation à ce droit.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
