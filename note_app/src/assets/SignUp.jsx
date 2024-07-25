import React, { useEffect, useState } from 'react'
import "./SignUp.css"
import visible from './visibility_on.svg'
import hide from './visibility_off.svg'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
const SignUp = () => {
      
    const [name,setName] = useState('');
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [psd, setPsd] = useState('Password')
    const [error,setError] = useState('')
    const [isPasswordVisible,setIsPasswordVisible] = useState(false)

    const navigate=useNavigate();

    const toggleVisibility=()=>{
        
        setIsPasswordVisible(!isPasswordVisible)
    }

    useEffect(()=>{
        setPsd(isPasswordVisible ? 'text' : 'password')
    
    },[isPasswordVisible])


    const login=async ()=>{
          if(name=='' && email == '' && password ==''){
            setError("Please enter email and password")
          }else if(name == ''){
            setError("Please enter the name")
          }
          else if(password == ''){
            setError("Please enter the password")
          }else if(email ==''){
            setError("Please enter email")
          }
          else{
               let result = await fetch("https://note-app-mern-sable.vercel.app/signup",{
                   method:'POST',
                   headers:{
                    'Content-Type':'application/json'
                   },
                   body:JSON.stringify({ name, email, password })

               })

               result = await result.json();
               console.log(result)

               if(!result.success){
                  setError(result.message)
               }
               else{
                navigate("/login")
               }
          }
    }


  return (
        
    <>
      <NavBar/>
      <div className='Login-Container'>
            <div className="Login-Div">
          <p className='Login'>SignUp</p> 
          <input style={{backgroundColor:'light-dark(rgb(232, 240, 254), rgba(70, 90, 126, 0.4))'}} type="text"  placeholder='Name' value={name} onChange={(e)=>{setName(e.target.value)}}/>
          <input style={{backgroundColor:'light-dark(rgb(232, 240, 254), rgba(70, 90, 126, 0.4))'}} type="email"  placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        
          <input type={psd}  placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} />
          
           
           <img id={isPasswordVisible ? 'Visible-On2' : 'Visible-off2'} onClick={toggleVisibility}  src={isPasswordVisible ? visible : hide} alt="" />

            {error && <span className='error-msg'>{error}</span>}

            <button onClick={login}>Create Account</button>
           
          <div>
          <span>Already have an account?</span><Link to='/login'>Login</Link>
          </div>
    </div>
         </div>
    </>
        
        
  )
}

export default SignUp
