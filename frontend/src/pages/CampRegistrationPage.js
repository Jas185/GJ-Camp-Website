import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/App.css';

const CampRegistrationPage = () => {
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

      setMessage(response.data.message || 'Inscription réussie !');
      
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="registration-page-wrapper">
        <div className="registration-page">
          <div className="registration-card">
            <div className="registration-card-inner">
              <h1 className="form-title">Inscription Camp</h1>
              <p className="form-subtitle">Vous devez être connecté pour vous inscrire.</p>
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page-wrapper">
      <div className="registration-page">
        <div className="registration-card">
        <div className="registration-card-inner">
          <div className="form-header">
            <div className="form-logo">
              <img src="/images/logo.jpg" alt="GJ Camp Logo" />
            </div>
            <div className="form-header-text">
              <h1 className="form-title">Inscription</h1>
              <h2 className="form-subtitle-main">Camp GJ</h2>
            </div>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

        <form className="camp-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Informations Personnelles</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Nom *</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Prénom *</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Date de naissance *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Sexe *</label>
                <div className="radio-group-inline">
                  <label className="radio-label">
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
                  <label className="radio-label">
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

          <div className="form-section">
            <h3 className="section-title">Coordonnées</h3>
            
            <div className="form-field">
              <label>Adresse *</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Rue, ville, code postal"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Refuge & Allergies</h3>
            
            <div className="form-field">
              <label>Mon refuge CRPT *</label>
              <select name="refuge" value={form.refuge} onChange={handleChange} required>
                <option value="">-- Sélectionner --</option>
                <option value="Lorient">Lorient</option>
                <option value="Laval">Laval</option>
                <option value="Amiens">Amiens</option>
                <option value="Nantes">Nantes</option>
                <option value="Autres">Autres</option>
              </select>
            </div>

            <div className="form-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasAllergies"
                  checked={form.hasAllergies}
                  onChange={handleChange}
                />
                <span>Avez-vous des allergies ?</span>
              </label>
            </div>

            {form.hasAllergies && (
              <div className="form-field">
                <label>Précisez vos allergies *</label>
                <textarea
                  name="allergyDetails"
                  value={form.allergyDetails}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Décrivez vos allergies..."
                  required={form.hasAllergies}
                />
              </div>
            )}
          </div>

          <div className="form-section payment-section">
            <h3 className="section-title">Frais d'inscription</h3>
            <div className="payment-info">
              <p className="total-price">Total : <strong>120€</strong></p>
            </div>
            
            <div className="form-field">
              <label>Montant à payer maintenant *</label>
              <div className="payment-buttons">
                <button
                  type="button"
                  className={`payment-btn ${form.amountPaid === 20 ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, amountPaid: 20 }))}
                >
                  <span>20€</span>
                </button>
                <button
                  type="button"
                  className={`payment-btn ${form.amountPaid === 60 ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, amountPaid: 60 }))}
                >
                  <span>60€</span>
                </button>
                <button
                  type="button"
                  className={`payment-btn ${form.amountPaid === 80 ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, amountPaid: 80 }))}
                >
                  <span>80€</span>
                </button>
                <button
                  type="button"
                  className={`payment-btn ${form.amountPaid === 120 ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, amountPaid: 120 }))}
                >
                  <span>120€ (Total)</span>
                </button>
              </div>
            </div>

            <div className="payment-summary">
              <div className="summary-row">
                <span>Montant sélectionné :</span>
                <strong>{form.amountPaid}€</strong>
              </div>
              <div className="summary-row remaining">
                <span>Reste à payer :</span>
                <strong>{120 - form.amountPaid}€</strong>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              <span>{loading ? 'Inscription en cours...' : "S'inscrire"}</span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CampRegistrationPage;
