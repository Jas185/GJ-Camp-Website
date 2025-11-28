const Registration = require('../models/Registration');
const User = require('../models/User');

// Créer une inscription au camp
exports.createRegistration = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      sex,
      dateOfBirth,
      address,
      phone,
      refuge,
      hasAllergies,
      allergyDetails,
      amountPaid
    } = req.body;

    // Récupérer l'utilisateur connecté
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Validation du refuge
    const validRefuges = ['Lorient', 'Laval', 'Amiens', 'Nantes', 'Autres'];
    if (!refuge || !validRefuges.includes(refuge)) {
      return res.status(400).json({ message: 'Veuillez sélectionner un refuge CRPT valide.' });
    }

    // Validation du sexe
    if (!sex || !['M', 'F'].includes(sex)) {
      return res.status(400).json({ message: 'Veuillez sélectionner un sexe valide (M ou F).' });
    }

    // Validation du montant payé
    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid < 20 || paid > 120) {
      return res.status(400).json({ message: 'Le montant doit être entre 20€ et 120€.' });
    }

    // Calcul du reste à payer
    const totalPrice = 120;
    const remaining = totalPrice - paid;
    const status = remaining === 0 ? 'paid' : (paid > 0 ? 'partial' : 'unpaid');

    // Si allergies cochées, vérifier que les détails sont fournis
    if (hasAllergies && !allergyDetails) {
      return res.status(400).json({ message: 'Veuillez préciser vos allergies.' });
    }

    // Créer l'inscription
    const registration = new Registration({
      user: user._id,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      sex,
      dateOfBirth,
      address,
      phone,
      refuge,
      hasAllergies: !!hasAllergies,
      allergyDetails: hasAllergies ? allergyDetails : null,
      totalPrice,
      amountPaid: paid,
      amountRemaining: remaining,
      paymentStatus: status
    });

    await registration.save();

    res.status(201).json({
      message: '✅ Inscription au camp enregistrée avec succès !',
      registration
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

// Récupérer les inscriptions de l'utilisateur connecté
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ registrations });
  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer toutes les inscriptions (admin - page de suivi)
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Inscriptions récupérées avec succès',
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des inscriptions:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des inscriptions',
      error: error.message 
    });
  }
};

// Mettre à jour le statut de paiement
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!['unpaid', 'partial', 'paid'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Statut de paiement invalide' });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }

    res.status(200).json({
      message: 'Statut de paiement mis à jour avec succès',
      registration
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
