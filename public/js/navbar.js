$(document).ready(function() {
  //Controls for the navbar links
  if (window.location.pathname == "/") {
    $("#nav-logout").css("display", "none");
    $("#nav-login").css("display", "none");
    $("#nav-signup").css("display", "block");
  } else if (window.location.pathname == "/signup") {
    $("#nav-logout").css("display", "none");
    $("#nav-login").css("display", "block");
    $("#nav-signup").css("display", "none");
  } else if (window.location.pathname == ("/teamlist" || "/teaminfo" || "charinfo")) {
    $("#nav-logout").css("display", "block");
    $("#nav-login").css("display", "none");
    $("#nav-signup").css("display", "none");
  }
})