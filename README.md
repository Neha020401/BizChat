# BizChat 💬

**BizChat** is a full-stack web application built using **Spring Boot, React.js, Vite, Tailwind CSS, and MongoDB Atlas**.

---

## 🛠️ Tech Stack

### Backend

| Technology      | Version / Tool |
| --------------- | -------------- |
| Java            | 17             |
| Spring Boot     | —              |
| Build Tool      | Maven          |
| Authentication  | JWT            |
| Database Driver | MongoDB        |

### Frontend

| Technology                | Tool          |
| ------------------------- | ------------- |
| Framework                 | React.js      |
| Build Tool                | Vite          |
| Styling                   | Tailwind CSS  |
| Runtime / Package Manager | Node.js / npm |

### Database

* **MongoDB Atlas**

---

## 📁 Project Structure

```text
bizchat/
│
├── server/                         # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           └── application.properties
│   └── ...
│
├── interface/                     # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

The project consists of two main applications:

* `server/` — Spring Boot backend
* `interface/` — React + Vite frontend

---

# 🚀 Getting Started

Follow the steps below to set up **BizChat** locally.

## 1. Clone the Repository

Clone the repository using Git:

```bash
git clone <your-repository-url>
```

Move into the project directory:

```bash
cd bizchat
```

---

# ☕ Backend Setup

## 2. Install Java 17

BizChat uses **Java 17**.

Make sure Java 17 is installed on your system.

Verify your Java installation:

```bash
java -version
```

You should see Java 17 or a compatible Java 17 installation.

---

## 3. Configure MongoDB and JWT

Navigate to:

```text
server/src/main/resources/
```

Create a file named:

```text
application.properties
```

Add the following configuration:

```properties
spring.data.mongodb.uri=mongoatlasuri

jwt.secret=generateyourjwttoken
jwt.expiration=1200998877
```

### MongoDB Configuration

Replace:

```properties
spring.data.mongodb.uri=mongoatlasuri
```

with your own **MongoDB Atlas connection URI**.

For example:

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/<database>
```

### JWT Configuration

Replace:

```properties
jwt.secret=generateyourjwttoken
```

with a strong, private JWT secret.

For example:

```properties
jwt.secret=your-secure-jwt-secret
```

> **⚠️ Security Warning**
>
> Never commit your real MongoDB credentials, connection string, or JWT secret to a public repository.

---

## 4. Run the Backend

Open a terminal and navigate to the `server` directory:

```bash
cd server
```

### Windows

If the project includes the Maven Wrapper:

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

### Alternatively, Using Maven Globally

If Maven is installed globally:

```bash
mvn spring-boot:run
```

The Spring Boot backend should now start successfully.

---

# 🎨 Frontend Setup

## 5. Install Node.js

The frontend is built using **React.js + Vite**.

Install Node.js on your system.

Verify the Node.js installation:

```bash
node -v
```

Also verify npm:

```bash
npm -v
```

---

## 6. Install Frontend Dependencies

Navigate to the `interface` directory:

```bash
cd interface
```

Install the required dependencies:

```bash
npm install
```

This will install all packages specified in `package.json`.

---

## 7. Run the Frontend

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

It will usually look similar to:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

# ▶️ Running the Complete Project

BizChat requires **both the backend and frontend** to be running.

You can use two separate terminals.

### Terminal 1 — Backend

```bash
cd server
mvnw.cmd spring-boot:run
```

### Terminal 2 — Frontend

```bash
cd interface
npm install
npm run dev
```

The application follows this architecture:

```text
┌─────────────────────┐
│   React + Vite      │
│     Frontend        │
└──────────┬──────────┘
           │
           │ HTTP / API
           ▼
┌─────────────────────┐
│    Spring Boot      │
│      Backend        │
└──────────┬──────────┘
           │
           │ MongoDB Driver
           ▼
┌─────────────────────┐
│    MongoDB Atlas    │
│      Database       │
└─────────────────────┘
```

---

# ⚙️ Environment Configuration

The backend requires the following configuration:

```text
server/src/main/resources/application.properties
```

Example:

```properties
spring.data.mongodb.uri=mongoatlasuri
jwt.secret=generateyourjwttoken
jwt.expiration=1200998877
```

Replace the placeholder values with your actual configuration before starting the backend.

### 🔐 Security

**Never upload sensitive credentials to GitHub.**

Do not commit:

* MongoDB usernames
* MongoDB passwords
* MongoDB connection strings
* JWT secrets
* API keys
* Other private credentials

For production applications, consider using environment variables or a secure secrets-management solution.

---

# 🧰 Troubleshooting

## Java Is Not Recognized

If you receive:

```text
'java' is not recognized as an internal or external command
```

Make sure Java 17 is installed and that the Java `bin` directory has been added to your system `PATH`.

Verify:

```bash
java -version
```

---

## npm Is Not Recognized

If you receive:

```text
'npm' is not recognized as an internal or external command
```

Install Node.js and restart your terminal or VS Code.

Then verify:

```bash
node -v
npm -v
```

---

## Frontend Dependencies Are Missing

From the `interface` directory, run:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

---

## MongoDB Connection Error

If the backend cannot connect to MongoDB Atlas, verify the following:

* Your MongoDB Atlas URI is correct.
* Your MongoDB username is correct.
* Your MongoDB password is correct.
* Your database is accessible.
* Your IP address is allowed in **MongoDB Atlas Network Access**.
* Your `application.properties` file exists at:

```text
server/src/main/resources/application.properties
```

---

# 📌 Quick Setup

## Backend

```bash
cd server
mvnw.cmd spring-boot:run
```

## Frontend

```bash
cd interface
npm install
npm run dev
```

> Make sure `application.properties` is properly configured before starting the backend.

---

# 📄 License

Add your preferred license here if applicable.

For example:

```text
MIT License
```

---

# 👨‍💻 Author

**BizChat**

Built with:

* Java
* Spring Boot
* React.js
* Vite
* Tailwind CSS
* MongoDB Atlas
