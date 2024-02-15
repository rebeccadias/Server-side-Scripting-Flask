let stockData = {}; // Object to hold all fetched data

document.addEventListener("DOMContentLoaded", function () {
  hideAllTabs();
  document.getElementById("tabs").style.display = "none"; // Initially hide tabs
});

function hideAllTabs() {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  const tablinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
}

async function searchStock() {
  const ticker = document.getElementById("ticker").value.trim();
  if (!ticker) {
    console.error("Ticker symbol is missing.");
    return;
  }

  // Show tabs container upon search
  // Initially show tabs
  document.getElementById("error-message").style.display = "none";

  // Proceed with showing the Company tab as active
  hideAllTabs();

  try {
    // Fetch company profile
    const profileResponse = await fetch(
      `/api/stock/info?symbol=${encodeURIComponent(ticker)}`
    );
    if (!profileResponse.ok) throw new Error("Network response was not ok");
    const profileData = await profileResponse.json();
    if (profileData.profile.name === undefined) {
      document.getElementById("tabs").style.display = "none";
      document.getElementById("error-message").innerText =
        "Error: No record has been found, please enter a valid symbol.";
      document.getElementById("error-message").style.display = "block";
      throw new Error(profileData.error);
    }
    document.getElementById("tabs").style.display = "block";
    document.getElementById("Company").style.display = "block";
    const companyTab = document.querySelector('.tablink[onclick*="Company"]');
    if (companyTab) {
      companyTab.classList.add("active");
    }
    console.log(profileData);
    displayCompanyInfo(profileData.profile);
    displayStockQuote(
      profileData.profile.ticker,
      profileData.quote,
      profileData.recommendation[0]
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    displayError(error.message);
  }

  try {
    // Fetch chart data
    const chartResponse = await fetch(
      `/api/stock/chart?symbol=${encodeURIComponent(ticker)}`
    );
    if (!chartResponse.ok) throw new Error("Network response was not ok");
    const chartData = await chartResponse.json();
    console.log(chartData);
    stockData["chart"] = chartData; // Store chart data for later use
    // displayCharts()
  } catch (error) {
    console.error("Error fetching chart data:", error);
    displayError(error.message);
  }

  try {
    // Fetch news data
    const newsResponse = await fetch(
      `/api/stock/news?symbol=${encodeURIComponent(ticker)}`
    );
    if (!newsResponse.ok) throw new Error("Network response was not ok");
    const newsData = await newsResponse.json();
    console.log(newsData);
    stockData["news"] = newsData; // Store news data for later use
  } catch (error) {
    console.error("Error fetching news data:", error);
    displayError(error.message);
  }
  // Show the Company tab as the default view
  // openTab(null, 'Company');
}

function displayCompanyInfo(data) {
  const companyInfoElement = document.getElementById("companyInfo");
  // Ensure the structure is in place or recreate it
  companyInfoElement.innerHTML = `

<div class="company-info">
<div class="company-styling">
<table>
   

  <tr>
  <td colspan="2"><img src="${data.logo}" alt="Company Logo" /></td>
 </tr>
 <tr> 
    <th>Company Name</th>
    <td>${data.name}</td>
  </tr>
  <tr>
    <th>Stock Ticker Symbol</th>
    <td>${data.ticker}</td>
  </tr>
  <tr>
    <th>Stock Exchange Code</th>
    <td>${data.exchange}</td>
  </tr>
  <tr>
    <th>Company Start Date</th>
    <td>${data.ipo}</td>
  </tr>
  <tr>
    <th>Category</th>
    <td>${data.finnhubIndustry}</td>
  </tr>
</table>
</div>


</div>




  `;
  // Continue populating other data as needed
}

function displayStockQuote(ticker, quote, recommendationTrends) {
  // const ticker = document.getElementById("ticker").value.trim();
  var currentDate = new Date();
  var options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  // Format the date as "22 January, 2024"
  var formattedDate = currentDate.toLocaleDateString("en-US", options);

  const stockQuoteElement = document.getElementById("stockSummary");
  // Ensure the structure is in place or recreate it
  stockQuoteElement.innerHTML = `<div class="quote-info">
  <div class="quote-styling">
      <table>
          <tr>
              <th>Stock Ticker Symbol</th>
              <td>${ticker}</td>
          </tr>
          <tr>
              <th>Trading Day</th>
              <td>${formattedDate}</td>
          </tr>
          <tr>
              <th>Previous Closing Price</th>
              <td>${quote.pc}</td>
          </tr>
          <tr>
              <th>Opening Price</th>
              <td>${quote.o}</td>
          </tr>
          <tr>
              <th>High Price</th>
              <td>${quote.h}</td>
          </tr>
          <tr>
              <th>Low Price</th>
              <td>${quote.l}</td>
          </tr>
          <tr>
              <th>Change</th>
              <td style="display: flex; align-items: center;">${
                quote.d
              } <div class="stock-arrow"> <img src="${
    quote.d < 0
      ? "../static/img/RedArrowDown.png"
      : "../static/img/GreenArrowUp.png"
  }" alt="Arrow" /></div> </td>
          </tr>
          <tr>
              <th>Change Percent</th>
              <td style="display: flex; align-items: center;">${
                quote.dp
              }<div class="stock-arrow"> <img src="${
    quote.d < 0
      ? "../static/img/RedArrowDown.png"
      : "../static/img/GreenArrowUp.png"
  }" alt="Arrow" /></div></td>
          </tr>
      </table>
  </div>

  <div class="filler"></div>

  <div class="recommendations-tab">
      <h4 class="sell">Strong <br> Sell </h4>
      <div class="recommendation-trends">
          <div class="recommendation-trends-child1">
              ${recommendationTrends.strongSell}
          </div>
          <div class="recommendation-trends-child2">
              ${recommendationTrends.sell}
          </div>
          <div class="recommendation-trends-child3">
              ${recommendationTrends.hold}
          </div>
          <div class="recommendation-trends-child4">
              ${recommendationTrends.buy}
          </div>
          <div class="recommendation-trends-child5">
              ${recommendationTrends.strongBuy}
          </div>
      </div>
      <h4 class="buy">Strong <br> Buy </h4>
  </div>
</div>


  `;
}

function displayError(message) {
  // const resultsElement = document.getElementById("results");
  // resultsElement.innerHTML = `<p>Error: ${message}</p>`;
  console.log(message);
}

function clearForm() {
  // Reset the form input values
  document.getElementById("myForm").reset();

  // Hide the tabs container
  document.getElementById("tabs").style.display = "none";
  document.getElementById("error-message").style.display = "none";

  // Hide the tab contents without clearing their innerHTML
  const tabContents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  // Remove the 'active' class from all tabs
  const tabLinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active");
  }

  // Optionally, also clear any error or information messages
  // document.getElementById("results").innerHTML = '';
}

function displayCharts() {
  // Process and display chart data
  // This part depends on how you're integrating with your charting library
  // For example, you might need to map `chartData` to the format expected by HighCharts or Chart.js
  // Then, you'd render the chart using the mapped data
  // For now, let's just log the chart data
  const chartData = stockData["chart"];
  // console.log(chartData);
  // Display chart data
  const chartElement = document.getElementById("charts");
  chartElement.innerHTML = `<p>Chart data will be displayed here.</p>`;
}

function displayNews() {
  const newsData = stockData["news"];
  const newsElement = document.getElementById("latestNews");
  let newsHTML = "";

  newsData.forEach((news) => {
    newsHTML += `
          <div class="news-item">
              <p><a href="${news.url}" target="_blank">${news.headline}</a></p>
              <img src="${
                news.image
              }" alt="News Image" style="width:100px;"><br>
              <span>Published at: ${new Date(
                news.datetime * 1000
              ).toLocaleDateString()}</span>
          </div>
      `;
  });

  newsElement.innerHTML = newsHTML;
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  if (tabName === "Charts") displayCharts();
  if (tabName === "LatestNews") displayNews();
}
