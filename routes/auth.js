const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const redis = require("../redis/index");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const generateVerificationCode = require("../utils/utils");

// Connexion utilisateur
router.post("/login", async (req, res) => {
  try {
    console.log("Donné de redis : ", redis.get("userData"));
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide." });
    }

    if(user.status !== "validé"){
      return res.status(403).json({
        message: "Veuillez vérifier votre email avant de vous conecter.",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide." });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: "Connexion réussie." });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// Enregistrement d'un nouvel utilisateur
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Un compte existe déjà avec cet email." });
    }

    const newUser = new User({ email, password, name });
    const savedUser = await newUser.save();

    const code = await generateVerificationCode();

    const userData = {
      userName: savedUser.name,
      userEmail: savedUser.email,
      verificationCode: code,
      userPassword: savedUser.password,
    };

    // On stocke les données dans Redis pendant 10 minutes (600 secondes)
    await redis.set(`userData:${email}`, JSON.stringify(userData), "EX", 600);

    const emailHTML = `
      <div style="max-width:600px;margin:0 auto;padding:20px;font-family:Arial,sans-serif;background:#f9f9f9;color:#333;">
        <h2 style="text-align:center;color:#007BFF;">Code de vérification</h2>
        <p>Bonjour,</p>
        <p>Merci pour votre inscription sur notre plateforme.</p>
        <p>Voici votre code de vérification :</p>
        <div style="text-align:center;margin:30px 0;">
          <span style="font-size:32px;font-weight:bold;color:#007BFF;">${code}</span>
        </div>
        <p>Ce code est valide pendant 10 minutes.</p>
        <p style="margin-top:40px;">Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
        <p>— L'équipe Redis App</p>
      </div>
    `;

    await sendEmail(email, "Vérification email", emailHTML);

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

router.post("/verification/:id", async (req, res) => {
  try {
    const { email } = req.body; // 👈 On récupère l'email dans le body
    const codeFromUser = req.params.id;
    const userDataString = await redis.get(`userData:${email}`);

    if (!userDataString) {
      return res.status(400).json({ message: "Code expiré ou invalide." });
    }

    const userData = JSON.parse(userDataString);

    // Vérifie si le code correspond
    if (codeFromUser !== userData.verificationCode) {
      return res
        .status(400)
        .json({ message: "Code de vérification incorrect." });
    }

    // Met à jour le status de l'utilisateur dans MongoDB
    await User.updateOne(
      { email: userData.userEmail },
      { $set: { status: "validé" } }
    );

    // Supprimer les données de Redis après vérification réussie
    await redis.del(`userData:${email}`);
    return res.status(200).json({message: "Email vérifié avec succès."});
  } catch (error) {
    console.error("Erreur lors de la vérification :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
