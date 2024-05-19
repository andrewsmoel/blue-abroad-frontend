import App from './../../App'
import Auth from './../../Auth'
import {html, render } from 'lit-html'
import {anchorRoute, gotoRoute} from './../../Router'
import Utils from './../../Utils'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class welcomeView{
   
  init(){ 
    console.log('welcomeView.init')
    document.title = 'Welcome'    
    this.render()
    Utils.pageIntroAnim()
  }


  


  render(){
    const template = html`    
    <style>
      .welcome-content {
        position: relative;
        overflow-x: hidden;
        display: flex;
        justify-content: center;
      }

      .scroll-container {
          position: relative;
          display: flex;
          height: 100vh;
          justify-content: center;
          align-items: center;
      }

      .welcome-box {
          background-color: #EDEBEB;
          display: flex;
          flex-direction: column;
          
          width: 80vw;
          height: 520px;
          text-align: center;
          border-radius: 15px;
          align-items: center;
          justify-content: center;
          margin-left: 20px;
          margin-right: 20px;
      }

      .signinup-logo {
        position: absolute;
        z-index: 1;
        animation: slideInFromLeft 2s ease-out;
        margin-top: 18%;
      }

      .next-btn {
        width: 10%;
      }

      @keyframes slideInFromLeft {
        0% {
          transform: translateX(-500%);
        }
        100% {
          transform: translateX(0);
        }
      }

      h1 {
        position: absolute;
        animation: slideInFromRight 2s ease-out;
      }

      @keyframes slideInFromRight {
        0% {
          transform: translateX(500%);
        }
        100% {
          transform: translateX(0);
        }
      }

      p {
        position: absolute;
        animation: slideInFromRight 2s ease-out;
        margin-top: 10%;
      }

      @media screen and (max-width: 390px) {
        .signinup-logo {
          margin-top: 50%;
        }

        .welcome-box {
          justify-content: space-between;
        }

        h1 {
          margin-top: 60%;
        }

        p {
          margin-top: 80%;
        }

        .next-btn {
          width: 40%;
        }

      }


    </style>
    
    
<div class="welcome-content">     
  <img class="signinup-logo" src="/images/logo.png"> 
        <div class="scroll-container">
            
            <div class="welcome-box">
              
              <h1 style="color: #222633; font-size: 23pt;">WELCOME ${Auth.currentUser.firstName}</h1>
              <p style="color: #222633; font-size: 18pt;">Thanks for joining the Blue Abroad Community.</p>
              <sl-button type="primary" class="next-btn" submit style="margin-top: 25em; border-radius: 10px;" @click=${() => gotoRoute('/')}>Continue</sl-button>
            </div>
        </div>
</div>
    `
   render(template, App.rootEl)
  }
}

export default new welcomeView()