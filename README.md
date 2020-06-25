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
- POST: ```/auth/login``` login with 
```json
{"email": "string", "password": "string"}
```
- GET: ```/auth/logout``` logout
- POST: ```/auth/signup``` 
SignUp with 
```json
{"email": "string", "password": "string", "name": "string", "lastName": "string"}
```
#### Users:
- GET: ```/users/me``` get current user
- GET: ```/users/:userId``` get user by Id
- GET: ```/users/``` find all users
#### Posts:
- POST: ```/posts/``` create new post form user 
```json
{"title": "string", "body": "string"}
```
- GET: ```/posts/:postId``` get posts by Id
- GET: ```/posts/user/:userId``` get posts by userId
- GET: ```/posts/``` find all posts
- POST: ```/posts/:postId/up``` upVote post by postId
- POST: ```/posts/:postId/down``` downVote post by postId

## API:
#### Auth:
- POST: ```/api/auth/login``` login with 
```json
{"email": "string", "password": "string"}
```
- GET: ```/api/auth/logout``` logout
- GET: ```/api/auth/logoutall``` logout on all devices
- POST: ```/api/auth/signup``` 
SignUp with 
```json
{"email": "string", "password": "string", "name": "string", "lastName": "string"}
```
With Bearer Authorization
#### Users:
- GET: ```/api/users/me``` get current user
- GET: ```/api/users/:userId``` get user by Id
- GET: ```/api/users/``` find all users
#### Posts:
- POST: ```/api/posts/``` create new post form user 
```json
{"title": "string", "body": "string"}
```
- GET: ```/api/posts/:postId``` get posts by Id
- GET: ```/api/posts/user/:userId``` get posts by userId
- GET: ```/api/posts/``` find all posts
- POST: ```/api/posts/:postId/up``` upVote post by postId
- POST: ```/api/posts/:postId/down``` downVote post by postId

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
