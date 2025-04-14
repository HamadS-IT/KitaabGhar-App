# 📖 KitaabGhar – Secure eBook Reading App

**KitaabGhar** is a React Native mobile app designed to provide a secure and user-friendly eBook reading experience. With both online and offline access modes, strong DRM enforcement, and features like synced notes and semantic search, it ensures that users can enjoy their books securely on a single authorized device.

---

## ✅ Key Features

### 🔐 DRM (Digital Rights Management)

- Books are **encrypted using the device's unique ID** upon download.
- Each downloaded book is **locked to one device** and **cannot be accessed or downloaded on another**.
- If a book is **deleted outside the app**, it is blocked from re-downloading for **90 days**.
- Only the **original account** that downloaded the book can delete it — and only through the app.
- **Single-device login**: logging into a new device logs the user out of the previous one.
- Downloaded books remain **readable offline**, even if the user is logged out.

---

## 🌐 Online Mode

- Secure login and session handling.
- Access to:
  - **Purchased books**
  - **Recently added books**
- Online-only features:
  - **Read books** online
  - **Download books** for offline reading
  - **Semantic search** (if enabled)
  - **Per-page notes**, synced via MongoDB

> Notes and semantic search are only available in **online mode**.
> Notes are **synced across devices** via the backend.

---

## 📴 Offline Mode

- Access books already downloaded on the device.
- View **expiry date** for each book.
- **Book deletion** only allowed while logged into the **same account** used for download.
- No internet or login required to **read previously downloaded books**.
- Books are encrypted and readable **only on the original device**.

---

## 📝 Notes System

- Add notes **per page** while reading in online mode.
- Notes are saved to a **MongoDB database** and synced across devices.
- Notes are **scoped to the page** (i.e., only visible when that page is open).
- Not available in offline mode.

---

## 🔍 Semantic Search

- Some books support **semantic search** using natural language.
- Availability depends on the **publisher's choice at upload time**.
- Requires **online access**.

---

## 📱 Tech Stack

- **Framework**: React Native
- **PDF Rendering**: `react-native-pdf`
- **Encryption**: AES-256 with device binding
- **Notes & Auth Storage**: MongoDB (via backend API)
- **Local Storage**: Encrypted device storage

---

## 📦 Installation

### Prerequisites
- Node.js ≥ 16.x
- React Native CLI
- Android Studio / Xcode

### Setup

```bash
git clone https://github.com/HamadS-IT/KitaabGhar-App.git
cd KitaabGhar-App
npm install
npm run android    # For Android
npm run ios        # For iOS
```


---

## 🧪 Testing Checklist

- Test login/logout flow across multiple devices.
- Download a book and try opening it on another device (should be blocked).
- Read a book offline and confirm decryption works without login.
- Try deleting a book manually (outside the app) to trigger 90-day block.
- Add notes in online mode and verify they sync on another device.
- Test semantic search functionality (if enabled for the book).

---

## 🔐 DRM Summary

- Downloaded books are **AES-256 encrypted** and tied to the device.
- **One-device**, **one-account**, **one-session** model.
- Unauthorized deletion leads to **temporary block**.
- Offline reading supported, **but secure**.

---

## 📝 License

MIT License © 2025 Hamad Saqib

---

## 🙌 Credits

Special thanks to the open-source libraries and all contributors to the KitaabGhar project.

