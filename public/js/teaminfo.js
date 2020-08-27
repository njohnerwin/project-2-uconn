$(document).ready(function () {

  /*//TESTING - DELETE THIS FUNCT -- Teams API GET call for members
  function teamInfoTest(id) {
      
  }*/


  const teamid = $("#team-identify").attr("value");

  //Member ID (memid) is held globally to keep track of it consistently when creating new team members
  //memberList is just here to hold the members array in a global scope
  let memid = 0;
  let memberList;

  //Gets team info, then 
  //pushes the members array to the global memberList variable
  //and calls function to print the cards for all existing members
  $.get("/api/team/" + teamid, function (data) {
    console.log("Successful GET: " + data.id + data.name + data.members);
    memberList = JSON.parse(data.members);

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

    if (!name || !clss) {
      return;
    }

    var newChar = {
      id: memid,
      name: name,
      clss: clss,
      role: role
    }

    //We push the new character's info to memberList...
    memberList.push(newChar);

    //...and then we print their card to the page with the others.
    printMemberCard(newChar);
  })

  function printMemberCard(member) {
    let memberCard = $(`<div class="card-front" id="${member.id}">${member.name} || ${member.clss}</div>`);

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
})