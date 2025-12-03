/**
 * Script de test pour l'API Carrousel
 * Usage: node test-carousel-api.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test 1: Récupérer les slides (public)
async function testGetSlides() {
  console.log('\n🧪 Test 1: GET /api/carousel (public)');
  try {
    const response = await axios.get(`${API_URL}/carousel`);
    console.log('✅ Succès:', response.data);
    console.log(`   Nombre de slides: ${response.data.slides?.length || 0}`);
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

// Test 2: Vérifier route Settings
async function testGetSettings() {
  console.log('\n🧪 Test 2: GET /api/settings (authentifié)');
  try {
    const response = await axios.get(`${API_URL}/settings`);
    console.log('✅ Succès:', response.data?.success ? 'Settings trouvés' : 'Pas de settings');
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log('✅ Route protégée correctement (auth requise)');
    } else {
      console.error('❌ Erreur:', error.response?.data || error.message);
    }
  }
}

// Test 3: Vérifier serveur backend
async function testHealth() {
  console.log('\n🧪 Test 3: GET /api/health');
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Backend fonctionnel:', response.data.message);
  } catch (error) {
    console.error('❌ Backend inaccessible:', error.message);
    console.log('⚠️ Assurez-vous que le serveur backend tourne sur le port 5000');
  }
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Tests API Carrousel - GJ Camp Website');
  console.log('==========================================');
  
  await testHealth();
  await testGetSlides();
  await testGetSettings();
  
  console.log('\n==========================================');
  console.log('✅ Tests terminés');
}

runAllTests();
