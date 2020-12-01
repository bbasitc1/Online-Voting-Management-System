const express = require('express')
const router = express.Router()
    router.post('/admin', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    candidate.findOne({}).limit(6).then((result) => {
      result.forEach((res) => {
        candidates.push(res.name)
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
                    VOTE - 666 </button>
              
        </div>
    
        <div class="col-md-4">
                <div class="profile-name" style="font-size: 30px;">Mr. Steve Rogers</div>
                <div class="profile-username"> B.Tech(IT) - Third Year </div>
                <button type="button" class="btn btn-dark btn-lg btn-block">
                    VOTE - 399 </button>
              
        </div>
        <div class="col-md-4">
                <div class="profile-name" style="font-size: 30px;">Taylor Swift</div>
                <div class="profile-username"> B.Tech(IT) - Forth Year </div>
                <button type="button" class="btn btn-dark btn-lg btn-block">
                    VOTE - 505 </button>
               
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

  module.exports = router