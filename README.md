# 👗 WearShare - Premium Community Fashion Rental

Welcome to **WearShare**, a sustainable and community-driven clothing rental platform prioritizing zero-waste fashion. Experience a seamless and premium UI inspired by top platforms like Myntra, Ajio, and Flipkart!

## ✨ Key Features

- 🪄 **AI Virtual Try-On**: See how garments look on you before renting using advanced AI integration.
- 💳 **Secure Razorpay Checkout**: Integrated payment gateways supporting UPI, Cards, and Net Banking.
- 📦 **End-to-End Logistics Tracking**: Full control over Delivery, Return, Pickup, and Collect details during checkout.
- 🔍 **Dynamic Explore Feed**: Advanced filtering by size, price, and categories.
- 📱 **Premium UI & UX**: Fully responsive layouts featuring smooth micro-animations, glassmorphism, and intuitive navigation.
- 👥 **Community Dashboard**: Track what you are lending, renting, and the delivery status of each transaction.

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
A MongoDB instance is also required for database operations.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd wearshare
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to create your own localized `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in the required environment variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure string for authentication.
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay API keys (use live keys for real payments, test keys for sandbox testing).
   - `REPLICATE_API_TOKEN`: Replicate API token for the AI try-on feature.
   - Gmail app passwords and usernames for the email/OTP functionality.

### Running the App

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start exploring WearShare!

## 💳 A Note on Payments (Razorpay)

By default, the `.env.local` might be using **test keys** (`rzp_test_...`). 
To process **real money**:
1. Go to your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Complete the KYC (Know Your Customer) process.
3. Switch your dashboard to **Live Mode**.
4. Generate new API keys (`rzp_live_...`).
5. Replace the keys in your `.env.local` file and redeploy the app.

## 🛠 Tech Stack

- **Frontend**: Next.js, React, Custom Premium CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB (Mongoose)
- **AI Integrations**: Replicate API
- **Payments**: Razorpay

## 🤝 Contributing

We welcome community contributions. Feel free to open issues or submit pull requests for enhancements, bug fixes, or new features that align with sustainable fashion sharing.
