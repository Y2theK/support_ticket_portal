# Support Ticket Portal

#### A support ticket portal where companies can submit and manage support tickets, and a support team can handle these tickets built with Laravel, React, and Inertia.js.

**Laravel 13 + React 19 + Inertia.js 3 + shadcn/ui + Tailwind CSS** 

---

### Requirements

- php ^8.4
- node ^2.2
- composer

### Installation

```shell
git clone https://github.com/Y2theK/support_ticket_portal.git
```

```shell
cd support_ticket_portal
```

```shell
cp .env.example .env
```
```
Set up database in .env
```
```shell
composer install
```

```shell
php artisan key:generate
```

```shell
php artisan migrate:fresh --seed
```

```shell
npm install
```

```shell
npm run build
```

```shell
composer run dev
```

### Demo Credentials

| Name | Email | Password |
|---|---|---|
| Agent User | agent@example.com | password |
| Client User | client@example.com | password |
