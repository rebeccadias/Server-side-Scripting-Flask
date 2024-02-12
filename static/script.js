// var CompanyInfo = "";
var StockSummary = "";
// var recommendationTrends = "";

// Function to fetch and display Company Information; Company Information tab
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("myForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const ticker = document.getElementById("ticker").value;
      if (!ticker) {
        console.error("Ticker symbol is missing.");
        return;
      }

      try {
        await fetchCompanyInfo(ticker);
        await Promise.all([
          fetchStockQuote(ticker),
          recommendationTrends(ticker),
        ]);
        openTab(null, "Company"); // Adjusted for potential event is not defined error
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
});

async function fetchCompanyInfo(ticker) {
  return fetch(`/search/${encodeURIComponent(ticker)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      // CompanyInfo = data;
      displayCompanyInfo(data);
      // console.log(data);
      // displayData(data);
    });
}

function displayCompanyInfo(data) {
  console.log(data);
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
                <button class="tablinks" onclick="openTab(event, 'StockSummary'); DisplayStockQuote(); ">Stock Summary</button>

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

      // If an event is provided, then update the active class based on the event's currentTarget
      if (evt) {
        evt.currentTarget.className += " active";
      } else {
        // If no event is provided, find the tablink that matches tabName and set it as active manually
        for (i = 0; i < tablinks.length; i++) {
          if (tablinks[i].getAttribute("onclick").includes(tabName)) {
            tablinks[i].className += " active";
          }
        }
      }
    };
  }
}

// Function to fetch and display stock quote; Stock Summary tab
function fetchStockQuote() {
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

      if (data.error) {
        stockSummaryTab.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        StockSummary = data;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(
        "StockSummary"
      ).innerHTML = `<p>Error fetching stock quote: ${error.message}</p>`;
    });
}

function DisplayStockQuote() {
  const stockSummaryTab = document.getElementById("StockSummary");
  //  Update the Stock Summary tab with the quote data
  stockSummaryTab.innerHTML = `
          
          <p>Current Price: $${StockSummary.c}</p>
          <p>High Price of the Day: $${StockSummary.h}</p>
          <p>Low Price of the Day: $${StockSummary.l}</p>
          <p>Open Price of the Day: $${StockSummary.o}</p>
          <p>Previous Close Price: $${StockSummary.pc}</p>
        `;
  //edit this to display stock summary using html
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
function clearForm() {
  // This will reset all form values to their default
  document.getElementById("myForm").reset();
}
