from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Use your actual API key from Finnhub
FINNHUB_API_KEY = 'cms30mhr01qlk9b10me0cms30mhr01qlk9b10meg'
FINNHUB_COMPANY_PROFILE_URL = 'https://finnhub.io/api/v1/stock/profile2'
FINNHUB_QUOTE_URL = 'https://finnhub.io/api/v1/quote'

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/search')
def search_company():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'Ticker symbol is required'}), 400
    
    response = requests.get(f"{FINNHUB_COMPANY_PROFILE_URL}?symbol={ticker}&token={FINNHUB_API_KEY}")
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch company details from Finnhub'}), response.status_code

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

if __name__ == '__main__':
    app.run(debug=True)
