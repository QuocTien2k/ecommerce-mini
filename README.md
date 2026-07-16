# Mini E-Commerce

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&text=Mini%20E-Commerce&fontSize=45&fontAlignY=40&color=0:0ea5e9,100:2563eb&fontColor=ffffff"/>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nestjs,ts,vite,postgres,prisma,redux,tailwind,nodejs"/>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

</p>

## 📖 Overview

Mini E-Commerce is a full-stack web application that simulates a modern online shopping platform. The project is built with a separated Frontend and Backend architecture, focusing on scalability, maintainability, and clean code organization.

## ✨ Features

### Customer

- Authentication (JWT + Refresh Token)
- Browse products, categories and brands
- Product search & filtering
- Shopping cart
- Wishlist
- Voucher collection & redemption
- Product ratings
- Order management
- COD, VNPay and MoMo payment
- Profile management
- Real-time notifications

### Administrator

- Dashboard & analytics
- Product management
- Category management
- Brand management
- Voucher management
- User management
- Order management
- Website settings

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Socket.IO Client

### Backend

- NestJS
- PostgreSQL
- Prisma ORM
- Passport JWT
- Socket.IO
- Nodemailer

## 🏗 Backend Structure

```text
backend
├── prisma
├── src
│   ├── common
│   ├── config
│   ├── modules
│   │   ├── auth
│   │   ├── brand
│   │   ├── cart-items
│   │   ├── category
│   │   ├── dashboard
│   │   ├── notification
│   │   ├── order
│   │   ├── payment
│   │   ├── product
│   │   ├── product-variant
│   │   ├── public
│   │   ├── rating
│   │   ├── setting
│   │   ├── user
│   │   ├── voucher
│   │   └── wishlist
│   ├── app.module.ts
│   └── main.ts
└── package.json
```

## 🏗 Frontend Structure

```text
frontend
├── src
│   ├── app
│   ├── components
│   ├── domains
│   ├── features
│   │   ├── admin
│   │   ├── auth
│   │   ├── customer
│   │   └── notification
│   ├── hooks
│   ├── layouts
│   ├── lib
│   ├── pages
│   ├── providers
│   ├── routes
│   ├── services
│   ├── shared
│   ├── types
│   └── utils
└── package.json
```

## ⚙ Backend Modules

| Module          | Responsibilities                                    |
| --------------- | --------------------------------------------------- |
| Auth            | Authentication, JWT, Refresh Token, Forgot Password |
| Product         | Product CRUD & Product Details                      |
| Product Variant | Variant Management                                  |
| Category        | Category Management                                 |
| Brand           | Brand Management                                    |
| Cart            | Shopping Cart                                       |
| Wishlist        | Wishlist                                            |
| Voucher         | Voucher Management                                  |
| Order           | Order Lifecycle                                     |
| Payment         | COD, VNPay, MoMo                                    |
| Dashboard       | Revenue & Analytics                                 |
| Notification    | Real-time Notifications                             |
| Rating          | Product Reviews                                     |
| User            | Profile & User Management                           |
| Setting         | Website Settings                                    |
| Public          | Public APIs                                         |

## 💳 Payment

- Cash on Delivery (COD)
- VNPay
- MoMo

Payment flow includes payment creation, signature verification, IPN handling, return URL processing and payment status synchronization.

## 🔔 Real-time Notification

Socket.IO is used to deliver real-time notifications for order status updates and user events.

## 🚀 Getting Started

### Backend

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

### Frontend

```bash
npm install
npm run dev
```

## 🔑 Environment Variables

Backend

```env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
MAIL_HOST=
MAIL_PORT=
VNPAY_TMN_CODE=
MOMO_PARTNER_CODE=
```

Frontend

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

## 📌 Future Improvements

- Docker
- Redis Cache
- CI/CD
- Unit Testing
- Integration Testing
- Elasticsearch
- Multi-language Support

## 👨‍💻 Author

Developed as a portfolio project for learning modern full-stack web development with React and NestJS.
