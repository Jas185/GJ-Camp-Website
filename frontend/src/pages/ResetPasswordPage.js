import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(response.data.message);
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="hero" style={{ paddingTop: '60px' }}>
        <div className="form-container">
          <h2>🔐 NOUVEAU MOT DE PASSE</h2>

          {!success ? (
            <>
              <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                Créez un nouveau mot de passe sécurisé pour votre compte.
              </p>

              {error && <div className="form-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retapez votre mot de passe"
                    required
                    disabled={loading}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      style={{ marginRight: '8px' }}
                    />
                    Afficher le mot de passe
                  </label>
                </div>

                <div style={{ 
                  backgroundColor: '#d1ecf1', 
                  border: '1px solid #bee5eb', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  <strong style={{ color: '#0c5460' }}>💡 Conseils pour un mot de passe sécurisé :</strong>
                  <ul style={{ marginBottom: 0, paddingLeft: '20px', color: '#0c5460', marginTop: '8px' }}>
                    <li>Au moins 6 caractères (8+ recommandé)</li>
                    <li>Mélange de lettres, chiffres et symboles</li>
                    <li>Évitez les mots du dictionnaire</li>
                    <li>Différent de vos anciens mots de passe</li>
                  </ul>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={loading}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {loading ? '⏳ Réinitialisation...' : '✅ Réinitialiser mon mot de passe'}
                </button>
              </form>

              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                <Link to="/login">← Retour à la connexion</Link>
              </div>
            </>
          ) : (
            <>
              <div className="form-success" style={{ marginBottom: '20px', fontSize: '16px' }}>
                {success}
              </div>

              <div style={{ 
                backgroundColor: '#d4edda', 
                border: '1px solid #c3e6cb', 
                borderRadius: '8px', 
                padding: '20px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#155724', fontSize: '16px' }}>
                  ✅ Votre mot de passe a été modifié avec succès !
                </p>
                <p style={{ margin: '10px 0 0 0', color: '#155724' }}>
                  Redirection vers la page de connexion dans 3 secondes...
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link to="/login">
                  <button className="btn-primary">
                    Se connecter maintenant
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
