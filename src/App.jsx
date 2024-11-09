import ThemeToggleSwitch from "./Component/ThemeToggler"
import PostForm from "./Component/PostForm"
import {Header ,Footer } from "./Component/componentIndex.js"


function App() {

  
  
  
  return (
    <>
      <main className="bg-gray-200 dark:bg-gray-800 w-screen h-screen overflow-x-hidden overflow-scroll scroll fixed">
        <Header />
        <PostForm />  
        <Footer />
      </main>

    </>
  )
}

export default App
