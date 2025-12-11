import jwt from 'jsonwebtoken'

export default function checkToken(req, res, next) {
    const auth = req.headers['authorization'] || req.headers['Authorization']
    if (!auth) return res.status(401).json({ error: 'No token provided' })
    const parts = auth.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Token malformed' })
    const token = parts[1]
    const secret = process.env.JWT_SECRET || 'secret'
    try {
        const payload = jwt.verify(token, secret)
        req.user = payload
        req.isAdmin = payload.isAdmin
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}