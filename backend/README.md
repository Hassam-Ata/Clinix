

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Start Stripe webhook

```bash
stripe listen --forward-to localhost:3000/payment/webhook
```

