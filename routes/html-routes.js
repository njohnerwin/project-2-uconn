// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");

module.exports = function (app) {

  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/teamlist");
    }
    res.render("index", { style: "style.css" });
  });

  app.get("/signup", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/teamlist");
    }
    res.render("signup", { style: "style.css" });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/teamlist", isAuthenticated, function (req, res) {
    res.render("teamlist", { style: "style.css" });
  });

  app.get("/teaminfo/:id/:uid", function (req, res) {
    db.Team.findOne({
      where: {
        id: req.params.id,
        UserID: req.params.uid
      }
    }).then(function (dbTeam) {
      //res.render("teaminfo", dbTeam);
      if (req.user.id == dbTeam.UserId) {
        /*let members = JSON.parse(dbTeam.members);
        let DPS = [];
        let TNK = [];
        let HLR = [];
        let UTL = [];
        let UNK = [];
        
        for (x in members) {
          switch (x.role) :
        }*/

        res.render("teaminfo", {
          teamname: dbTeam.name,
          teamid: dbTeam.id,
          style: "teaminfo.css"
        });
      } else {
        res.redirect("/teamlist");
      }
    });
  });

  app.get("/charinfo", function (req, res) {
    res.render("charinfo", { style: "style.css" });
  });
}
