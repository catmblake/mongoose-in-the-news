$(document).ready(function () {
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