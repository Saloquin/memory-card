import checkToken from './checkToken.js'

export default function checkAdmin(req, res, next) {
    const result = checkToken(req, res, () => {})
    try {
        if(!result.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' })
        }
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}