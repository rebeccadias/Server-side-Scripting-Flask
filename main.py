from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)


# Replace YOUR_FINNHUB_API_KEY with your actual API key from Finnhub
FINNHUB_API_KEY = 'cms30mhr01qlk9b10me0cms30mhr01qlk9b10meg'
# FINNHUB_BASE_URL = 'https://finnhub.io/api/v1/quote'

FINNHUB_BASE_URL ='https://finnhub.io/api/v1/stock/profile2'

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/search')
def search():
    
    ticker = request.args.get('ticker')
    # print(ticker)
    if not ticker:
        # Here you can decide to redirect back to the form with an error message or just return a simple error JSON
        return jsonify({'error': 'Ticker symbol is required'}), 400

    response = requests.get(f"{FINNHUB_BASE_URL}?symbol={ticker}&token={FINNHUB_API_KEY}")
    if response.status_code == 200:
        # Assuming you want to return the fetched data as JSON
        return jsonify(response.json())
    else:
        # Handle errors from the Finnhub API
        return jsonify({'error': 'Failed to fetch data from Finnhub'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)



