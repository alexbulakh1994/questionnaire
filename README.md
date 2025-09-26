## Description - edited test

This app include next modules: auth, user,questionnaire

Auth module: sign-in, sign-up, logout and refresh token endpoint and logic connected with this

User module: User entity in this app allowed 3 roles: admin, user, guest. Default on user signUp is GUEST.
Admin has permission to change user role.

Questionnaire module: user has ability to create/update/find questionnaire and assign it to another user.

Roles description:
Guest allowed only see assigned questionnaires to their side
USER allowed create/update/assign see assigned questionnaires
ADMIN could additionally update any questionnaire and see all of questionnaire (user see only created by him).

## Running the app
App starts in docker containers using docker compose
.env file already created, but for real project need only .env.example as already added in docker folder

Go to docker folder and run command
```bash
docker compose up
```

## Testing app

App was tested using postman.

## Notes
For configuration app using ConfigModule with extends .env file handling(interpolation env variables)
Such logic I used on previous project and move to this app

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
