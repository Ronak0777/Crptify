# 🛡️ Cryptify

> **"Shielding the Crypto Economy – One Wallet at a Time."**

**Cryptify** is an AI-driven blockchain intelligence platform that empowers crypto exchanges, regulators, and law enforcement to trace, verify, and prevent illegal transactions involving cryptocurrencies. It bridges the gap between decentralization and regulatory compliance through seamless KYC, real-time monitoring, and actionable forensic insights.

---

## 🚀 Features

- 🔐 **User Authentication & KYC**
  - Secure login & sign-up with background blur popup
  - Upload & verify PAN and Unique ID documents
  - Encrypted storage and GDPR-compliant processing

- 🧠 **Real-Time Transaction Monitoring**
  - Detect abnormal wallet behavior using AI/ML
  - Risk scoring engine with visual analytics
  - Live flagging of high-risk or non-compliant transactions

- 📊 **Admin & Law Enforcement Dashboard**
  - Overview of verified users, flagged wallets, and pending KYCs
  - Filter, investigate, and download compliance reports
  - Wallet linkage graph for tracing flow of illicit funds

- 🔗 **Crypto Exchange API Integration**
  - RESTful endpoints to enforce KYC at registration
  - Notify exchange when a wallet is flagged

- 📂 **Reports & Alerts**
  - Generate downloadable reports (CSV/PDF)
  - WebSocket-enabled real-time alert system

---

## 🧱 Tech Stack

| Layer         | Technology                                  |
| ------------- | ------------------------------------------- |
| Frontend      | Next.js, TailwindCSS, Heroicons            |
| Backend       | Node.js, Next.js                         |
| Database      | MongoDB (Mongoose ODM)                      |
| Real-Time     | WebSocket (Socket.IO)                       |
| KYC Storage   | Cloud Storage (Encrypted file uploads)      |
| Authentication| JWT-based Auth with Role Support            |
| AI/ML Engine  | Python microservice for risk scoring (planned) |

---

## 📸 Demo
https://drive.google.com/file/d/1MYgVWnMer_hVBjeexlytTlieW9be8mXR/view?usp=sharing
---

## 🔧 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/cryptify.git
cd cryptify
cd server
npm install

npm rundev
