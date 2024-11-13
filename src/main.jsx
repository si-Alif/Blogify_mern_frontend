import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { reduxStore, persistor } from "./ReduxStore/store.js"
import { SignUp, Post, PostForm, Home, Login, Account } from "./Component/componentIndex.js";
import { PersistGate } from 'redux-persist/integration/react';

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
      {
        path: '/account',
        element: <Account />,
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
