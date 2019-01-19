$(document).ready(function () {
  // Attaching the scrape route to a click event
  $("#scrape").on("click", function () {
    $.ajax({
      method: "GET",
      url: "/scrape",
      success: function (response) {
        setTimeout(function () {
          window.location.reload();
        }, 1000)
      }
    })
      .catch(function (err) {
        console.log(err);
        alert(err.responseText);
      });
  });

  $("#empty").on("click", function () {
    $.ajax({
      method: "DELETE",
      url: "/scrape"
    })
      .then(function (data) {
        console.log(data);
        window.location.reload();
      })
      .catch(function (err) {
        console.log(err);
        alert(err.responseText);
      });
  });
  // On click function to save an article by it's id
  $(".save").on("click", function () {
    alert("Saved!");
    var savedId = $(this).data("id");
    console.log(savedId);
    $.ajax({
      method: "POST",
      url: "/saved",
      data: {
        id: savedId,
        saved: true
      }
    })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (err) {
        console.log(err);
        alert(err.responseText);
      });
  })
});