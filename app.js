const express = require('express')
const session = require('express-session')
const { hashedSecret } = require('./crypto/config')
const ruter = require('./rutes/rutes')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', ruter);

app.use(session({
    secret: hashedSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false} 
}
))

app.listen(3002, () =>{
    console.log('expres esta escucahando http://localhost:3002')
})