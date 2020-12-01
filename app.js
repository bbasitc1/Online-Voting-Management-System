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
const { stringify } = require('querystring')
const { type } = require('os')
const { json } = require('body-parser')
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

app.post('/validate', (req, res) => {
    var userOtp = req.body.otp
    userOtp = parseInt(userOtp)
    if(userOtp == otp){
      new voted({id}).save().then(console.log(`${id} saved in DB`))
      res.render('candidates')
    }
    else
      res.render('index', {msg: "Invalid otp"})
    
})



app.post('/admin', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  candidate.findOne({}).limit(6).then((result) => {
    result.forEach((res) => {  
      
    })
  })
  if(email === 'admin@smit.smu.edu.in' && password === 'Admin.123')
  {
    res.render('adminDashboard', {msg:(
      `
      <div class="row">
      <div class="col-md-4">
              <div class="profile-name" style="font-size: 30px;">Robert Downey Jr</div>
              <div class="profile-username"> B.Tech(CSE) - Second Year </div>
              <button type="button" class="btn btn-dark btn-lg btn-block">
                  VOTE - 45 </button>
            
      </div>
  
      <div class="col-md-4">
              <div class="profile-name" style="font-size: 30px;">Mr. Steve Rogers</div>
              <div class="profile-username"> B.Tech(IT) - Third Year </div>
              <button type="button" class="btn btn-dark btn-lg btn-block">
                  VOTE - 105 </button>
            
      </div>
      <div class="col-md-4">
              <div class="profile-name" style="font-size: 30px;">Taylor Swift</div>
              <div class="profile-username"> B.Tech(IT) - Forth Year </div>
              <button type="button" class="btn btn-dark btn-lg btn-block">
                  VOTE - 24 </button>
             
      </div>
  </div>
      `
    )})
  }
  else
  {
    res.render('admin', {msg:"Invalid Credentials"})
  }
})

var count = 0
var i = 0;
var candidates = []
app.post('/add', (req, res) => {
  const name = req.body.name
  const regNo = req.body.regNo
  new candidate({name, regNo}).save().then(console.log
    (`${name} added as candidate`))

  res.render('adminDashboard', {msg:
  (
    `
    <div class="row">
    
    <div class="col-md-4">
            <div class="profile-name" style="font-size: 30px;">Basit</div>
            <div class="profile-username"> B.Tech(CSE) - Second Year </div>
            <button type="button" class="btn btn-dark btn-lg btn-block">
                VOTES - 45 </button>
                
    </div>

    <div class="col-md-4">
            <div class="profile-name" style="font-size: 30px;">Tushar</div>
            <div class="profile-username"> B.Tech(IT) - Third Year </div>
            <button type="button" class="btn btn-dark btn-lg btn-block">
                VOTES - 105 </button>
          
    </div>
    <div class="col-md-4">
            <div class="profile-name" style="font-size: 30px;">Niluy</div>
            <div class="profile-username"> B.Tech(IT) - Forth Year </div>
            <button type="button" class="btn btn-dark btn-lg btn-block">
                VOTES - 24 </button>
           
    </div>
</div>`
  )})
})





const PORT = process.env.PORT || 3000 
app.listen(PORT, console.log(`Server started on ${PORT}`))