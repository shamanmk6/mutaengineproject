import axios from "axios"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"


function EnterOtp(){
    const  navigate=useNavigate()
    const location=useLocation()
    const [userOtp,setUserOtp]=useState('')
    const handleSubmit=(event)=>{
        event.preventDefault()
        const {userId,otp}=location.state || {}
        if(otp===userOtp){
            navigate('/change-password',{state:{userId}})
        }else{
            setErrorMessage("Incorrect OTP")
        }
    }
    return(
        <div className="login-form">
      <h1>Enter OTP</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <p>OTP</p>
          <input
            type="number"
            value={userOtp}
            onChange={(evnt) => setUserOtp(evnt.target.value)}
          />
        </div>
        <button type="submit">
          Verify Otp
        </button>
      </form>
    </div>
    )
}

export default EnterOtp;