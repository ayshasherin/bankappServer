// import jsonwebtoken
const jwt = require('jsonwebtoken')

//import database
const db = require('./database')

users = {
  1000: { acno: 1000, uname: "Sanoob", password: "abc0", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Franklin", password: "abc1", balance: 5000, transaction: [] },
  1002: { acno: 1002, uname: "Michael", password: "abc2", balance: 5000, transaction: [] },
  1003: { acno: 1003, uname: "Trevor", password: "abc3", balance: 5000, transaction: [] },
}


// 🟩   Register definition  🟩

const register = (acno, uname, password) => {

  //asynchronous
  return db.User.findOne({
    acno
  }).then(user => {
    console.log(user)
    if (user) {
      return {
        statusCode: 401,
        status: false,
        message: "Account Already Exist !! Please Login"
      }
    }
    else {
      const newUser = new db.User({
        acno,
        uname,
        password,
        balance: 5000,
        transaction: []
      })
      newUser.save()
      return {
        statusCode: 200,
        status: true,
        message: "Account Successfully Created"
      }
    }

  })

}





// 🟩 login define 🟩

const login = (acno, password) => {

  //asynchronous call

  return db.User.findOne({
    acno,
    password

  }).then(user => {
    if (user) {
      currentAcno = acno
      currentUserName = user.uname

      //token generation
      const token = jwt.sign({
        currentAcc: acno
      }, "secretkey123")


      return {
        statusCode: 200,
        status: true,
        message: "Login Successfull !!",
        currentAcno,
        currentUserName,
        token
      }

    } else {

      return {
        statusCode: 401,
        status: false,
        message: "Invalid Credentials !!",
      }

    }
  })

}




//🟩 deposit  define 🟩

const deposit = (acno, password, amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password

  }).then(user => {
    if (user) {
      user.balance = user.balance + amount
      user.transaction.push({
        amount: amount,
        type: "CREDIT"
      })
      user.save()
      return {
        statusCode: 200,
        status: true,
        message: amount + " Credited !! Your New balance is : " + user.balance
      }

    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Invalid Credentials !!",
      }
    }
  })

}




// 🟩 withdraw  resolve 🟩

const withdraw = (req, acno, password, amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password

  }).then(user => {

    if (req.currentAcc != acno) {
      return {
        statusCode: 401,
        status: false,
        message: "Permission Denied!!",
      }
    }
    if (user) {
      if (user.balance > amount) {
        user.balance = user.balance - amount
        user.transaction.push({
          amount: amount,
          type: "DEBIT"
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: amount + " Debited !! Your New balance is : " + user.balance
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: "Insufficient Balance !!",
        }
      }

    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Invalid Credentials !!",
      }
    }
  })

}



//🟩  transaction  🟩

const getTransactions = (acno) => {
  // acno = req.currentAcc
  console.log(acno);
  return db.User.findOne({
    acno
  }).then(user => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Invalid Credentials ⚠"
      }
    }
  })

}

const deleteAcc =(acno)=>{
  return db.User.deleteOne({
    acno 
  }).then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
        message:"Account Deleted Successfully"
      }
    }else{
      return {
        statusCode: 401,
        status: false,
        message: "operation denied"
      }
    }
  })
}


// 🟩  export functions  🟩

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransactions,
  deleteAcc
}
