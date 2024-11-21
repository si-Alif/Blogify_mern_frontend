import React,{useMemo} from 'react'
import {Account} from "../Component/componentIndex.js"
import { useSelector } from 'react-redux';
function SelfAccount() {
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = useMemo(() => userInfo?.$id, [userInfo?.$id]);
  return (
    <>
      <Account userId={userId} isAuthenticated={isAuthenticated} />
    </>
  )
}

export default SelfAccount
