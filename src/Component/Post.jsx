import databaseService from "../Appwrite/DB";
import authService from "../Appwrite/auth";
import { useSelector , useDispatch } from "react-redux";
import storageService from "../Appwrite/Storage";
import { useNavigate } from "react-router-dom";

import React from 'react'

function Post() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector()

  return (
    <>
    


    </>
  )
}

export default Post
