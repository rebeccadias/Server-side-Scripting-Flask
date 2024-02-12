document.addEventListener("DOMContentLoaded", function () {
    // Bind the form submission event
    document.getElementById("myForm").addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission
  
      const ticker = document.getElementById("ticker").value;
      fetch(`/search?ticker=${encodeURIComponent(ticker)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data); // Process and display the data as needed
          displayData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          displayData({ error: error.toString() });
        });
    });
  });
  
  function clearForm() {
    // This will reset all form values to their default
    document.getElementById("myForm").reset();
  }
  
  function displayData(data) {
    // Assuming you have a div with id="results" to display your results
    const resultsElement = document.getElementById('results');
    if (!resultsElement) {
      console.error('Results element not found.');
      return;
    }
  
    // Clear previous results
    resultsElement.innerHTML = '';
  
    // Check if there's an error in the data
    if (data.error) {
      resultsElement.innerHTML = `<p>Error: ${data.error}</p>`;
    } else {
      // Assuming 'data' is the JSON response from your Flask API
      // Display data as needed, example:
      resultsElement.innerHTML = `<p>Open: ${data.o}</p>
                                  <p>High: ${data.h}</p>
                                  <p>Low: ${data.l}</p>
                                  <p>Current: ${data.c}</p>
                                  <p>Previous Close: ${data.pc}</p>`;
    }
  }
  