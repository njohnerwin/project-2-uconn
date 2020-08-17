$(document).ready(function() {
  
  const submitButton = $("#submit-team");
  let uid;

  getTeamList(uid);

  //When Submit is clicked, handleTeamSubmit
  $("#submit-team").on("click", function(event) {
    console.log("SUBMIT button clicked!!!");
    handleTeamSubmit(event);
    getTeamList(uid);
  })

  $("#team-list").on("click", ".delete-button", function(event) {
    console.log("DELETE button clicked!!!");
    handleTeamDelete(event.target.id);
  })
  
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    uid = data.id;
    getTeamList(uid);
  });

  //sends a new team to the Teams table
  function handleTeamSubmit(event) {
    event.preventDefault();

    let teamname = $("#team-name").val().trim();
    let members = [];

    if (!teamname) {
      return;
    }

    let newTeam = {
      name: teamname,
      members: JSON.stringify(members),
      UserId: uid
    }

    submitTeam(newTeam)
  }

  //Teams API GET Call
  function getTeamList(uid) {

    $.get("/api/teams/" + uid, function(data) {
      console.log("Successful GET: " + data);
      $("#team-list").empty();
      $("#team-list").append($("<h3>Current Teams:<h3>"));
      let teamlist = JSON.parse(data);
      for (x in teamlist) {
        let newTeamCard = $("<p>");
        let deleteButton = $("<button>");
        deleteButton.text("X");
        deleteButton.attr("class", "delete-button");
        deleteButton.attr("id", teamlist[x].id);
        newTeamCard.text(teamlist[x].name);
        newTeamCard.append(deleteButton);
        $("#team-list").append(newTeamCard);
      }
    })
  }

  //Teams API POST call
  function submitTeam(newTeam) {
    return $.ajax({
      url: "api/teams",
      data: newTeam,
      method: "POST"
    });
  }

  function handleTeamDelete(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/teams/" + id
    }).then(function() {
      getTeamList(uid);
    })
  }

});
