import React from 'react'
import { Link } from 'react-router-dom'
import SearchOrder from '../features/order/SearchOrder'
import UserName from '../features/user/UserName'

const Header = () => {
  return (
    <header className='flex items-center justify-between bg-yellow-500 uppercase px-4 py-3 border-b border-stone-500 sm:px-6'>
      <Link to='/' className="tracking-widest">Fast React Pizza Co.</Link>
      <SearchOrder/>

      <UserName/>

    </header>
  )
}

export default Header
