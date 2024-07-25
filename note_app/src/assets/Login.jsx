import React, { useEffect, useState } from 'react'
import "./Login.css"
import visible from './visibility_on.svg'
import hide from './visibility_off.svg'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
const Login = () => {
    
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [psd, setPsd] = useState('Password')
    const [error,setError] = useState('')
    const [isPasswordVisible,setIsPasswordVisible] = useState(false)

    const navigate = useNavigate()
 
    const toggleVisibility=()=>{
        
        setIsPasswordVisible(!isPasswordVisible)
    }

    useEffect(()=>{
        console.log(isPasswordVisible)
        setPsd(isPasswordVisible ? 'text' : 'password')
    
    },[isPasswordVisible])


    const login=async ()=>{
          if(email == '' && password ==''){
            setError("Please enter email and password")
          }else if(password == ''){
            setError("Please enter the password")
          }else if(email ==''){   
            setError("Please enter email")
          }
          else{
             let result = await fetch("https://note-backend-eight.vercel.app/login",{
                method:'POST',
                headers:{
                   'Content-Type':'application/json'
                },
                body : JSON.stringify({email,password}),
                credentials: 'include' 
             })

             result = await result.json();
             console.log(result)

             if(!result.success){

                setError(result.message)

             }
             else{
                localStorage.setItem('userId',JSON.stringify(result.user._id))
                localStorage.setItem('userName',result.user.name)
                navigate("/dashboard")
             }
             
          }
    }


  return (
        <> 
           <NavBar/>
           <div className='Login-Container'>
            <div className="Login-Div">
          <p className='Login'>Login</p> 
          <input style={{backgroundColor:'light-dark(rgb(232, 240, 254), rgba(70, 90, 126, 0.4))'}} type="email"  placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        
          <input type={psd}  placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} />
          
           
           <img id={isPasswordVisible ? 'Visible-On' : 'Visible-off'} onClick={toggleVisibility}  src={isPasswordVisible ? visible : hide} alt="" />

            {error && <span className='error-msg'>{error}</span>}

            <button onClick={login}>Login</button>
           
          <div>
          <span>Not registered yet?</span><Link to='/signup'>Create an Account</Link>
          </div>
    </div>
         </div>
        </>
         
  )
}

export default Login
