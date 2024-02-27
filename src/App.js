import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Upload from "./components/uploads/uploads";
import Profile from "./components/profile/profile";
import Admin from "./components/admin/admin";
import Moderator from "./components/moderator/moderator";

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