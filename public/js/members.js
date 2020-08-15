$(document).ready(function() {

  const submitButton = $("#submit-team");
  let uid;

  submitButton.on("click", function(event) {
    handleFormSubmit(event);
  })
  
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    uid = data.id;
  });

  function handleFormSubmit(event) {
    event.preventDefault();

    let teamname = $("#team-name").val().trim();
    let members = [];
    

    console.log(teamname);
    console.log(uid);

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
});
