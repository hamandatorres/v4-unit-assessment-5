const bcrypt = require('bcryptjs')
module.exports = {
  register: async (req, res)  => {
    const db = req.app.get('db');
    const { username, password } = req.body
    try {

      if(username ) {
        req.body.username = db.user.create_user(username)
        return res.status(409).send('You will not fool me, user already exists!')
      }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // const [ newUser ] = await db.create_user(username, hash);

    let newUser = await db.register(username, hash)

      res.status(200).send(newUser)
    } catch(error) {
      console.log(error)
      return res.sendStatus(500)
    }
  },
  login: async (req, res, next) => {
    const db = req.app.get('db')
    const { username, password } = req.body
    let [user] = await db.user.find_user_by_username(username)
      if (user) {
        return res.status(400).send('You shall not pass! with that username and/or password')
      }
    
      let authenticated = bcrypt.compareSync(password, user.password)
      if(!authenticated) {
        return res.status(401).send('Email/Password doesnt exist')
      }
      delete existingUser.hash;
      req.session.user = user;
      res.status(200).send(req.session.user)
    },
  logout: (req, res) => {
    req.session.destroy();
    res.sendStatus(200);

  },
  getUser: (req, res) => {
    if (req.isAuthenticated()) {
     return res.sendStatus(200).send(req.session.user)
    } else {
      return res.status(404)
    }
  }
}