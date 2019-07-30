# revocablePromise:
revocablePromise allows you to revoke a promise or an array of promises, and set a minimum time to response.

# installation:
```sh
npm install @mostakchif/revocable-promise
```

# simple use:

```js
const {RevocablePromise} = require("@mostakchif/revocable-promise");

// init
const q = new RevocablePromise(fetch("http://localhost:8080/users"));

// set a minimum timeout
q.minTimeout = 500;

// revoke the promise and then or catch methods not be calls if they are not already called
q.revoke();

q.then((users) => console.log(users));
q.catch((err) => console.log(err));

/* multi promises */

const qs = new RevocablePromise([
    fetch("http://localhost:8080/users"),
    fetch("http://localhost:8080/tweets"),
]);

qs.minTimeout = 500;

qs.revoke();

qs.then(([users, tweets]) => console.log(users, tweets));
qs.catch((err) => console.log(err));
```

# react example:
```js
class Bar extends React.Component {
    componentDidMount() {
        this.q = new RevocablePromise(fetch("http://localhost:8080/users"));
    }
    
    componentWillUnmount() {
        this.q.revoke();
    }
}
```