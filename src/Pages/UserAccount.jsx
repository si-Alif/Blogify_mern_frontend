import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {Account} from "../Component/componentIndex"

function UserAccount() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { userId } = useParams()
  console.log(userId)
  console.log(useParams())
  return (
    <>
      <Account userId={userId} isAuthenticated={isAuthenticated} />
    </>
  )
}

export default UserAccount
