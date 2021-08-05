const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const port = 3000

app.use(express.json());

const users = []

//muestra los usuarios (para testear)
app.get('/users', (req,res) => {
  res.json(users)
})

//crear un usuario
app.post('/users', async (req,res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = {name:req.body.name, password: hashedPassword}
    users.push(user)
    //res.status(201).send('Usuario creado exitosamente')

    const token = jwt.sign({name: user.name},'mytoken',{expiresIn: 60 * 60 * 24})

    res.status(201).json({msg:'Usuario creado exitosamente', token:token})

  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req,res) => {
  const user = users.find( user => user.name === req.body.name)
  if (user == null){
    return res.status(400).send('No se encontró el usuario')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)){
      res.send('Logeado exitosamente')
    } else {
      res.send('contraseña incorrecta')
    }
  } catch {
    res.status(500).send()
  }
})

app.get('/saludos', (req,res) => {

  const token = req.headers['x-access-token'];
  if(!token){
    return res.status(401).send('no token provided')
  } else {
    const decoded = jwt.verify(token, 'mytoken')
    res.send('saludos ' + decoded.name)
  }

})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  })
  
