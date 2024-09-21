import axios from "axios"
import { useState } from "react"
import { useLocation ,useNavigate} from "react-router-dom"

function ChangePassword(){
    const location=useLocation()
    const navigate=useNavigate()
    const [newPassword,setNewPassword]=useState('')
    const [reenteredPassword,setReenteredPassword]=useState('')
    const [errorMessage,setErrorMessage]=useState('')
    const {userId}=location.state || {}
    const handleSubmit=(event)=>{
          event.preventDefault()
          if(newPassword === reenteredPassword){
            axios.post('https://52.66.113.235/change-password',{newPassword,userId}).then((response)=>{
                 navigate('/')
            }).catch((error)=>{
                   console.log(error);
                   if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.message);
                  } else {
                    setErrorMessage("An unexpected error occured");
                  }
            })
          }else{
            setErrorMessage("Password Doesnt match")
          }
    }
    return(
        <div className="login-form">
        <h1>Change Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <p>New Password</p>
            <input
              type="password"
              value={newPassword}
              onChange={(evnt) => setNewPassword(evnt.target.value)}
            />
            <p>Reenter New Password</p>
            <input
              type="password"
              value={reenteredPassword}
              onChange={(evnt) => setReenteredPassword(evnt.target.value)}
            />
          </div>
          <button type="submit">
            Change Password
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    )
}

export default ChangePassword;