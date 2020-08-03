$(document).ready(function () {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var usernameInput = $("input#username-input");
  var clssInput = $("input#clss-input");
  var roleInput = $("input#role-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
    };

    var charData = {
      username: usernameInput.val().trim(),
      clss: clssInput.val().trim(),
      role: roleInput.val().trim()
    }

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpChar(userData.email, charData.username, charData.clss, charData.role)
    signUpUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
    usernameInput.val("");
    clssInput.val("");
    roleInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpChar(email, username, clss, role) {
    $.post("/api/signchar", {
      email: email,
      username: username,
      clss: clss,
      role: role
    });
  }
  
  function signUpUser(email, password) {
    $.post("/api/signup", {
      email: email,
      password: password,
    }).then(function (data) {
        window.location.replace("/teamlist");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text("That user already exists");
    $("#alert").fadeIn(500);
  }
});
