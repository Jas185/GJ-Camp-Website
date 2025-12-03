/**
 * Script de test pour vérifier l'upload et l'affichage du logo
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testLogoSystem() {
  console.log('🧪 Test du système de logo\n');
  
  try {
    // Test 1: Récupérer les settings (sans auth)
    console.log('1️⃣ Test GET /api/settings (public)...');
    const getResponse = await axios.get(`${API_URL}/settings`);
    console.log('✅ Settings récupérés:', {
      success: getResponse.data.success,
      hasLogoUrl: !!getResponse.data.settings.logoUrl,
      logoUrl: getResponse.data.settings.logoUrl,
      logoWidth: getResponse.data.settings.logoWidth,
      logoHeight: getResponse.data.settings.logoHeight
    });
    console.log('');
    
    // Test 2: Vérifier si le fichier uploadé existe
    if (getResponse.data.settings.logoUrl) {
      console.log('2️⃣ Test accès au fichier logo...');
      try {
        const logoResponse = await axios.get(`http://localhost:5000${getResponse.data.settings.logoUrl}`);
        console.log('✅ Logo accessible:', {
          status: logoResponse.status,
          contentType: logoResponse.headers['content-type'],
          size: logoResponse.headers['content-length']
        });
      } catch (error) {
        console.log('❌ Logo non accessible:', error.message);
      }
    } else {
      console.log('2️⃣ Aucun logo uploadé pour le moment');
    }
    console.log('');
    
    console.log('✅ Tests terminés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

// Exécuter les tests
testLogoSystem();
