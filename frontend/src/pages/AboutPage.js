import React from 'react';
import DynamicCarousel from '../components/DynamicCarousel';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Carrousel dynamique pour la page À propos */}
      <DynamicCarousel page="about" height={400} />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <h1>À Propos de Génération Josué</h1>
          <p className="hero-subtitle">Une communauté de jeunes passionnés pour Christ</p>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="about-section mission-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Notre Mission</span>
            <h2>Qui Sommes-Nous ?</h2>
          </div>
          <div className="content-grid">
            <div className="content-text">
              <p className="lead-text">
                <strong>Génération Josué</strong> est le mouvement jeunesse de la <strong>Communauté des Refuges pour Tous (CRPT)</strong>, 
                une église chrétienne évangélique dynamique et accueillante.
              </p>
              <p>
                Notre nom s'inspire de Josué, le successeur de Moïse, qui a conduit le peuple d'Israël dans la Terre Promise. 
                Comme lui, nous sommes une génération appelée à marcher par la foi, à conquérir de nouveaux territoires spirituels 
                et à être des témoins courageux de l'Évangile.
              </p>
              <p>
                Nous croyons que les jeunes ne sont pas seulement l'église de demain, mais aussi l'église d'aujourd'hui. 
                C'est pourquoi nous créons des espaces où chaque jeune peut grandir dans sa foi, développer ses talents 
                et impacter sa génération pour Christ.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat-item">
                <div className="stat-number">5</div>
                <div className="stat-label">Refuges CRPT</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Jeunes engagés</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Ans d'existence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="about-section values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Nos Valeurs</span>
            <h2>Ce Qui Nous Anime</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🙏</div>
              <h3>Foi Vivante</h3>
              <p>Une relation authentique et personnelle avec Jésus-Christ au centre de tout ce que nous faisons.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Fraternité</h3>
              <p>Une communauté où chacun trouve sa place, est accueilli et encouragé dans son parcours spirituel.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔥</div>
              <h3>Passion</h3>
              <p>Un engagement fervent pour la louange, la prière et le service dans la joie et l'excellence.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">📖</div>
              <h3>Enracinement Biblique</h3>
              <p>Une foi fondée sur la Parole de Dieu, avec un enseignement profond et pertinent pour notre génération.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Mission</h3>
              <p>Un cœur pour évangéliser et servir notre monde avec l'amour de Christ.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💪</div>
              <h3>Formation</h3>
              <p>L'équipement des jeunes disciples pour devenir des leaders spirituels influents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CRPT */}
      <section className="about-section crpt-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Notre Église</span>
            <h2>Communauté des Refuges pour Tous (CRPT)</h2>
          </div>
          <div className="content-grid reverse">
            <div className="image-placeholder">
              <div className="placeholder-content">
                <span>🏛️</span>
                <p>Photo CRPT</p>
              </div>
            </div>
            <div className="content-text">
              <p className="lead-text">
                La <strong>CRPT</strong> est une famille d'églises évangéliques implantée en France, 
                avec une vision de faire de chaque membre un disciple engagé et un témoin efficace de l'Évangile.
              </p>
              <h4>Nos Refuges</h4>
              <ul className="refuges-list">
                <li><strong>Lorient</strong> - Bretagne</li>
                <li><strong>Laval</strong> - Pays de la Loire</li>
                <li><strong>Amiens</strong> - Hauts-de-France</li>
                <li><strong>Nantes</strong> - Pays de la Loire</li>
                <li><strong>Et d'autres</strong> - En expansion</li>
              </ul>
              <p>
                Chaque refuge est un lieu d'accueil, de croissance spirituelle et d'impact local, 
                où les familles et les jeunes trouvent un environnement propice à l'épanouissement de leur foi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Camp GJ */}
      <section className="about-section camp-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Notre Camp Annuel</span>
            <h2>Camp Génération Josué</h2>
          </div>
          <div className="content-grid">
            <div className="content-text">
              <p className="lead-text">
                Chaque année, nous organisons un <strong>camp d'été</strong> qui rassemble des centaines de jeunes 
                de tous les refuges CRPT et au-delà.
              </p>
              <h4>Une Expérience Unique</h4>
              <p>
                Le Camp GJ est bien plus qu'un simple séjour : c'est un temps fort de rencontre avec Dieu, 
                d'amitié profonde, de louange intense et d'enseignements qui transforment des vies.
              </p>
              <div className="highlights-box">
                <h5>Points Forts du Camp :</h5>
                <ul>
                  <li>✨ Temps de louange et d'adoration puissants</li>
                  <li>📖 Enseignements bibliques inspirants</li>
                  <li>🎯 Ateliers pratiques et activités créatives</li>
                  <li>⚽ Sports et défis en équipe</li>
                  <li>🌙 Veillées et moments de partage authentiques</li>
                  <li>🙌 Ministère et prière personnalisée</li>
                </ul>
              </div>
              <p>
                Que tu sois en quête de sens, que tu veuilles approfondir ta foi ou simplement vivre 
                une aventure inoubliable avec d'autres jeunes chrétiens, le Camp GJ est fait pour toi !
              </p>
            </div>
            <div className="image-placeholder">
              <div className="placeholder-content">
                <span>🏕️</span>
                <p>Photo du Camp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Vision */}
      <section className="about-section vision-section">
        <div className="container">
          <div className="vision-box">
            <h2>Notre Vision</h2>
            <p className="vision-text">
              "Susciter une génération de jeunes disciples passionnés, enracinés dans la Parole de Dieu, 
              remplis du Saint-Esprit et engagés à transformer leur monde pour la gloire de Christ."
            </p>
            <div className="vision-verse">
              <p className="verse-text">
                « Sois fort et courageux, car c'est toi qui mettras ce peuple en possession du pays 
                que j'ai juré à leurs pères de leur donner. »
              </p>
              <p className="verse-ref">— Josué 1:6</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rejoins-nous */}
      <section className="about-section cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Rejoins L'Aventure !</h2>
            <p>
              Que tu sois de Lorient, Laval, Amiens, Nantes ou d'ailleurs, 
              tu es le bienvenu dans notre famille Génération Josué.
            </p>
            <div className="cta-buttons">
              <a href="/inscription" className="btn-primary-cta">
                S'inscrire au Camp
              </a>
              <a href="/contact" className="btn-secondary-cta">
                Nous Contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
