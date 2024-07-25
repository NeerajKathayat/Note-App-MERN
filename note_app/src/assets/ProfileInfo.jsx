import React from 'react'
import { useNavigate,Link } from 'react-router-dom'
import "./ProfileInfo.css"
const ProfileInfo = () => {
    const navigate = useNavigate();

    const handleLogout = async()=>{
        try{
            const response = await fetch('https://note-app-mern-six.vercel.app/logout',{
                method: 'POST',
                credentials: 'include', // Important to include cookies in the request
                headers: {
                  'Content-Type': 'application/json'
                }
            })

            const result = await response.json();

            if(result.success){
                localStorage.removeItem("userId")
                localStorage.removeItem("userName");
                navigate('/login')
            }
            else{
                console.error('Logout failed:',result.message)
            }
        }
        catch(err){
            console.error('Error during logout:', err);
        }
    }

    const userName = localStorage.getItem("userName");
    
    
    const getInitials = (name) => {
        if (!name) return '';

        // Split the name by spaces and get the first character of each part
        const nameArray = name.split(' ');
        console.log(nameArray)
        return nameArray.map(part => part.charAt(0).toUpperCase()).join('');
    };

    const initials = getInitials(userName);



  return (
    <div className='right'>
      <div className='User-Logo'>{initials}</div>
      <div>
        <p>{userName}</p>
        <Link onClick={handleLogout}>Logout</Link>
      </div>
    </div>
  )
}

export default ProfileInfo
