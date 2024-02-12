// Function to fetch and display Company Information; Company Information tab
document.addEventListener("DOMContentLoaded", function () {
  // Bind the form submission event
  document.getElementById("myForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const ticker = document.getElementById("ticker").value;
    // fetch(`/search?ticker=${encodeURIComponent(ticker)}`)
    fetch(`/search/${encodeURIComponent(ticker)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
  const resultsElement = document.getElementById("results");
  if (!resultsElement) {
    console.error("Results element not found.");
    return;
  }

  // Clear previous results
  resultsElement.innerHTML = "";

  if (data.error) {
    resultsElement.innerHTML = `<p>Error: ${data.error}</p>`;
  } else {
    // Create Tabs Container
    const tabsContainer = document.createElement("div");
    tabsContainer.setAttribute("id", "tabsContainer");
    tabsContainer.innerHTML = `
            <div class="tabs">
                <button class="tablinks active" onclick="openTab(event, 'Company')">Company</button>
                <button class="tablinks" onclick="openTab(event, 'StockSummary'); fetchAndDisplayStockQuote(); recommendationTrends();">Stock Summary</button>

                <button class="tablinks" onclick="openTab(event, 'Charts')">Charts</button>
                <button class="tablinks" onclick="openTab(event, 'LatestNews')">Latest News</button>
            </div>
            <div id="Company" class="tabcontent" style="display:block;">
                <h3>Company</h3>
                <p>Company information will be displayed here.</p>
            </div>
            <div id="StockSummary" class="tabcontent" style="display:none;">
                <h3>Stock Summary</h3>
                <p>Stock summary will be displayed here.</p>
            </div>
            <div id="Charts" class="tabcontent" style="display:none;">
                <h3>Charts</h3>
                <p>Charts will be displayed here.</p>
            </div>
            <div id="LatestNews" class="tabcontent" style="display:none;">
                <h3>Latest News</h3>
                <p>Latest news will be displayed here.</p>
            </div>
        `;
    resultsElement.appendChild(tabsContainer);

    // Adjusted function to switch between tabs
    window.openTab = function (evt, tabName) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";
    };
  }
}

// Function to fetch and display stock quote; Stock Summary tab
function fetchAndDisplayStockQuote() {
  const tickerSymbol = document.getElementById("ticker").value;
  if (!tickerSymbol) {
    console.error("Ticker symbol is missing.");
    return;
  }

  fetch(`/searchStockSummaryQuote?ticker=${encodeURIComponent(tickerSymbol)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const stockSummaryTab = document.getElementById("StockSummary");
      console.log("Stock Summary tab-Stock Summary data:");
      console.log(data);
      if (data.error) {
        stockSummaryTab.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        // Update the Stock Summary tab with the quote data
        stockSummaryTab.innerHTML = `
          <h3>Stock Summary for ${tickerSymbol}</h3>
          <p>Current Price: $${data.c}</p>
          <p>High Price of the Day: $${data.h}</p>
          <p>Low Price of the Day: $${data.l}</p>
          <p>Open Price of the Day: $${data.o}</p>
          <p>Previous Close Price: $${data.pc}</p>
        `;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(
        "StockSummary"
      ).innerHTML = `<p>Error fetching stock quote: ${error.message}</p>`;
    });
}

function recommendationTrends() {
  const tickerSymbol = document.getElementById("ticker").value;
  if (!tickerSymbol) {
    console.error("Ticker symbol is missing.");
    return;
  }

  fetch(`/searchRecommendationTrends/${encodeURIComponent(tickerSymbol)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const stockSummaryTab = document.getElementById("StockSummary");
      console.log("Stock Summary tab-Recommendation Trends data:");

      if (data.error) {
        stockSummaryTab.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        // Update the Stock Summary tab with the quote data
        //do nothing for now
        const latestTrends = data[0];
        console.log(latestTrends);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(
        "StockSummary"
      ).innerHTML = `<p>Error fetching stock quote: ${error.message}</p>`;
    });
}
