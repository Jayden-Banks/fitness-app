require("dotenv").config();
const express = require('express')
const cors = require('cors')
const app = express()
const ctrl = require('./controller')
const port = process.env.PORT || 4000
const path = require('path')




//middlewares
app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve(__dirname, '../build')))

app.get('/', ctrl.main)
app.post('/api/food', ctrl.foodEntry)
app.post('/api/user', ctrl.userEntry)
app.get('/api/food', ctrl.getFood)
app.get('/api/user', ctrl.getUser)
app.delete('/api/food/:id', ctrl.deleteEntry)
app.get('/api/call/:searchKey', ctrl.getCallApi)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})