const User = require('./auth-user-model');

const checkUserExists = async (req, res, next) {
    try {
        const [user] = await User.findBy({ username: req.body.username})
        if (!user) {
            next({ status: 422, message: 'username taken'})
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

const bodyValidation = async (req, res, next)  => {
    const errorMessage = {
        status: 400,
        message: 'username and password required'
    }
    try {
        const {username, password} = req.body
        if(!username || !password) {
            next(errorMessage)
        } else if (typeof password !== 'string') {
            next(errorMessage)
        } else if (!password.trim() || !username.trim()) {
            next(errorMessage)
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}


module.exports = {
    checkUserExists,
    bodyValidation
}