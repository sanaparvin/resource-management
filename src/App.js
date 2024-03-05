import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Upload from "./pages/uploads/uploads";
import Profile from "./pages/profile/profile";
import Admin from "./pages/admin/admin";
import Moderator from "./pages/moderator/moderator";

const App = () => {
    return ( <
        Router >
        <
        Routes >
        <
        Route path = "/"
        element = { < Login / > }
        /> <
        Route path = "/home"
        element = { < Home / > }
        /> <
        Route path = "/profile"
        element = { < Profile / > }
        /> <
        Route path = "/uploads"
        element = { < Upload / > }
        /> <
        Route path = "/admin"
        element = { < Admin / > }
        /> <
        Route path = "/moderator"
        element = { < Moderator / > }
        /> < /
        Routes > <
        /Router>
    );
};
export default App;