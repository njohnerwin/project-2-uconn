$(document).ready(function () {

  //We declare user ID in the global scope, but assign its value later
  let uid;

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page, as well as passing uid its value
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    uid = data.id;
    getTeamList(uid);
  });

  //When Submit is clicked, handleTeamSubmit
  $("#submit-team").on("click", function (event) {
    console.log("SUBMIT button clicked!!!");
    handleTeamSubmit(event);
  })

  $("#team-list").on("click", ".delete-button", function (event) {
    console.log("DELETE button clicked!!!");
    handleTeamDelete(event.target.id);
  })

  $("#team-list").on("click", ".team-link", function (event) {
    console.log("Team Link CLICK");
    teamInfoTest(event.target.id, uid);
  })


  //sends a new team to the Teams table with the user's inputted name
  function handleTeamSubmit(event) {
    event.preventDefault();

    let teamname = $("#team-name").val().trim();
    let realmname = $("#team-realm").val().trim();
    let members = [{ id: 0, name: "test", class: "Warrior", role: "DPS" }];

    let realmslug = (realmname.replace("'", "")).toLowerCase();
    console.log(realmslug);

    if (!teamname || !realmslug) {
      alert("One or more required fields was left blank!");
      return;
    }

    let newTeam = {
      name: teamname,
      realm: realmslug,
      members: JSON.stringify(members),
      UserId: uid
    }

    submitTeam(newTeam)
  }

  //Teams API GET Call
  function getTeamList(uid) {

    $.get("/api/teams/" + uid, function (data) {
      console.log("Successful GET: " + data);

      //We empty the team-list div so we can keep it updated properly
      //Then, we add (or re-add) a header for readability
      $("#team-list").empty();
      $("#team-list").append($("<h3>Current Teams:<h3>"));

      //The data is a JSON string, but we need it to be an array
      let teamlist = JSON.parse(data);

      //Loops through the list, creating a new HTML card for each team
      for (x in teamlist) {
        let newTeamCard = $(`<div class="team-card"></div>`);
        let teamName = teamlist[x].name;
        let teamLink = $(`<a class="team-link" id="${teamlist[x].id}">${teamName}</a>`);
        let deleteButton = $(`<button class="delete-button">X</button>`);
        deleteButton.attr("id", teamlist[x].id);
        newTeamCard.append(teamLink);
        newTeamCard.append(deleteButton);
        $("#team-list").append(newTeamCard);
      }
    })
  }

  //Teams API POST call
  function submitTeam(newTeam) {
    return $.ajax({
      method: "POST",
      url: "api/teams",
      data: newTeam
    }).then(function () { getTeamList(uid) });
  }

  //Teams API DELETE call
  function handleTeamDelete(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/teams/" + id
    }).then(function () { getTeamList(uid) });
  }

  //TESTING - DELETE THIS FUNCT -- Teams API GET call for members
  function teamInfoTest(id, uid) {
    $.get("/api/teaminfo/" + id, function (data) {
      console.log(data);
      window.location.replace("/teaminfo/" + id + "/" + uid);
    })
  }
});
