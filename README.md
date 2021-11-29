# Url Shortner

## Environment variables
```
HASURA_DB = HASURA_DB
ADMIN_SECRET = ADMIN_SECRET
CLIENT_URL = CLIENT_URL
```

## How to use

### Send **POST** method to https://sm-url1.herokuapp.com/ with body as
```
{
    "url": YOUR-URL-HERE
}
```

It gives a response with a string of shortened url