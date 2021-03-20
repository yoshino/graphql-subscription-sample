# GraphQL subscriptions sample(Apollo 3.3 and Actioncable 6.1)

![subscription-sample](https://user-images.githubusercontent.com/17586662/111857599-f7698a00-8975-11eb-8d22-8b6bc4c0a57c.gif)

## Client

@apollo/client@^3.3.12

## Server

rails (6.1.3)

## Setup

### database

```
$ docker-compose run api rails db:setup
```

### application

```
$ docker-compose up
```

## Usage

### client

http://localhost:3000/

### graphiql

http://localhost:4000/graphiql
