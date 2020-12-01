const mail = document.getElementById('mal')
const btn = document.getElementById('btn')
const otp = document.getElementById('otp')
const otpbtn = document.getElementById('otpButton')
function verify(){
    const id = mail.value
    const len = id.length;
    var count = 0;
    for(var i = 0;i<len;i++)
    {
        if(id.charAt(i) === '@')
        count++;
    }
    if(count !== 1)
    {
      alert("Enter email-id provided by the college")
      console.log(`${count}`)
    }
    else{
    const index = id.indexOf("@");
    const service = id.slice(index+1, len);
    if(service === "smit.smu.edu.in")
    {
      window.location.href = "http://127.0.0.1:3000/success";
    }
    else{
      alert("Enter email-id provided by the college")
    }
  }
}

