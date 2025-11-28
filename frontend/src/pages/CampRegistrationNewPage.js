import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ModernLogo from '../components/ModernLogo';
import { UserIcon, MailIcon, HomeIcon, CreditCardIcon } from '../components/Icons';
import '../styles/RegistrationNew.css';

const CampRegistrationNewPage = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    sex: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    refuge: '',
    hasAllergies: false,
    allergyDetails: '',
    amountPaid: 20
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (!token) {
        setError('Vous devez être connecté pour vous inscrire au camp.');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/registration', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(response.data.message || 'Inscription réussie ! Redirection...');
      
      setTimeout(() => {
        navigate('/suivi-inscriptions');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="new-registration-container">
        <div className="new-registration-box">
          <div className="new-header">
            <ModernLogo variant={7} size="large" />
            <h1>Inscription Camp GJ</h1>
          </div>
          <p className="new-message">Vous devez être connecté pour vous inscrire.</p>
          <button className="new-btn-login" onClick={() => navigate('/login')}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="new-registration-container">
      <div className="new-registration-box">
        <div className="new-header">
          <ModernLogo variant={7} size="large" />
          <div className="new-header-text">
            <h1>Camp GJ 2025</h1>
            <p>Formulaire d'inscription</p>
          </div>
        </div>

        {message && <div className="new-alert new-alert-success">{message}</div>}
        {error && <div className="new-alert new-alert-error">{error}</div>}

        <form className="new-form" onSubmit={handleSubmit}>
          {/* Informations personnelles */}
          <div className="new-section">
            <div className="new-section-header">
              <span className="new-section-icon"><UserIcon size={32} color="#667eea" /></span>
              <h2>Informations personnelles</h2>
            </div>
            
            <div className="new-grid">
              <div className="new-input-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
              
              <div className="new-input-group">
                <label>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div className="new-grid">
              <div className="new-input-group">
                <label>Date de naissance</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="new-input-group">
                <label>Sexe</label>
                <div className="new-radio-group">
                  <label className="new-radio">
                    <input
                      type="radio"
                      name="sex"
                      value="M"
                      checked={form.sex === 'M'}
                      onChange={handleChange}
                      required
                    />
                    <span>Masculin</span>
                  </label>
                  <label className="new-radio">
                    <input
                      type="radio"
                      name="sex"
                      value="F"
                      checked={form.sex === 'F'}
                      onChange={handleChange}
                      required
                    />
                    <span>Féminin</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="new-section">
            <div className="new-section-header">
              <span className="new-section-icon"><MailIcon size={32} color="#667eea" /></span>
              <h2>Coordonnées</h2>
            </div>
            
            <div className="new-input-group">
              <label>Adresse complète</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Rue, ville, code postal"
              />
            </div>

            <div className="new-grid">
              <div className="new-input-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="06 12 34 56 78"
                />
              </div>
              
              <div className="new-input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                />
              </div>
            </div>
          </div>

          {/* Refuge et allergies */}
          <div className="new-section">
            <div className="new-section-header">
              <span className="new-section-icon"><HomeIcon size={32} color="#667eea" /></span>
              <h2>Refuge & Allergies</h2>
            </div>
            
            <div className="new-input-group">
              <label>Mon refuge CRPT</label>
              <select name="refuge" value={form.refuge} onChange={handleChange} required>
                <option value="">-- Sélectionner votre refuge --</option>
                <option value="Lorient">Lorient</option>
                <option value="Laval">Laval</option>
                <option value="Amiens">Amiens</option>
                <option value="Nantes">Nantes</option>
                <option value="Autres">Autres</option>
              </select>
            </div>

            <div className="new-checkbox-group">
              <label className="new-checkbox">
                <input
                  type="checkbox"
                  name="hasAllergies"
                  checked={form.hasAllergies}
                  onChange={handleChange}
                />
                <span>J'ai des allergies alimentaires ou médicales</span>
              </label>
            </div>

            {form.hasAllergies && (
              <div className="new-input-group">
                <label>Précisez vos allergies</label>
                <textarea
                  name="allergyDetails"
                  value={form.allergyDetails}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Décrivez vos allergies en détail..."
                  required={form.hasAllergies}
                />
              </div>
            )}
          </div>

          {/* Paiement */}
          <div className="new-section new-section-payment">
            <div className="new-section-header">
              <span className="new-section-icon"><CreditCardIcon size={32} color="#667eea" /></span>
              <h2>Frais d'inscription</h2>
            </div>
            
            <div className="new-payment-info">
              <div className="new-payment-total">
                <span>Montant total</span>
                <strong>120€</strong>
              </div>
              <p className="new-payment-note">Vous pouvez payer en plusieurs fois</p>
            </div>

            <div className="new-input-group">
              <label>Montant à payer maintenant</label>
              <div className="new-payment-options">
                {[20, 60, 80, 120].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={`new-payment-option ${form.amountPaid === amount ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, amountPaid: amount }))}
                  >
                    <span className="amount">{amount}€</span>
                    {amount === 20 && <span className="label">Minimum</span>}
                    {amount === 120 && <span className="label">Total</span>}
                  </button>
                ))}
              </div>
              
              <div className="new-custom-amount">
                <label>Ou saisissez un montant personnalisé</label>
                <div className="new-amount-input-wrapper">
                  <input
                    type="number"
                    name="amountPaid"
                    value={form.amountPaid}
                    onChange={handleChange}
                    min="20"
                    max="120"
                    step="1"
                    placeholder="Montant (20-120€)"
                  />
                  <span className="currency">€</span>
                </div>
                <p className="new-hint">Montant minimum : 20€ • Maximum : 120€</p>
              </div>
            </div>

            <div className="new-payment-summary">
              <div className="summary-item">
                <span>Montant payé</span>
                <strong>{form.amountPaid}€</strong>
              </div>
              <div className="summary-item remaining">
                <span>Reste à payer</span>
                <strong>{120 - form.amountPaid}€</strong>
              </div>
            </div>
          </div>

          <button type="submit" className="new-btn-submit" disabled={loading}>
            {loading ? '⏳ Inscription en cours...' : '✅ Valider mon inscription'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampRegistrationNewPage;
