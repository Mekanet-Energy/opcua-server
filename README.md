# Overview

This application provides a comprehensive platform for testing and simulating OPC UA (Open Platform Communications Unified Architecture) servers. It enables developers and testers to emulate OPC UA servers, facilitating the validation of client applications without the necessity for physical OPC UA hardware.

## Description

Our OPC UA Server Simulator offers a robust environment tailored for developers and testers to replicate OPC UA server behaviors. By generating realistic data points—including Temperature, Pressure, Humidity, Flow Rate, and Status—this tool supports extensive testing scenarios, ensuring that OPC UA clients can effectively interact with and interpret data from simulated servers.

### Key Features

- **Simulated OPC UA Server:** Easily emulate an OPC UA server with customizable data points to match specific testing requirements.
- **Realistic Data Generation:** Produce dynamic and random sensor values to mirror real-world operating conditions.
- **Seamless Integration:** Integrate effortlessly with existing OPC UA client applications to streamline testing processes.
- **Scalable Configuration:** Adjust server settings and data types to accommodate various testing scales and complexities.
- **Comprehensive Logging:** Access detailed logs to monitor server activities and data exchanges, facilitating effective troubleshooting.

This simulator is ideal for developers aiming to validate OPC UA client implementations, perform stress testing, or train personnel on OPC UA interactions without relying on specialized hardware setups.

## Project Setup

```bash
npm install
```

## Compile and Run the Project

```bash
# Development
npm run start

# Watch Mode
npm run start:dev

# Production Mode
npm run start:prod
```
