const axios = require('axios');
const cheerio = require('cheerio');

async function testScraping() {
    const ticker = 'RELIANCE';
    const exchange = 'NSE';
    const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        // Google Finance Price selectors: .YMlS1d, .fxKb9e
        const price = $('.YMlS1d').text() || $('.fxKb9e').text();
        console.log('Scraped Price:', price);

        // P/E Ratio and EPS are often in the "About" or "Key stats" section
        // Let's print some text to see if we can find them
        const stats = $('.P6O9m').text(); // This is often a container for stats
        console.log('Stats length:', stats.length);

        // Search for P/E Ratio in the whole text if needed
        const bodyText = $('body').text();
        const peMatch = bodyText.match(/P\/E ratio[\s\n]+([\d,.]+)/i);
        console.log('PE Ratio Match:', peMatch ? peMatch[1] : 'Not found');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testScraping();
