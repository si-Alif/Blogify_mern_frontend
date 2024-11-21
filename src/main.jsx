import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { reduxStore, persistor } from "./ReduxStore/store.js"
import { SignUp, Post, PostForm, Home, Login, Account , Creator , CreatorProfile} from "./Component/componentIndex.js";
import { PersistGate } from 'redux-persist/integration/react';
import {SelfAccount , UserAccount} from "./Pages/pageIndex.js"


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/postform',
        element: <PostForm />,
      },
      {
        path: '/post',
        children: [
          {
            path: '/post/:postId',
            element: <Post />,
          },
          {
            path: '/post/edit/:postId',
            element: <PostForm />,
          }
        ]
      },
      ,{
        path: '/creator',
        children:[
          {
            path: '/creator',
            element: <Creator />,
          },
          {
            path: '/creator/edit/:id',
            element: <CreatorProfile />,
          },
          
        ]
      },
      {
        path: '/account',
        element: <SelfAccount />,
      },
      {
        path: '/user/:userId',
        element: <UserAccount />,
      }
    ],
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // {
  //   path: '/verify',
  //   element: <VerifyPage />, // Replace with actual Creator component
  // }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}> 
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
