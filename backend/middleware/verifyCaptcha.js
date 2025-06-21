import axios from "axios";

const verifyCaptcha = async (req, res, next) => {
    
  const captcha = req.body.captcha;
  if (!captcha) {
    return res.status(400).json({ error: "Captcha manquant" });
  }

  try {
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`
    );

    if (!data.success) {
        return res.status(400).json({ error: "Captcha invalide" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la vérification du captcha" });
  }
};

export default verifyCaptcha;
