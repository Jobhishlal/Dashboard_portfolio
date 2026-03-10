const axios = require('axios');

async function testYahoo() {
    const symbol = 'RELIANCE.NS';
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        const result = response.data.quoteResponse.result[0];
        console.log('Price:', result.regularMarketPrice);
        console.log('PE Ratio:', result.trailingPE);
        console.log('EPS:', result.epsTrailingTwelveMonths);
        console.log('Book Value:', result.bookValue);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testYahoo();
