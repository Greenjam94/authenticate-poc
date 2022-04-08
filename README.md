# Proof of concept

Create a simple app to test specific features

- [X] Build app with users and authentication API to process a login without 2FA
- [ ] Add 2FA

# Build

1. Copy .env.template to .env and example/env.template to example/.env
2. Replace <REPLACE_ME> values in both new files
3. Don't commit .env or other secrets to git
4. `docker-compose up --build`

## Resources

- copy paste [codeshack login example](https://codeshack.io/basic-login-system-nodejs-express-mysql/)
- [bcrypt](https://medium.com/@manishsundriyal/a-quick-way-for-hashing-passwords-using-bcrypt-with-nodejs-8464f9785b67) usage
- [bezkoder](https://www.bezkoder.com/docker-compose-nodejs-mysql/) dockerize a nodejs app