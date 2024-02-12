document.addEventListener("DOMContentLoaded", function () {
  // Bind the form submission event
  document.getElementById("myForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const ticker = document.getElementById("ticker").value;
    fetch(`/search?ticker=${encodeURIComponent(ticker)}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Process and display the data as needed
        // You can update the DOM to show the response data
        displayData(data);
      })
      .catch((error) => console.error("Error:", error));
  });
});

function clearForm() {
  // This will reset all form values to their default
  document.getElementById("myForm").reset();
}
