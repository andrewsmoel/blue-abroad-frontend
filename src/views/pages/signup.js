import App from './../../App'
import Auth from './../../Auth'
import {html, render } from 'lit-html'
import {anchorRoute, gotoRoute} from './../../Router'
import Utils from './../../Utils'

class SignUpView{
   
  init(){      
    console.log('SignUpView.init')  
    document.title = 'Sign In'    
    this.render()
    Utils.pageIntroAnim()
  }

  renderWelcomeScreen() {
    console.log('Rendering welcome screen');
    const template = html`
      <div class="signinup-box" style="height: 660px;">
        <img class="signinup-logo" src="/images/logo.png">
        <h1 style="color: #222633; font-size: 23pt;" >WELCOME</h1>
        <p>Thanks for joining the Blue Abroad Community.</p>
        <button @click=${() => gotoRoute('/explore')}>Start Exploring</button>
      </div>
    `;
    const container = document.querySelector('.page-content');
    render(template, container);
  }

  signUpSubmitHandler(e){
    e.preventDefault()    
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')    
    const formData = e.detail.formData
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // check if password and confirm password match
    if(password !== confirmPassword) {
      // Display an alert message
      alert('Passwords do not match');
      // Reset state of submit button
      submitBtn.removeAttribute('loading');
      return;
    }
    
    // sign up using Auth
    Auth.signUp(formData, () => {
      console.log('Callback called');
      submitBtn.removeAttribute('loading')
      this.renderWelcomeScreen();
    })   
  }


  render(){
    const template = html`      
      <div class="page-content page-centered" style="top: 0;">      
        <div class="signinup-box" style="height: 660px;">
        <img class="signinup-logo" src="/images/logo.png">
          <h1 style="color: #222633; font-size: 16pt;" >BECOME A MEMBER</h1>
          <sl-form class="form-signup" @sl-submit=${this.signUpSubmitHandler}>
            <div class="input-group">
              <sl-input name="firstName" type="text" placeholder="First Name" style="width: 80%; margin: 0 auto;" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="lastName" type="text" placeholder="Last Name" style="width: 80%; margin: 0 auto;" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="email" type="email" placeholder="Email" style="width: 80%; margin: 0 auto;" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="password" type="password" placeholder="Password" style="width: 80%; margin: 0 auto;" required toggle-password></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="confirmPassword" type="password" placeholder="Confirm Password" style="width: 80%; margin: 0 auto;" required toggle-password></sl-input>
            </div>               
            <sl-button type="primary" class="submit-btn" submit style="width: 50%; padding-top: 2.5em; border-radius: 10px;">Sign Up</sl-button>
          </sl-form>
          <p style="margin-top: 2em;">Already a member? <a href="/signin" @click=${anchorRoute}>Sign In</a></p>
        </div>
      </div>
    `
    render(template, App.rootEl)
  }
}


export default new SignUpView()