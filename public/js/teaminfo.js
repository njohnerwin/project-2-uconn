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

  $("#save-button").on("click", function () {
    let update = {
      members: JSON.stringify(memberList)
    }
    console.log("Logging UPDATE from save-button-click: " + update);
    saveChanges(update);
  })

  $(".column").on("click", ".member-card", async function(event) {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
    printWoWProfile(realmslug, (this.id).toLowerCase(), content);
  });

  function printMemberCard(member) {
    let memberCard = $(`<div class="member-card" id="${member.name}">${member.name} || ${member.clss}</div>`);
    let cardContent = $(`<div class="card-content" id="${member.name}-content"></div>`)

    cardContent.append($(`<p id="race-field">Race: </p>`));
    cardContent.append($(`<p id="gender-field">Gender: </p>`));
    cardContent.append($(`<p id="spec-field">Spec: </p>`));
    cardContent.append($(`<p id="clvl-field">Level: </p>`));
    cardContent.append($(`<p id="ilvl-field">ILVL: </p>`));

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

  function saveChanges(update) {
    console.log("Logging UPDATE from SaveChanges: " + update)
    $.ajax({
      method: "PUT",
      url: "/api/teams/" + teamid,
      data: update
    }).then(function () {
      window.location.href = "/teamlist";
    })
  }

  //Pass getWoWProfile a realm and charname - it'll query the API and return that profile
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

  function printWoWProfile(realm, charname, dataField) {
    $.get("/api/wow").then(function (data) {

      //We use the "/api/wow" route to grab the api key from the local files via Node and dotenv - see in api-routes.js for more detail
      accesstoken = data.accesstoken;

      //Query URL is a template literal composed from realm, charname, and access token info
      let queryURL = `https://us.api.blizzard.com/profile/wow/character/${realm}/${charname}?namespace=profile-us&locale=en_US&access_token=${accesstoken}`;

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function (response) {
        console.log(response);
        dataField.children[0].append(response.race.name);
        dataField.children[1].append(response.gender.name);
        dataField.children[2].append(response.active_spec.name);
        dataField.children[3].append(response.level);
        dataField.children[4].append(response.average_item_level);
      });
    });
  }
})