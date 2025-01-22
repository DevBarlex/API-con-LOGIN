const express = require('express')
const session = require('express-session')
const { hashedSecret } = require('./crypto/config')
const ruter = require('./rutes/rutes')

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
    secret: hashedSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}
))

app.use('/', ruter);

app.listen(3000, () =>{
    console.log('expres esta escucahando http://localhost:3000')
})