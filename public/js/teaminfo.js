$(document).ready(function () {

  const teamid = $("#team-identify").attr("value");

  //Member ID (memid) is held globally to keep track of it consistently when creating new team members
  //memberList is just here to hold the members array in a global scope
  //accesstoken is used with the WoW API
  let memid = 0;
  let memberList;
  let accesstoken;
  let realmslug;

  //Gets team info, then 
  //pushes the members array to the global memberList variable
  //and calls function to print the cards for all existing members
  $.get("/api/team/" + teamid, function (data) {
    console.log("Successful GET: " + data.id + data.name + data.realm + data.members);
    realmslug = data.realm;
    memberList = JSON.parse(data.members);
    realmslug = data.realm;

    for (x in memberList) {
      printMemberCard(memberList[x]);

      //Increments memid so new member IDs will ultimately be consistent with the list
      memid++;
    }
  });

  //This pulls values from the input fields and uses it to push a new member to the live memberList array
  $("#add-member").on("click", function () {

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

  //Saves changes made to the memberList array
  $("#save-button").on("click", function () {
    let update = {
      members: JSON.stringify(memberList)
    }
    console.log("Logging UPDATE from save-button-click: " + update);
    saveChanges(update);
  })
  
  //Expands and calls for WoW Profile API information on the selected user
  $(".column").on("click", ".member-card", function(event) {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      if ($(`#${this.id}-sys`).attr("data-success") == "true") {
        return;
      } printWoWProfile(realmslug, this.id);
    }  
  });

  //Deletes the selected user and immediately saves changes
  $(".column").on("click", ".member-delete", function(event) {
    if (confirm("Are you sure you want to delete? (Changes will be saved)") == true) {
      for (x in memberList) {
        if (memberList[x].id == this.id) {
          console.log(memberList[x].id);
          memberList.splice(x, 1);
        }
      }
      let update = {
        members: JSON.stringify(memberList)
      }
      console.log("Logging UPDATE from save-button-click: " + update);
      saveChanges(update);
    };
  });

  //The function used to create and render new "cards" for each member on the team
  function printMemberCard(member) {
    //Builds the distinct HTML pieces of the member card...
    let nameID = (member.name).toLowerCase();
    let memberCard = $(`<div class="member-card" id="${nameID}">${member.name} || ${member.clss}</div>`);
    let cardContent = $(`<div class="card-content" id="${nameID}-content"></div>`)
    let deleteButton = $(`<button class="member-delete" id="${member.id}">X</button>`);

    //...then constructs it step by step...
    memberCard.append(deleteButton);
    cardContent.append($(`<p class="datapoint" id=${nameID}-race>Race: </p>`));
    cardContent.append($(`<p class="datapoint" id="${nameID}-gender">Gender: </p>`));
    cardContent.append($(`<p class="datapoint" id="${nameID}-spec">Spec: </p>`));
    cardContent.append($(`<p class="datapoint" id="${nameID}-clvl">Level: </p>`));
    cardContent.append($(`<p class="datapoint" id="${nameID}-ilvl">ILVL: </p>`));
    cardContent.append($(`<p class="sys-message" id="${nameID}-sys">No data for ${member.name}</p>`))

    //...and appends it to the appropriate list based on role.
    if (member.id > 0) {
      switch (member.role) {
        case "Tank":
          memberCard.attr("clss", "tanks");
          $("#tank-list").append(memberCard);
          $("#tank-list").append(cardContent);
          break;
        case "Healer":
          memberCard.attr("clss", "heals");
          $("#heal-list").append(memberCard);
          $("#heal-list").append(cardContent);
          break;
        case "DPS":
          memberCard.attr("clss", "dps");
          $("#dps-list").append(memberCard);
          $("#dps-list").append(cardContent);
          break;
        case "Utility":
          memberCard.attr("clss", "utils");
          $("#util-list").append(memberCard);
          $("#util-list").append(cardContent);
          break;
      }
    }
  }

  //The function used to convert the live memberList to a JSON string and push those changes to the database
  function saveChanges(update) {
    console.log("Logging UPDATE from SaveChanges: " + update)
    $.ajax({
      method: "PUT",
      url: "/api/teams/" + teamid,
      data: update
    }).then(function () {
      location.reload();
    })
  }

  //Pass getWoWProfile a realm and charname - it'll query the API and return that profile (testing function)
  function getWoWProfile(realmslug, charname) {
    $.get("/api/wow").then(function (data) {

      //We use the "/api/wow" route to grab the api key from the local files via Node and dotenv - see in api-routes.js for more detail
      accesstoken = data.accesstoken;

      //Query URL is a template literal composed from realm, charname, and access token info
      let queryURL = `https://us.api.blizzard.com/profile/wow/character/${realmslug}/${charname}?namespace=profile-us&locale=en_US&access_token=${accesstoken}`;

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function (response) {
        console.log(response);
        return (response);
      });
    });
  }

  //Similar to getWoWProfile, but repurposed to actually render the data to the fields on the character card
  function printWoWProfile(realm, charname) {
    $.get("/api/wow").then(function (data) {

      //We use the "/api/wow" route to grab the api key from the local files via Node and dotenv - see in api-routes.js for more detail
      accesstoken = data.accesstoken;

      //Query URL is a template literal composed from realm, charname, and access token info
      let queryURL = `https://us.api.blizzard.com/profile/wow/character/${realm}/${charname}?namespace=profile-us&locale=en_US&access_token=${accesstoken}`;

      $.ajax({
        url: queryURL,
        method: "GET",
        error: function() {
          console.log("Error looking up that stuff");
          $(`#${charname}-content`).addClass("card-content-dead");
        }
      }).then(function(response) {
        console.log(response);
        $(`#${charname}-race`).append(response.race.name);
        $(`#${charname}-gender`).append(response.gender.name);
        $(`#${charname}-spec`).append(response.active_spec.name);
        $(`#${charname}-clvl`).append(response.level);
        $(`#${charname}-ilvl`).append(response.average_item_level);
        $(`#${charname}-sys`).text(`Data for ${response.name}`);
        $(`#${charname}-sys`).attr("data-success", "true");
      });
    });
  }
})