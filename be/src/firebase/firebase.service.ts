import { Injectable } from "@nestjs/common";
import * as firebase from "firebase-admin";
//import firebaseConfig from "./firebase-config";

@Injectable()
export class FirebaseService {
    private firebaseApp: firebase.app.App;

    constructor() {
        this.firebaseApp = firebase.initializeApp({
            credential: firebase.credential.cert({
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY,
                //databaseUrl: process.env.FIREBASE_DATABASE_URL,
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
    }

    getAuth = (): firebase.auth.Auth => {
        return this.firebaseApp.auth();
    }

    firestore = (): firebase.firestore.Firestore => {
        return this.firebaseApp.firestore();
    }
}
