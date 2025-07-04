import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET_KEY;

class AuthMiddleware {
  checkAuth(req, res, next) {
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')) { 
      return res.status(401).json({ status: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        // Lưu toàn bộ thông tin user vào req.user
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
  }
}

export default AuthMiddleware;