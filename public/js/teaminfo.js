$(document).ready(function() {
  
  const teamid = $("#team-identify").attr("value");
  
  //Member ID (memid) is held globally to keep track of it consistently when creating new team members
  //memberList is just here to hold the members array in a global scope
  //accesstoken is used with the WoW API
  let memid = 0;
  let memberList;
  let accesstoken;

  //Gets team info, then 
  //pushes the members array to the global memberList variable
  //and calls function to print the cards for all existing members
  $.get("/api/team/" + teamid, function(data) {
    console.log("Successful GET: " + data.id + data.name + data.members);
    memberList = JSON.parse(data.members);

    for (x in memberList) {
      printMemberCard(memberList[x]);
      
      //Increments memid so new member IDs will ultimately be consistent with the list
      memid++;
    }
  });

  $("#add-member").on("click", function() {

    event.preventDefault();

    let name = $("#char-name").val().trim();
    let clss = $("#char-class").val();
    let role = $("#char-role").val();

    if (!name || name.length > 12) {
      alert("Name must be between 1 and 12 characters.")
      return;
    }
    
    var newChar = {
      id: memid,
      name: name,
      clss: clss,
      role: role
    }

    if (newChar.id >= 41) {
      alert("Team has too many members! Cannot add another (maximum is 40)");
      return;
    }     

    memid++;

    //We push the new character's info to memberList...
    memberList.push(newChar);

    //...and then we print their card to the page with the others.
    printMemberCard(newChar);
  })

  $("#save-button").on("click", function() {
    let update = {
      members: JSON.stringify(memberList)
    }
    console.log("Logging UPDATE from save-button-click: " + update);
    saveChanges(update);
  })

  function printMemberCard(member) {
    let memberCard = $(`<li id="${member.id}">${member.name} || ${member.clss}</li>`);

    if (member.id > 0) {
      switch (member.role) {
        case "Tank":
          memberCard.attr("clss", "tanks");
          $("#tank-list").append(memberCard);
          break;
        case "Healer":
          memberCard.attr("clss", "heals");
          $("#heal-list").append(memberCard);
          break;
        case "DPS":
          memberCard.attr("clss", "dps");
          $("#dps-list").append(memberCard);
          break;
        case "Utility":
          memberCard.attr("clss", "utils");
          $("#util-list").append(memberCard);
          break;
        }
      }
  }

  function saveChanges(update) {
    console.log("Logging UPDATE from SaveChanges: " + update)
    $.ajax({
      method: "PUT",
      url: "/api/teams/" + teamid,
      data: update
    }).then(function() {
      window.location.href = "/teamlist";
    })
  }

  //Pass getWoWProfile a realm and charname - it'll query the API and return that profile
  function getWoWProfile(realm, charname) {
    $.get("/api/wow").then(function (data) {
    
      //We use the "/api/wow" route to grab the api key from the local files via Node and dotenv - see in api-routes.js for more detail
      accesstoken = data.accesstoken; 
  
      //Query URL is a template literal composed from realm, charname, and access token info.
      let queryURL = `https://us.api.blizzard.com/profile/wow/character/${realm}/${charname}?namespace=profile-us&locale=en_US&access_token=${accesstoken}`;
  
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        return(response);
      });
    });
  }
})