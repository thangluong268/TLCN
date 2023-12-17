import * as firebase from "firebase-admin";
export declare class FirebaseService {
    private firebaseApp;
    constructor();
    getAuth: () => firebase.auth.Auth;
}
