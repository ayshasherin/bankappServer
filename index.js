//import express
const express = require('express')

const req = require('express/lib/request')

// import cors
const cors = require('cors')

//import dataservice
const dataService = require('./services/dataservice')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

//create app using express
const app = express()

//cors

app.use(cors({
    origin: "http://localhost:4200"
    // origin:" http://127.0.0.1:8080"
}))


//parse json

app.use(express.json())


//get request - to fetch

app.get('/', (req, res) => {
    res.status(1401).send("GET REQUEST !!!!")
})

//post request -to create

app.post('/', (req, res) => {
    res.send("POST REQUEST !!!")
})

//put request -- to modify entirely
app.put('/', (req, res) => {
    res.send("PUT REQUEST !!!!")
})

//patch -- modify psrtislly
app.patch('/', (req, res) => {
    res.send("PATCH REQUEST !!!!")
})

//delete --to delete
app.delete('/', (req, res) => {
    res.send("DELETE REQUEST !!!!")
})

//middleware -application specific

// app.use((req,res,next)=>{
//     console.log("Application specific middleware 1");
//     next()
// })

//middleware - application specific another type

// const middlewar=(req,res,next)=>{
//     console.log("Application specific middleware 2");
//     next()
// }
// app.use(middlewar)

//router specific middleware- to validate token

const jwtMiddleWare = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'secretkey123')
        req.currentAcc = data.currentAcc
        next()
    }
    catch {
        res.json({
            statusCode: 401,
            status: false,
            message: "Please Login First"
        })
    }
}


//Register API

app.post('/register', (req, res) => {
    console.log(req.body);
    //asynchronous

    dataService.register(req.body.acno, req.body.uname, req.body.password)
        .then(result => {
            // res.send(result.message)
            res.status(result.statusCode).json(result)
        })

})

//login resolve api
app.post('/login', (req, res) => {
    // console.log(req.body);
    dataService.login(req.body.acno, req.body.password)
        .then(result => {
            //   res.send(result.message)
            res.status(result.statusCode).json(result)
        })
})

//deposit resolve api

app.post('/deposit', jwtMiddleWare, (req, res) => {
    //  console.log(req.body);
    dataService.deposit(req.body.acno, req.body.password, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})

//withdraw  api

app.post('/withdraw', jwtMiddleWare, (req, res) => {
    // console.log(req.body);
    dataService.withdraw(req, req.body.acno, req.body.password, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})

//transaction APi

app.post('/transactions/:acno', jwtMiddleWare, (req, res) => {
    // console.log(req.params.acno);
    dataService.getTransactions(req.params.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//delete account

app.delete('/deleteAcc/:acno',jwtMiddleWare,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})



//set port number for server
app.listen(3000, () => {
    console.log("Server Started at 3000");
})