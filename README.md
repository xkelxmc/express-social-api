# Express Social Api

Social Api is an example of a working version of api for a social network on Node Express

##### Used:
- Express
- MongoDB
- Mongoose
- Babel 7
- Mocha

## Installation

```bash
npm install
npm -g eslint
```

#### Create ```.env``` file
```.env
MONGO_TEST_URI=mongodb+srv://<user>:<password>@<host>/<collection>
MONGO_URI=mongodb+srv://<user>:<password>@<host>/<collection>
SESSION_SECRET=secret
NODE_ENV=test
```


## Usage

```bash
npm run start
```
## Testing

```bash
npm run test
npm run test:watch
```

## Eslint

```bash
npm run lint
npm run lint:fix
```

## Routes:
#### Auth:
- POST: ```/auth/login``` login with ```{email: 'string', password: 'string'}```
- GET: ```/auth/logout``` logout
- POST: ```/auth/signup``` SignUp with ```{email: 'string', password: 'string'}```
#### Users:
- GET: ```/user``` get current user
- GET: ```/user/:userId``` get user by Id
- GET: ```/users/``` find all users
#### Posts:
- POST: ```/posts/``` create new post form user ```{title: 'string', body: 'string'}```
- GET: ```/posts/:postId``` get posts by Id
- GET: ```/posts/``` find all posts

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
