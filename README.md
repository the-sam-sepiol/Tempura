# Tempura

---

## ⚠️ PLEASE BRANCH FROM WORKING INCREMENT ⚠️

---

## 🛠️ Setup Instructions

### 📦 Step 1: Download All Necessary Dependencies

Navigate and install dependencies as follows:

**In `/client` directory:**

```bash
cd client
npm install react
npm install react-router-dom
```

**In `/server` directory:**

```bash
cd ../server
npm install cors
npm install mongodb
npm install axios --save
```

---

### 💻 Step 2: Run the Application

Open two separate terminal windows:

#### **Terminal 1 (Server):**

Navigate to the `/server` directory and start the server:

```bash
cd server
npm start
```

- ✅ **Verify MongoDB connection** is successful.

#### **Terminal 2 (Client):**

Navigate to the `/client` directory and start the client app on port `3001`:

```bash
cd client
PORT=3001 npm start
```

---

### 🌐 Step 3: Access the Application

Visit the application in your browser:

```
http://localhost:3001
```

---
