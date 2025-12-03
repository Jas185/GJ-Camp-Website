/**
 * Script de test pour l'upload d'image carrousel
 * Usage: node test-upload.js
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

// Remplacez par un vrai token admin (copiez depuis localStorage dans le navigateur)
const ADMIN_TOKEN = 'VOTRE_TOKEN_ICI';

async function testUploadSlide() {
  try {
    console.log('\n🧪 Test d\'upload de slide au carrousel...\n');

    // Créer un fichier test (image fictive)
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'Test image content');

    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    formData.append('title', 'Test Slide');
    formData.append('description', 'Ceci est une slide de test');
    formData.append('order', '0');
    formData.append('imageSize', 'cover');
    formData.append('page', 'home');

    console.log('📤 Envoi de la requête POST /api/carousel...');
    console.log('Headers:', formData.getHeaders());
    
    const response = await axios.post(`${API_URL}/carousel`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });

    console.log('\n✅ Succès!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    // Nettoyer
    fs.unlinkSync(testImagePath);

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Pas de réponse du serveur');
    }
  }
}

console.log('⚠️  INSTRUCTIONS:');
console.log('1. Ouvrez le navigateur et connectez-vous en tant qu\'admin');
console.log('2. Ouvrez la console (F12)');
console.log('3. Tapez: localStorage.getItem("token")');
console.log('4. Copiez le token (sans les guillemets)');
console.log('5. Remplacez VOTRE_TOKEN_ICI dans ce script');
console.log('6. Relancez: node test-upload.js\n');

if (ADMIN_TOKEN === 'VOTRE_TOKEN_ICI') {
  console.log('❌ Veuillez d\'abord configurer le token admin!\n');
  process.exit(1);
}

testUploadSlide();
