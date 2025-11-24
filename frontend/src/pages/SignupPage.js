import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/App.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    churchWebsite: '',
  });
  const [error, setError] = useState('');
  const { signup, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.churchWebsite
    );
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container">
      <div className="hero" style={{ paddingTop: '60px' }}>
        <div className="form-container">
          <h2>S'INSCRIRE</h2>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Site web de l'église (optionnel)</label>
              <input
                type="url"
                name="churchWebsite"
                value={formData.churchWebsite}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>
          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            Déjà inscrit? <Link to="/login">Se connecter ici</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
