const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }
    
    try {
        const token = auth.split(' ')[1]; // On suppose que le token est envoyé sous la forme "Bearer token"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajoute les informations de l'utilisateur à la requête
        next(); // Passe à la prochaine fonction middleware
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is wrong or expired' });
    }
}

module.exports = ensureAuthenticated;
