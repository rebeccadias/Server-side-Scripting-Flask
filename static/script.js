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
  const ticker = document.getElementById("ticker").value.trim().toUpperCase();
  if (!ticker) {
    console.error("Ticker symbol is missing.");
    return;
  }

  document.getElementById("error-message").style.display = "none";

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
    stockData["news"] = newsData;
  } catch (error) {
    console.error("Error fetching news data:", error);
    displayError(error.message);
  }
}

function displayCompanyInfo(data) {
  const companyInfoElement = document.getElementById("companyInfo");

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
}

function displayStockQuote(ticker, quote, recommendationTrends) {
  var currentDate = new Date();
  var options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  var formattedDate = currentDate.toLocaleDateString("en-GB", options);
  formattedDate = formattedDate.replace(/(\d+)\s(\w+)\s(\d+)/, "$1 $2, $3");

  const stockQuoteElement = document.getElementById("stockSummary");

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
  <div class="rec-trends-text"> Recommendation Trends </div> 
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

  const tabContents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  const tabLinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active");
  }
}

function displayCharts() {
  if (!stockData["chart"] || !stockData["chart"].results) {
    console.error("No chart data available");
    return;
  }

  const chartData = stockData["chart"].results;
  const ticker = document.getElementById("ticker").value.trim().toUpperCase();
  const today = new Date().toISOString().slice(0, 10);
  const seriesDataPrice = chartData.map((item) => [item.t, item.c]);
  const seriesDataVolume = chartData.map((item) => [item.t, item.v]);
  const maxVolume = Math.max(...seriesDataVolume.map((item) => item[1])); // Find the highest volume value
  const yAxisVolumeMax = maxVolume * 1.2; // Increase by 20% for some headroom

  Highcharts.stockChart("charts", {
    chart: {
      zoomType: "x",
    },
    title: {
      text: `Stock Price ${ticker} ${today}`,
    },
    subtitle: {
      text: '<a href="https://polygon.io/" target="_blank">Source: Polygon.io</a>',
      useHTML: true,
    },
    xAxis: {
      type: "datetime",
    },
    plotOptions: {
      column: {
        pointWidth: 4,
      },
    },
    yAxis: [
      {
        // Primary Y-Axis (Stock Price) - Set on the left
        labels: {
          formatter: function () {
            return this.value;
          },
        },
        title: {
          text: "Stock Price",
        },
        resize: {
          enabled: true,
        },
        opposite: false, // This ensures the axis is on the left
      },
      {
        // Secondary Y-Axis (Volume) - Set on the right
        max: yAxisVolumeMax, // Increase by 20% for some headroom
        title: {
          text: "Volume",
        },
        labels: {
          formatter: function () {
            return this.value >= 1000000
              ? `${this.value / 1000000}M`
              : `${this.value / 1000}k`;
          },
        },
        opposite: true, // This ensures the axis is on the right
      },
    ],
    series: [
      {
        name: "Stock Price",
        type: "area",
        data: seriesDataPrice,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        threshold: null,
        pointPlacement: "on",
      },
      {
        name: "Volume",
        type: "column",
        yAxis: 1, // This assigns the series to the secondary Y-axis
        data: seriesDataVolume,
        color: "black",
        pointPlacement: "on",
      },
    ],
    rangeSelector: {
      inputEnabled: false,
      enabled: true,
      buttons: [
        {
          type: "day",
          count: 7,
          text: "7d",
        },
        {
          type: "day",
          count: 15,
          text: "15d",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
        },
      ],
      selected: 0,
    },
  });
}

function displayNews() {
  const newsData = stockData["news"];
  const newsElement = document.getElementById("latestNews");
  let newsHTML = "";

  newsData.forEach((news) => {
    var formattedDate = formatDate(news.datetime);

    newsHTML += `
          <div class="news-item">
            <div class="news-item-image">
              <img src="${news.image}" alt="News Image" >
            </div>
            <div class="news-item-info">
              <div class="title">${news.headline}</div> 
              <div class="date"> ${formattedDate}</div> 
              <div class="og-post"><a href="${news.url}" target="_blank">See Original Post</a></div>
            </div>
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

function formatDate(dateString) {
  const date = new Date(parseInt(dateString) * 1000);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate.replace(
    /(\d{1,2}) (\w+) (\d{4})/,
    (match, day, month, year) => `${day} ${month}, ${year}`
  );
}
