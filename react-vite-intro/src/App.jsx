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
                element: <Movie />,
                errorElement: <NotFound />
            },
            {
                path: "/movies",
                element: <Movie />,
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
        <RouterProvider router={router}>
            <Route path='/' element={<Movie />}/>
            <Route path='/movies' element={<Movie />}/>
            {/*<Route path='/not' element={<NotFound/>}/>*/}
        </RouterProvider>
    )
}

export default App
