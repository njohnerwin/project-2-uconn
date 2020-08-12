$(document).ready(function() {

  const submitButton = $("#submit-team");
  let uid;

  getTeamList();

  submitButton.on("click", function(event) {
    handleTeamSubmit(event);
  })
  
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    uid = data.id;
  });

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

  function submitTeam(newTeam) {
    return $.ajax({
      url: "api/teams",
      data: newTeam,
      method: "POST"
    });
  }

  function getTeamList() {
    $.get("/api/teams", function(data) {
      $("#teamlist").append($(`
      <p>${data}</p>
      `))
    })
  }

});
