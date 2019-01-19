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
  // On click function to empty all documents from the database
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
  });

  // Click function to save a note to the corresponding article
  $(".add-note").on("click", function() {
    var title = $("textarea.title").val().trim();
    var body = $("textarea.body").val().trim();
    var artId = $(this).data("article");
    console.log(title + body + artId);

    // $.ajax({
    //   method: "POST",
    //   url: `/articles/${artId}`,
    //   data: {
    //     title:
    //   }
    // })
  })
});