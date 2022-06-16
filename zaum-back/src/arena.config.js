const Arena = require("@colyseus/arena").default;
const { monitor } = require("@colyseus/monitor");
const express = require("express");
const path = require('path')

/**
 * Import your Room files
 */
const {ZaumRoom} = require('./rooms/ZaumRoom')

module.exports = Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('zaum', ZaumRoom);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        app.use('/res',express.static(path.join(__dirname, '../public')))

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }

});
