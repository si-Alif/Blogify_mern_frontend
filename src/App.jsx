
import {Header ,Footer} from "./Component/componentIndex.js"
import { Outlet } from "react-router-dom"


function App() {
  return (
    <>
      <main className="bg-gray-200 dark:bg-gray-800 w-screen h-screen overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 rounded-lg fixed">
        <Header />
        <Outlet />
        <Footer />
      </main>
    </>
  );
}

export default App;


