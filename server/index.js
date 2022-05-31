const PORT = 8000
const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')

// tinder-app database 
const uri = 'mongodb+srv://catafest-work:EDCEDCEDC77@cluster0.l8aybzv.mongodb.net/Cluster0?retryWrites=true&w=majority'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json('Hello to my app')
})

app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri);
  //console.log("MongoClicent is; ",req.body)
  const {email, password} = req.body

  const generatedUserId = uuidv4()
  //console.log('generatedUserId ', generatedUserId)
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    // await to connect client 
    await client.connect();
    const database = client.db('tinder-app')
    const users = database.collection('tinder-app')
    // await to findOne 
    const existingUser = await users.findOne({email})

    if (existingUser) {
        return res.status(409).send('User already exists. Please login')
    }
    // this will fill the database with the lowercase email ... no need ... 
    const sanitizedEmail = email.toLowerCase()

    const data = {
        user_id: generatedUserId,
        email: sanitizedEmail,
        hashed_password: hashedPassword
    }

    // await the response
    const insertedUser = await users.insertOne(data)
    // without secret key 
    
    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: 60 * 24
  })

  res.status(201).json({ token, userId: generatedUserId })

  } catch (err) {
    console.log(err)
  } finally {
    await client.close()
  }
})

app.post('/login', async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body
  try {
    await client.connect()
    const database = client.db('tinder-app')
    //console.log('database ', database)
    const users = database.collection('tinder-app')
    // get user by email 
    const user = await users.findOne({ email })
    
    const correctPassword = await bcrypt.compare(password, user.hashed_password)
    
    if ( user && correctPassword ) {
      const token = jwt.sign(user, email, 
        { expiresIn: 60*24 })

    res.status(201).json({ token, userId: user.user_id })
    }
    res.status(400).send('Invalid Credentials')  //?

  } catch (err)
  { console.error(err); }
})

app.get('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const userId = req.query.userId

  console.log("userId is : ", userId)

  try { 
    await client.connect()
    const database = client.db('tinder-app')
    //console.log('database ', database)
    const users = database.collection('tinder-app')
    
    const query = { user_id: userId }
    const user = await users.findOne(query)
    res.send(user)

    // test axios network error fix
    // if(res.headersSent !== true) {
    //   res.send('Hello');
    // }
    //

    } finally {
      await client.close()
  }
})

app.get('/gendered-users', async (req, res) => {
  const client = new MongoClient(uri);
  const gender = req.query.gender
  try {
    await client.connect()
    const database = client.db('tinder-app')
    //console.log('database ', database)
    const users = database.collection('tinder-app')
    const query = { gender_identity: gender}
    const foundUsers = await users.find(query).toArray()
    //const returnedUsers =  await users.find().toArray()
    res.send(foundUsers)
  } finally {
    await client.close()
  }
})

app.put('/user', async (req, res) => {
  const client = new MongoClient(uri);
  const formData= req.body.formData

  console.log("formData is : ", formData)

  try { 

    await client.connect()
    const database = client.db('tinder-app')
    const users = database.collection('tinder-app')

    const query = { user_id: formData.user_id }
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        gender_interest: formData.gender_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches
      },
    }
    const insertedUser = await users.updateOne(query, updateDocument)
    res.send(insertedUser)
  } finally {
    await client.close()
  } 
}) 

app.listen(PORT, () => console.log('server running on PORT ' + PORT))