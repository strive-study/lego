// server.js
const jsonServer = require('json-server')
const bodyParser = require('body-parser')
const server = jsonServer.create()
const jwt = require('jsonwebtoken')
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const SECRET_KEY = '48968'
const createToken = payload => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
}
const verifyToken = token => jwt.verify(token, SECRET_KEY)
const rewriter = jsonServer.rewriter({
  '/api/*': '/$1'
})

server.use(bodyParser.json())
server.use(rewriter)
server.use(middlewares)
server.use('/works', (req, res, next) => {
  const errorRes = {
    error: '12001',
    message: '登录验证失败'
  }
  const authHeader = req.header.authorization
  if (authHeader == undefined) {
    res.json(errorRes)
    return
  }
  try {
    verifyToken(authHeader.split(' ')[1])
    next()
  } catch (e) {
    res.json(errorRes)
    return
  }
})
server.get('/echo', (req, res) => {
  res.jsonp({ test: 123 })
})
server.post('/users/loginByPhoneNumber', (req, res) => {
  const { phoneNumber, veriCode } = req.body
  const assessToken = createToken({ phoneNumber, veriCode })
  res.status(200).json({ data: { token: assessToken } })
})
router.render = (req, res) => {
  res.jsonp({
    error: 0,
    data: {
      list: res.locals.data,
      count: res.locals.data.length
    }
  })
}
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
