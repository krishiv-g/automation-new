/** verify requests host */
const safeHost = (req, res, next) => {
    const origin = req.headers.origin
    console.log('origin', origin);
    if (
      origin === 'https://worldofxpilar.com' ||
      origin === 'http://localhost' // development host
    ) {
      next()
    } else {
      res.status(403)
    }
  }
  
  module.exports = safeHost
  