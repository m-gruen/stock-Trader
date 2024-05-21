import cryptojs from 'crypto-js';
import { Controller as UserController } from '../controllers/userController.js';

const userController = new UserController();
const hash = (password) => cryptojs.SHA512(password).toString();

export class User {
    _id;
    _name;
    _balance;

    static from(user) {
        const newUser = new User();
        newUser._id = user.id;
        newUser._name = user.name;
        newUser._balance = user.balance;
        return newUser;
    }

    static signIn(username, password) {
        const user = userController.getByName(username);

        if (!user) {
            return [null, [404, 'user not found']];
        } else if (user.password !== hash(password)) {
            return [null, [401, 'password is incorrect']];
        } else {
            return [User.from(user), [200, 'signin successful']];
        }
    }

    static signUp(username, password) {
        if (userController.getByName(username)) {
            return [400, 'user already exists'];
        }

        userController.create(username, hash(password));
        return [200, 'user created'];
    }

    static delete(name, password) {
        const user = userController.getByName(name);

        if (!user) {
            return [404, 'user not found'];
        } else if (user.password !== hash(password)) {
            return [401, 'password is incorrect'];
        } else {
            userController.delete(name);
            return [200, 'user deleted'];
        }
    }

    static exists(id, name) {
        const user = userController.getById(id);
        return user && user.name === name ? true : false;
    }

    getData() {
        return {
            id: this._id,
            name: this._name,
            balance: this._balance
        };
    }

    get name() {
        return this._name;
    }
}
