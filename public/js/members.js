$(document).ready(function() {

  const submitButton = $("#submit-team");
  let uid;

  //When Submit is clicked, handleTeamSubmit
  submitButton.on("click", function(event) {
    handleTeamSubmit(event);
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

  //Teams API POST call
  function submitTeam(newTeam) {
    return $.ajax({
      url: "api/teams",
      data: newTeam,
      method: "POST"
    });
  }

  //Teams API GET Call
  function getTeamList(uid) {
    $.get("/api/teams/" + uid, function(data) {
      console.log("Successful GET: " + data);
    })
  }

});
