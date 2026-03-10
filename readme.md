Portfolio Dashboard 

A Dynamic Portfolio Dashboard that allows investors to monitor their stock holdings with real-time insights including portfolio value, gain/loss, and financial metrics.

The application fetches stock market data from external sources and calculates portfolio performance dynamically.

Project Overview

This project demonstrates the ability to build a full-stack financial dashboard using modern web technologies.

The dashboard retrieves stock data from:

Yahoo Finance → Current Market Price (CMP)

Google Finance → P/E Ratio and EPS

The system processes this data in the backend and presents it in an interactive frontend dashboard.

Features

Add portfolio assets

View stock holdings in a dynamic table

Real-time stock price fetching

Portfolio value calculation

Gain/Loss visualization

Sector grouping

Interactive performance charts

Automatic data refresh

Responsive UI design

Tech Stack
Frontend

Next.js

React

TypeScript

Tailwind CSS

Recharts (for charts)

Backend

Node.js

Express

TypeScript

Puppeteer (Google Finance scraping)

Axios (Yahoo Finance data)

Database

MongoDB Atlas

Architecture

The backend follows Clean Architecture principles to maintain separation of concerns.

src
 ├── domain
 │     └── entities
 │
 ├── application
 │     └── usecases
 │
 ├── infrastructure
 │     └── services
 │
 └── presentation
       └── controllers
Data Flow
Frontend (Next.js)
        |
        |
        v
Backend API (Node.js)
        |
        |
        v
External Data Sources
   |             |
Yahoo Finance   Google Finance
   |             |
 CMP         P/E Ratio + EPS
Portfolio Table Columns

The dashboard displays the following information:

Column	                       Description
Particulars                  	Stock Name
Purchase Price	        Price at which stock was bought
Quantity	                  Number of shares
Investment           	Purchase Price × Quantity
Portfolio          %	Weight of stock in the portfolio
NSE/BSE                      	Stock exchange
CMP                     	Current Market Price
Present Value               	CMP × Quantity
Gain/Loss	                Present Value − Investment
P/E Ratio	                 Price to Earnings Ratio
EPS	                            Earnings Per Share



Data Sources
Yahoo Finance

Used to fetch Current Market Price (CMP).

Example endpoint:

https://query1.finance.yahoo.com/v8/finance/chart/TCS.NS
Google Finance

Used to retrieve:

P/E Ratio

EPS

Since Google Finance does not provide a public API, Puppeteer scraping is used.

Installation

Clone the repository

git clone https://github.com/Jobhishlal/Dashboard_portfolio
Backend Setup

Navigate to backend folder

cd backend

Install dependencies

npm install

Create .env file

PORT=********

MONGO_URI=*******
  
Run backend server

npm run dev

Frontend Setup

Navigate to frontend folder

cd frontend

Install dependencies

npm install

Create .env.local

NEXT_PUBLIC_API_URL=http://localhost:5000

Run development server

npm run dev
Dynamic Updates

Stock prices and portfolio values update automatically every 15 seconds using polling.

setInterval()
Sector Grouping

Stocks are grouped by sector to provide aggregated insights.

Example sectors:

Technology

Finance

Energy

Consumer

Sector summary includes:

Total investment

Total present value

Gain/Loss

Charts

Two main visualizations are implemented:

Portfolio Performance

Shows portfolio growth over time.

Sector Allocation

Displays investment distribution across sectors.

Technical Challenges
No Official APIs

Yahoo Finance and Google Finance do not provide official APIs.

Solution:

Yahoo Finance → unofficial JSON endpoint

Google Finance → Puppeteer scraping

Dynamic Web Content

Google Finance loads data dynamically.

Solution:

Use Puppeteer headless browser to extract required values.

Data Synchronization

Stock prices change frequently.

Solution:

Backend polling every 15 seconds to update values.

Author

Jobhish Lal
Full Stack Developer