import React, { useState } from 'react'
import './SearchBar.css'
const SearchBar = ({setSearch}) => {
   const [query,setQuery] = useState('')

   const handleSearch = () =>{
      setSearch(query)
   }

    const Clear=()=>{
        setSearch('')
        setQuery('')
    }


    return (
        <div className='Search-Div'>
            <input type="text" name="" id="Search"  value={query} placeholder='Search Notes' onChange={e=>setQuery(e.target.value)}/>
            <div className='Icons'>
            {query && <span className="material-symbols-outlined" aria-label="Clear search" onClick={Clear}>close</span>}
            <span className="material-symbols-outlined" aria-label="Search" onClick={handleSearch}>search</span>
            </div>
        </div>
    )
}

export default SearchBar
