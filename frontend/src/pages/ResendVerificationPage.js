import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.css';

const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/resend-verification', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="hero" style={{ paddingTop: '60px' }}>
        <div className="form-container">
          <h2>📧 RENVOYER L'EMAIL DE VÉRIFICATION</h2>
          
          <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
            Vous n'avez pas reçu l'email de vérification ? Entrez votre adresse email ci-dessous.
          </p>

          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Envoi en cours...' : '📨 Renvoyer l\'email'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
