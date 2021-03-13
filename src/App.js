import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import { useState } from 'react';

firebase.initializeApp(firebaseConfig)

function App() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user
        const signInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signInUser)
        console.log(displayName, email, photoURL)
      })
      .catch(err => {
        console.log(err)
        console.log(err.message)
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signOutUser)
      })
      .catch(err => {
        console.log(err)
      })
    console.log("sign out")
  }

  const handleBlur = (e) =>{
    // console.log(e.target.name, e.target.value)
    let isFieldValid = true;
    if(e.target.name === "email"){
      // const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value)
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
      // console.log(isEmailValid)
    }
    if(e.target.name === "password"){
      const isPasswordValid = e.target.value.length > 6
      const passwordHasNumber = /\d{1,}/.test(e.target.value)
      isFieldValid = (isPasswordValid && passwordHasNumber)
      // console.log(isPasswordValid && passwordHasNumber)
    }
    if(isFieldValid){
      //[...cart, newCart]
      const newUserInfo = {...user} //isSignIn er value gula carli bracket er modde ace tai
      newUserInfo[e.target.name] = e.target.value   //add hoye update hocce
      setUser(newUserInfo)
    }
  }
  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        // Signed in 
        const newUserInfo = {...user} 
        newUserInfo.error = ''
        newUserInfo.success = true
        setUser(newUserInfo)
        updateUserName(user.name)
        // ...
      })
      .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message
        newUserInfo.success = false
        setUser(newUserInfo)
        
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then( res => {
          const newUserInfo = {...user} 
          newUserInfo.error = ''
          newUserInfo.success = true
          setUser(newUserInfo)
          console.log('sign in user info', res.user)
        })
        .catch(error => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
        });
    }
    
    e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name
      }).then(function() {
        console.log('update successfully')
      }).catch(function(error) {
        console.log(error)
      });
  }

  return (
    <div className="App">
      {
        user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign in</button>
      }
      <br/>
      <button>LogIn using Facebook</button>
      {
        user.isSignIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="photo" />
        </div>
      }
      <h1>Our Own Authentication</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
      { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name" />}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email Address" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required />
        <br />
        <input type="submit" value="Submit"/>
      </form>
      <p style={{color: "red"}}>{user.error}</p>
      {
        user.success && <p style={{color: "green"}}>User { newUser ? 'created' : 'Logged In' } Successfully</p>
      }
    </div>
  );
}

export default App;
