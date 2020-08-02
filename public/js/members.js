$(document).ready(function() {

  const submitButton = $("#submit-team");

  submitButton.on("click", function(event) {
    handleFormSubmit(event);
  })
  
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    $(".member-id").text(data.id);
  });

  function handleFormSubmit(event) {
    event.preventDefault();

    let teamname = $("#team-name-input").val().trim();
    let members = [];

    if (!teamname) {
      return;
    }

    let newTeam = {
      name: $("#team-name-input").val().trim(),
      members: JSON.stringify(members),
      UserId: $("#member-id").val()
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
