import ThemeToggleSwitch from "./Component/ThemeToggler"
import PostForm from "./Component/PostForm"
import {Header ,Footer, Home , SignUp,Login} from "./Component/componentIndex.js"
import { Outlet } from "react-router-dom"


function App() {

  
  
  
  return (
    <>
      <main className="bg-gray-200 dark:bg-gray-800 w-screen h-screen overflow-x-hidden overflow-y-scroll scroll fixed">
        <Header />
          <Outlet />
        <Footer />
       
      </main>

    </>
  )
}

export default App
