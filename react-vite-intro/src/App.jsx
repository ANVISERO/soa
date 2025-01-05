import React, {useState} from 'react'
import './App.css'
import {createBrowserRouter, Route, RouterProvider} from "react-router-dom";
import Movie from "./rotes/Movie/index.jsx";
import NotFound from "./rotes/NotFound/index.jsx";

function App() {
    const [count, setCount] = useState(0)
    // const [createActive, setCreateActive] = useState("hidden");
    // const [updateActive, setUpdateActive] = useState("hidden");
    // const [blockedScroll, setBlockedScroll] = useState(1);
    //
    // function addToScroll() {
    //     setBlockedScroll(blockedScroll + 1);
    // }
    //
    // function removeToScroll() {
    //     setBlockedScroll(blockedScroll - 1);
    // }
    const router = createBrowserRouter(
        [
            {
                path: "/",
                element: <Movie pageSize = {5} />,
                errorElement: <NotFound />
            },
            {
                path: "/movies",
                element: <Movie pageSize = {5}/>,
                errorElement: <NotFound />
            }
            // {
            //     path: "/not",
            //     element: <NotFound />,
            //     errorElement: <NotFound />
            // }
        ]
    );

    return (
        //   <AppBody>
        //       <Header>
        //       </Header>
        //     <div className="card">
        //         <button onClick={() => setCount((count) => count + 1)}>
        //             count is {count}
        //         </button>
        //     </div>
        //       <Footer/>
        // </AppBody>
        <RouterProvider router={router}>
            <Route path='/' element={<Movie pageSize = {5}/>}/>
            <Route path='/movies' element={<Movie pageSize = {5}/>}/>
            {/*<Route path='/not' element={<NotFound/>}/>*/}
        </RouterProvider>
    )
}

export default App
