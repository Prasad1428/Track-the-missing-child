import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"

function Navbar(props) {
  return (
    
    <div className='Navbar'>
    <Link to='/'>
      <div className='logo-div'>
        <img src='hand-print.png' id='logo'/>
        <p id='logo-title'>Track the Missing Child.com</p>
      </div>
    </Link>
    <div className='nav-items'>
    <Link to='/'>
      <div className='nav-item'>
        <p className='nav-title'>Find</p>
      </div>
    </Link>
    <Link to='/upload'>
      <div className='nav-item'>
        <p className='nav-title'>Upload</p>
      </div>
    </Link>
    <Link to='/help'>
      <div className='nav-item'>
         <p className='nav-title'>Help</p>
      </div>
    </Link>

    </div>
    <div className='nav-item account' >
      <img id='account-png' src='user.png' />
    </div>
    </div>
  )
}

export default Navbar
