const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const connectDB = require('./db')
const candidate = require('./models/candidate')
const voted = require('./models/voted')

const app = express()


connectDB()

const nodemailer = require('nodemailer')
const { type } = require('os')
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './public')))

var id = ''

var otp = (Math.random().toFixed(6))*1000000
otp = parseInt(otp)
app.get('/', (req, res) => res.render('index'))

app.post('/', (req, res) => {
    const output = `
    <p>Please confirm this OTP to cast your vote</p>
    <h3>OTP = ${otp}
    `;
async function main() {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'kajajabhay@gmail.com', // generated ethereal user
      pass: 'vrafekjqnewmoklx', // generated ethereal password
    },
  });
    const rec = `${req.body.mail}`
    id = rec
    const len = rec.length
    const index = rec.indexOf("@")
    const service = rec.slice(index+1, len);
    if(service !== 'smit.smu.edu.in')
    {
        res.render('index', {msg:" Kindly enter email id provided by the collge, OTP not sent"})
        return;
    }
    voted.findOne({id:rec}).then(user => {
      if(user)
      {
        res.render('index', {msg:`${rec} has already voted`})
      }
    })
    
  let info = await transporter.sendMail({
    from: '"Voting System" <kajajabhay@gmail.com>', // sender address
    to: rec, // list of receivers
    subject: "Verify Your OTP", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  console.log(otp)
  res.render('validate')

}
main().catch(console.error);    
})

app.get('/success', (req, res) => {
  res.render('success')
})

app.get('/admin', (req, res) => {
  res.render('admin')
})

app.get('/done', (req, res) => {

})


app.post('/validate', (req, res) => {
    var userOtp = req.body.otp
    userOtp = parseInt(userOtp)
    if(userOtp == otp){
      new voted({id}).save().then(console.log(`${id} saved in DB`))
      var output = ''
      candidate.find({}).limit(7).then((result) => {
        var i = 0
        result.forEach((res) => {
          output+=`<form class="col-md-12" method="POST" action="/done">
                    <div class="profile-content" style = "width:100%">
                       <div class="profile-name" style="font-size:30px">${res.name} 
                       <div class="profile-name" style="font-size:15px">${res.regNo} 
                       <p> B.Tech(${res.branch}) - Third Year </p>
                      </div>
                      <input type = text name = 'reg' placeholder = 'Kindly Type the same registration No as mentioned above to confirm your vote' required style = "font-size: 18px; width:100%">
                      <div class="row" style="padding: 2px;">
                        <button type="submit" class="btn btn btn-outline-dark btn-lg btn-block" user = ${res.name}>Vote ${res.name}</button>
                      </div>
                    </div>
                  </form>`
        })
      res.render('candidates', {msg:output})
      })
    }
    else
      res.render('index', {msg: "Invalid otp"})
    
})

app.post('/done', (req, res) => {
  const reg = req.body.reg
  candidate.findOne({regNo:reg}).then((user) => {
    const votesNow = user.voteCounts
    candidate.findOneAndUpdate({regNo:reg}, {voteCounts:votesNow+1}).then((user) => res.render('index', {msg: "Your vote casted successfully"}))
  })
})



app.post('/admin', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  var output = `<div class="row">`
  if(email === 'admin@smit.smu.edu.in' && password === 'Admin.123')
  {
    candidate.find({}).limit(7).then((result) => {
      result.forEach((res) => {
        output += `<div class="col-md-4">
                      <div class="profile-name" style="font-size: 30px;">${res.name}</div>
                      <div class="profile-username"> B.Tech(${res.branch}) - Third Year </div>
                      <div class="profile-username" style = 'font-size:15px'> B.Tech(${res.regNo}) - Third Year </div>
                      <button type="button" class="btn btn-dark btn-lg btn-block">
                      VOTES - ${res.voteCounts}</button>
                      <form method = "GET" action = "/${res.regNo}">
                      <button type="submit" class="btn btn-dark btn-lg btn-block">Delete</button>
                      </form>
                  </div>
                  `
      })
     res.render('adminDashboard', {msg:output})
    })
  }
  else
  {
    res.render('admin', {msg: "Wrong Credentials"})
  }
})


app.post('/add', (req, res) => {
  const name = req.body.name
  const regNo = parseInt(req.body.regNo)
  console.log(typeof(regNo));
  const branch = req.body.branch
  new candidate({name, regNo, branch}).save().then(() => {
    console.log(`${name} added as candidate`)
    var output = `<div class="row">`
  candidate.find({}).limit(7).then((result) => {
    result.forEach((res) => {
      output += `<div class="col-md-4">
                    <div class="profile-name" style="font-size: 30px;">${res.name}</div>
                    <div class="profile-username"> B.Tech(${res.branch}) - Third Year </div>
                    <button type="button" class="btn btn-dark btn-lg btn-block">
                    VOTES - ${res.voteCounts}</button>
                    <form method = "GET" action = "/${res.regNo}">
                      <button type="submit" class="btn btn-dark btn-lg btn-block">Delete</button>
                      </form>
                </div>
                `
    })
    output += `</div>`
  res.render('adminDashboard', {msg:output})
  })
  
})
})

app.get('/:id', (req, res) => {
  const id = req.params.id
  var output = `<div class="row">`
  candidate.findOneAndDelete({regNo:id}).then((user) => {
    candidate.find({}).limit(7).then((result) => {
      result.forEach((res) => {
        output += `<div class="col-md-4">
                      <div class="profile-name" style="font-size: 30px;">${res.name}</div>
                      <div class="profile-username"> B.Tech(${res.branch}) - Third Year </div>
                      <div class="profile-username" style = 'font-size:15px'> B.Tech(${res.regNo}) - Third Year </div>
                      <button type="button" class="btn btn-dark btn-lg btn-block">
                      VOTES - ${res.voteCounts}</button>
                      <form method = "GET" action = "/${res.regNo}">
                      <button type="submit" class="btn btn-dark btn-lg btn-block">Delete</button>
                      </form>
                  </div>
                  `
      })
     res.render('adminDashboard', {msg:output})
    })
  }).then(console.log("Done"))
})



const PORT = process.env.PORT || 3000 
app.listen(PORT, console.log(`Server started on ${PORT}`))


