const bcrypt = require('bcryptjs')
module.exports = {
  register: async (req, res)  => {
    const db = req.app.get('db');
    const { username, password, profile_pic } = req.body
    try {
      const [existingUser] = await db.create_user(username)

      if(existingUser) {
        return res.status(409).send('You will not fool me, user already exists!')
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const [ newUser ] = await db.create_user(username, password, profile_pic);

      req.session.user = newUser;

      res.status(200).send(newUser)
    } catch(error) {
      console.log(error)
      return res.sendStatus(500)
    }
  },
  login: (req, res) => {
    const db = req.app('db')
    const { username, password } = req.body
    db.find_user_by_username(username)
    .then(([existingUser]) => {
      if (!existingUser) {
        return res.status(403).send('You shall not pass! with that username')
      }
      delete existingUser.hash;
      req.session,user = existingUser;
      res.status(200).send(req.session.user)
    })
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