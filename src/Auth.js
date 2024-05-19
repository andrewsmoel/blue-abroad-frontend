import App from './App'
import Router, { gotoRoute } from './Router'
import splash from './views/partials/splash'
import {html, render } from 'lit-html'
import Toast from './Toast'

class Auth {

  constructor() {
    // Initialize currentUser with the data from localStorage if it exists
    const currentUser = localStorage.getItem('currentUser');
    this.currentUser = currentUser ? JSON.parse(currentUser) : null;
  }
  
  async signUp(userData, fail = false){  
    const response = await fetch(`${App.apiBase}/user`, {
      method: 'POST',      
      body: userData
    })

    const data = await response.json()

    // if response not ok
    if(!response.ok){      
      // console log error
      if(data) console.log(data)
      // show error      
      Toast.show(`Problem getting user: ${response.status}`, 'error')   
      // run fail() function if set
      if(typeof fail == 'function') fail()
    } else {
      /// sign up success - show toast and redirect to sign in page
      Toast.show('Account created, please sign in')        
      // redirect to signin
      gotoRoute('/signin')
    }
  }


  async signIn(userData, fail = false){
    // Ensure userData is an object containing email and password
    if (typeof userData !== 'object' || !userData.email || !userData.password) {
      console.error('Invalid user data');
      return;
    }

      // Log userData to check its value
    console.log('userData:', userData);

    const response = await fetch(`${App.apiBase}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json() // Parse the response body to JSON

    // if response not ok
    if(!response.ok){
      // console log error
      if(data) console.log(data)
      // show error      
      Toast.show(`Problem signing in: ${data.message}`, 'error')   
      // run fail() function if set
      if(typeof fail == 'function') fail()
    } else {
      // sign in success
      Toast.show(`Welcome  ${data.user.firstName}`)
      // save access token (jwt) to local storage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      // set current user
      this.currentUser = data.user  
      // console.log(this.currentUser)
      console.log('Auth.currentUser set in signIn:', this.currentUser);           
      // redirect to home
      Router.init()
      if (data.redirect) {
        // If the server responded with a redirect, navigate to that page
        gotoRoute(data.redirect);
      } else {
        this.currentUser.newUser ? gotoRoute('/welcome') : gotoRoute('/');
      }
    }
  }



  async check(success){
    // show splash screen while loading ...   
    render(splash, App.rootEl)
    
    // check local token is there
    if(!localStorage.accessToken){
      // no local token!
      Toast.show("Please sign in")    
      // redirect to sign in page      
      gotoRoute('/signin')
      return
    }
    
    // token must exist - validate token via the backend
    const response = await fetch(`${App.apiBase}/auth/validate`, {
      method: 'GET',
      headers: {        
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    })
    
    // if response not ok
    if(!response.ok){             
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // delete local token
      localStorage.removeItem('accessToken')
      Toast.show("session expired, please sign in")
      // redirect to sign in      
      gotoRoute('/signin')
      return
    }
    
    // token is valid!
    const data = await response.json()
    // console.log(data)
    // set currentUser obj
    this.currentUser = data.user
    // run success
    success()
  }

  signOut(){
    Toast.show("You are signed out")
    // delete local token
    localStorage.removeItem('accessToken')       
    // redirect to sign in    
    gotoRoute('/signin')
    // unset currentUser
    this.currentUser = null
  }
}

export default new Auth()