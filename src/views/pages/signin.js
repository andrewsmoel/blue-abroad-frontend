import App from './../../App'
import {html, render } from 'lit-html'
import {anchorRoute, gotoRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'

class SignInView {
  init(){
    console.log('SignInView.init')
    document.title = 'Sign In'
    this.render()
    Utils.pageIntroAnim()
  }

  signInSubmitHandler(e){
    e.preventDefault()
    
    // Get the form data from the event detail
    const formData = e.detail.formData;
  
    // Use FormData.get to get the email and password values
    const email = formData.get('email');
    const password = formData.get('password');
  
    // Create a user data object
    const userData = {
      email: email,
      password: password
    };
  
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')    
      
    // sign in using Auth    
    Auth.signIn(userData).then(response => {
      submitBtn.removeAttribute('loading')
      if (response && response.redirect) {
        // If the server responded with a redirect, navigate to that page
        gotoRoute(response.redirect);
      }
    }).catch(error => {
      console.error('Error signing in:', error);
      submitBtn.removeAttribute('loading')
    });
  }

  render(){    
    const template = html`      
      <div class="page-content page-centered" style="top: 0;">
        <div class="signinup-box">
          <img class="signinup-logo" src="/images/logo.png">          
          <sl-form class="form-signup dark-theme" @sl-submit=${this.signInSubmitHandler}>          
            <div class="input-group">
              <sl-input name="email" type="email" placeholder="Email" style="width: 80%; margin: 0 auto;" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="password" type="password" placeholder="Password" style="width: 80%; margin: 0 auto;" required toggle-password></sl-input>
            </div>
            <sl-button class="submit-btn" type="primary" submit style="width: 50%; padding-top: 2.5em; border-radius: 10px;">Sign In</sl-button>
          </sl-form>
          <p style="margin-top: 2em;">Not a member? <a href="/signup" @click=${anchorRoute}>Create an account</a></p>
        </div>
      </div>
    `
    render(template, App.rootEl)    
  }
}

export default new SignInView()