import React from 'react'
import { useSelector } from "react-redux";



const UserName = () => {
  const username = useSelector( state => state.user.username);
  console.log(username);

  if (!username) return null;

  return (
    <div className="text-sm font-semibold  md:block">
      {username}
    </div>
  )
}

export default UserName
