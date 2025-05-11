Elbette! İşte verdiğiniz proje `README.md` dosyasına uygun bir `CONTRIBUTING.md` metni:

---

# Contributing to OPC UA Server Simulator

First off, thank you for taking the time to contribute to this project! Your help is highly appreciated and helps make this simulator more reliable, powerful, and user-friendly for everyone.

## How You Can Contribute

There are several ways you can get involved:

* 🐛 **Report bugs**
* 💡 **Suggest features or enhancements**
* 📘 **Improve documentation**
* 💻 **Contribute code**
* ✅ **Write or improve tests**

---

## Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repo and clone your fork locally:

```bash
git clone https://github.com/Mekanet-Energy/opcua-server.git
cd opc-ua-server-simulator
```

### 2. Install Dependencies

Use npm to install required packages:

```bash
npm install
```

### 3. Run the Project

You can run the project in development mode:

```bash
npm run start:dev
```

Or start it normally:

```bash
npm run start
```

For production build:

```bash
npm run start:prod
```

---

## Code Guidelines

* Follow the existing code style and structure.
* Write clear, descriptive commit messages.
* Add comments where necessary to explain complex logic.
* Keep functions and modules modular and testable.
* Ensure all new features are covered with tests.

---

## Making a Pull Request

1. Create a new branch from `main`:

   ```bash
   git checkout -b feature/my-awesome-feature
   ```

2. Make your changes.

3. Commit your changes:

   ```bash
   git commit -m "feat: add my awesome feature"
   ```

4. Push to your fork:

   ```bash
   git push origin feature/my-awesome-feature
   ```

5. Open a pull request and describe your changes clearly.

---

## Testing Your Changes

To test locally, you can connect to the running server using tools like **UAExpert** or **opcua-commander**. The server endpoint will be printed in the console on startup.

Please ensure:

* New variables are handled gracefully.
* REST API interactions remain stable.
* Server runs without crashes or memory leaks.
* Simulated data remains realistic.

---

## Code of Conduct

Please be respectful to other contributors. Harassment, abuse, or discrimination of any kind will not be tolerated.

---

## Questions?

If you have questions or need help getting started, feel free to open a [Discussion](https://github.com/Mekanet-Energy/opcua-server/discussions) or create an issue.

Happy coding! 🚀

---

Hazır olduğunuzda bu metni `CONTRIBUTING.md` dosyası olarak projenize ekleyebilirsiniz. İsterseniz bir `CODE_OF_CONDUCT.md` dosyası da hazırlayabilirim. İlgilenir misiniz?
