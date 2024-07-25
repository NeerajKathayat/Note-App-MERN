import React from 'react'
import './NavBar.css'
import SearchBar from './SearchBar'
import ProfileInfo from './ProfileInfo'
const NavBar = ({setSearch}) => {
     let auth = localStorage.getItem("userId")
  return (
    <div className='header'>
       <p>Notes</p>

       {auth &&
       
        <>
               <SearchBar setSearch={setSearch} />
               <ProfileInfo/>
        </>
        

       }


    </div>
  )
}

export default NavBar
