# NammaYatriPlus - Integrated Ride-Sharing Platform

## Overview

NammaYatriPlus is a comprehensive ride-sharing platform that is designed on top on NammaYatri's features to serve both drivers and riders with innovative features that enhance the user experience, safety, and efficiency. The platform consists of three main components:

1. **Driver Interface**
2. **Rider Interface**
3. **Supply-Demand Backend**

Final round presentation: https://www.canva.com/design/DAGh3p_QvHA/bE4TRF16wO0Ho1y3Olf5Tw/edit?utm_content=DAGh3p_QvHA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

Demo Video: https://drive.google.com/file/d/1KXctjzkmN-SIAoWk3X0f39KLWPpvhNsl/view?usp=sharing

## Components

### Driver Interface

The Driver Interface is designed to optimize driver experience and earnings through intelligent features:

- **Driver Preferred Location**: Allows drivers to set preferred operational areas for more targeted ride opportunities
- **Demand Clustering**: Uses advanced clustering algorithms to identify and highlight high-demand areas in real-time
- **Smart Event Analysis**: Leverages Event API and OpenAI integration to predict demand surges around events and gatherings
- **Gamification Features**:
  - Interactive leaderboards to foster healthy competition among drivers
  - Comprehensive earnings overview with analytics and trends
  - Achievement-based incentives to encourage platform engagement

### Rider Interface

The Rider Interface focuses on convenience, safety, and an integrated travel experience:

- **NammaCoins**: Loyalty program that rewards riders with coins redeemable across partner applications and services
- **NammaPink**: Dedicated service for women passengers with verified women drivers, especially for night travel, enhancing safety and peace of mind
- **Metro Yatri Integration**: Seamless connection with metro services for integrated multi-modal transportation
- **Language Localization**: Real-time translation services powered by Sarvam API to break language barriers
- **Pre-booking System**: Allows riders to schedule rides in advance for better planning

### Supply-Demand Backend

The Supply-Demand Backend is the intelligent core of the platform that balances driver availability with rider demand by predicting future rider distribution and making the current idle driver distribution close enough to the future rider distribution using a KL diveregence threshold. 

![Pipeline](supply_demand_pipeline.jpg)

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (v6.0 or higher)
- Redis (v7.0 or higher)
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/namma-ride.git
cd namma-ride
```

2. Install dependencies for all components:
```bash
# Install backend dependencies
cd backend
npm install

# Install driver interface dependencies
cd ../driver-interface
npm install

# Install rider interface dependencies
cd ../rider-interface
npm install
```

3. Set up environment variables:
```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp driver-interface/.env.example driver-interface/.env
cp rider-interface/.env.example rider-interface/.env
```

4. Configure the following environment variables in each .env file:
- `MONGODB_URI`: Your MongoDB connection string
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: Secret key for JWT authentication
- `OPENAI_API_KEY`: Your OpenAI API key
- `SARVAM_API_KEY`: Your Sarvam API key for translation services
- `EVENT_API_KEY`: API key for event integration

5. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start driver interface
cd ../driver-interface
npm run dev

# Start rider interface
cd ../rider-interface
npm run dev
```

## Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest

### Frontend (Driver & Rider Interfaces)
- **Framework**: Next.js 14 with React
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Maps Integration**: Mapbox GL JS
- **Real-time Updates**: Socket.IO
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form with Zod validation

### DevOps & Infrastructure
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Cloud Platform**: AWS
- **Monitoring**: Grafana & Prometheus
- **Logging**: ELK Stack

### AI & ML Components
- **Event Analysis**: OpenAI GPT-4
- **Demand Prediction**: TensorFlow
- **Translation**: Sarvam API
- **Clustering**: scikit-learn



## Contact

### Sriprakash T
**Department of Metallurgical and Materials Engineering**  
Indian Institute of Technology, Madras  
Chennai, Tamil Nadu 600036  
Email: [mm23b066@smail.iitm.ac.in](mailto:mm23b066@smail.iitm.ac.in)

### Harshith M R
**Department of Mechanical Engineering**  
Indian Institute of Technology, Madras  
Chennai, Tamil Nadu 600036  
Email: [me23b049@smail.iitm.ac.in](mailto:me23b049@smail.iitm.ac.in)

### Praveen Kumar S
**Department of Engineering Design**  
Indian Institute of Technology, Madras  
Chennai, Tamil Nadu 600036  
Email: [ed23b038@smail.iitm.ac.in](mailto:ed23b038@smail.iitm.ac.in)
