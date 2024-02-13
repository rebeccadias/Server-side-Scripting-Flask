from flask import Flask, request, jsonify
import requests
from datetime import datetime, timedelta
import time
from datetime import datetime
from dateutil.relativedelta import relativedelta

app = Flask(__name__)


FINNHUB_API_KEY = 'cms30mhr01qlk9b10me0cms30mhr01qlk9b10meg'
FINNHUB_COMPANY_PROFILE_URL = 'https://finnhub.io/api/v1/stock/profile2'
FINNHUB_QUOTE_URL = 'https://finnhub.io/api/v1/quote'
FINNHUB_RECOMMENDATION_TRENDS_URL = 'https://finnhub.io/api/v1/stock/recommendation'


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/stock/info', methods=['GET'])
def get_stock_info():
    ticker = request.args.get('symbol')
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400

    responses = {}

    # Fetch Company Profile
    profile_url = f"https://finnhub.io/api/v1/stock/profile2?symbol={ticker}&token={FINNHUB_API_KEY}"
    print(profile_url)
    responses['profile'] = requests.get(profile_url).json()

    if 'error' in responses['profile']:
        return jsonify({"error": "Invalid ticker symbol"}), 404

    # Fetch Stock Quote
    quote_url = f"https://finnhub.io/api/v1/quote?symbol={ticker}&token={FINNHUB_API_KEY}"
    responses['quote'] = requests.get(quote_url).json()

    # Fetch Stock Recommendation
    recommendation_url = f"https://finnhub.io/api/v1/stock/recommendation?symbol={ticker}&token={FINNHUB_API_KEY}"
    responses['recommendation'] = requests.get(recommendation_url).json()

    return jsonify(responses)

@app.route('/api/stock/chart', methods=['GET'])
def get_stock_chart():
    ticker = request.args.get('symbol')
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400

    # Calculate dates in the required format
    to_date = datetime.now().strftime('%Y-%m-%d')  # Today in YYYY-MM-DD
    from_date = (datetime.now() - relativedelta(months=6, days=1)).strftime('%Y-%m-%d')  # 6 months and 1 day prior

    # Construct the API URL for fetching historical data
    chart_url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/day/{from_date}/{to_date}?adjusted=true&sort=asc&apiKey=BKNanm3UkObHTvdgfAZNXgV7NrFu8aGr"
    print(chart_url)
    try:
        response = requests.get(chart_url)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock/news', methods=['GET'])
def get_stock_news():
    ticker = request.args.get('symbol')
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400

    # Calculate the date 30 days before today
    from_date = (datetime.now() - relativedelta(days=30)).strftime('%Y-%m-%d')
    to_date = datetime.now().strftime('%Y-%m-%d')

    news_url = f"https://finnhub.io/api/v1/company-news?symbol={ticker}&from={from_date}&to={to_date}&token={FINNHUB_API_KEY}"

    try:
        response = requests.get(news_url)
        response.raise_for_status()
        news_items = response.json()
        # Filter news items to include only those with non-empty image, url, headline, and datetime
        valid_news = [item for item in news_items if all(key in item and item[key] for key in ['image', 'url', 'headline', 'datetime'])]
        return jsonify(valid_news[:5])  # Return the first 5 valid news items
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/searchStockSummaryQuote')
def search_quote():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'Ticker symbol is required'}), 400

    response = requests.get(f"{FINNHUB_QUOTE_URL}?symbol={ticker}&token={FINNHUB_API_KEY}")
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch stock quote from Finnhub'}), response.status_code
    
@app.route('/searchRecommendationTrends/<tickerSymbol>')
def search_recommendation_trends(tickerSymbol):
    if not tickerSymbol:
        return jsonify({'error': 'Ticker symbol is required'}), 400
    
    response = requests.get(f"{FINNHUB_RECOMMENDATION_TRENDS_URL}?symbol={tickerSymbol}&token={FINNHUB_API_KEY}")
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch company details from Finnhub'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
