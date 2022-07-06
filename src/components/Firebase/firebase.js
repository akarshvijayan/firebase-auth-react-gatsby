import firebaseConfig from "./config"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth"
import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  getDocs,
  where,
  limit,
  addDoc
} from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { getStorage } from "firebase/storage"


const app = initializeApp(firebaseConfig)

class Firebase {
  constructor() {
    if (!firebaseInstance) {
      this.auth = getAuth(app)
      this.db = getFirestore(app)
      this.functions = getFunctions(app)
      this.storage = getStorage(app)
    }
  }

  getUserProfile({ userId, handler }) {
    onSnapshot(
      query(
        collection(this.db, "publicProfiles"),
        where("userId", "==", userId),
        limit(1)
      ),
      docs => handler(docs)
    )
  }

  logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  
  registerWithEmailAndPassword = async (name, email, password) => {
    try {
      debugger;
      const res = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = res.user;
      await addDoc(collection(this.db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  
  sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(this.auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  
  logout = () => {
    signOut(this.auth);
  };

  // async register({ email, password, username }) {
  //   debugger;
  //   // const data = await createUserWithEmailAndPassword(this.auth, email, password)
  //   //console.log(data);
  //   // const createProfileCallable = httpsCallable(
  //   //   this.functions,
  //   //   "createPublicProfile"
  //   // )
  //   // return createProfileCallable({
  //   //   username,
  //   // })

  //   try {
  //     const data = await createUserWithEmailAndPassword(this.auth, email, password)
  //     const user = data.user;

  //     await addDoc(collection(this.db, "createPublicProfile"), {
  //       email: email
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.message);
  //   }


    // await setDoc(doc(this.db, "createPublicProfile", "createPublicProfile"), {
    //   email: email,
    //   password: password
    // });
  // }

  async login({ email, password }) {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  signInWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();

      const res = await signInWithPopup(this.auth, googleProvider);
      debugger;
      const user = res.user;
      const q = query(collection(this.db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(this.db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  async logout() {
    await signOut(this.auth)
  }
}

let firebaseInstance

function getFirebaseInstance() {
  if (!firebaseInstance) {
    firebaseInstance = new Firebase()
    return firebaseInstance
  } else if (firebaseInstance) {
    return firebaseInstance
  } else {
    return null
  }
}

export default getFirebaseInstance
