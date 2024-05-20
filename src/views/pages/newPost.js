import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import Toast from '../../Toast'

class newPostView {
    init(){
      console.log('newPostView.init')
      document.title = 'New Post'    
      this.render()    
      Utils.pageIntroAnim()

      // Add an event listener for the form submission event
      const form = document.querySelector('.inner-cont sl-form');
      if (form) {
        form.addEventListener('submit', (e) => this.postSubmitHandler(e));
      }
    }

    postSubmitHandler(e){
        e.preventDefault();
    
        const submitBtn = document.querySelector('.post');
        submitBtn.setAttribute('loading', '');
    
        const formData = e.detail.formData;

        // Log the accessToken
        console.log("accessToken: ", localStorage.getItem('accessToken'));
        
        fetch("https://asmoel-blueabroad-backend.onrender.com/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessToken')
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Clear the form
            const form = document.querySelector('.inner-cont sl-form');
            if (form) {
                form.reset();
            }
            // Redirect to the forums page
            gotoRoute('/forums');
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.removeAttribute('loading');
        });
    }


    


    render(){
        const template = html`
        <style>
            
        h1 {
            margin-left: 20%;
        }

        h2 {
            color: #222633;
            margin-top: 1em;
            margin-left: 20px;
        }

        .forums-container {
            background-color: #EDEBEB;
            margin-left: 20%;
            margin-right: 20%;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            min-height: 70vh;
        }

        .inner-cont {
            background-color: #222633;
            margin-top: 1em;
            display: flex;
            flex-direction: column;
            height: 90%;
            border-radius: 15px;
            margin-left: 20px;
            margin-right: 20px;
            margin-bottom: 20px;
            flex-grow: 1;
        }

        .input-cont {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .inputs {
            width: 80%;
            margin-top: 2em;
        }

        .post-btns {
            display: flex;
            justify-content: flex-end;
            margin-right: 101px;
            margin-top: 1.5em;
            margin-bottom: 1.5em;
        }
        
        .cancel {
            min-width: 100px;
            margin-left: 10px;
        }

        .post {
            min-width: 100px;
            margin-left: 10px;
        }

        @media screen and (max-width: 390px) {
            body {
                overflow-x: hidden;
              } 

              h1 {
                margin-left: 2%;
              }
            
              .page-content {
                justify-content: center;
                align-items: center;
                width: 100%;
                overflow-x: hidden;
              }

              .forums-container {
                margin-left: 2%;
                margin-right: 2%;
                width: 350px;
              }

              .post-btns {
                margin-right: 0px;
                justify-content: center;
              }

              .cancel {
                margin-left: 0px;
              }
        }

        </style>

        <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
        <div class="page-content">        
            <h1>DISCUSSIONS</h1>
            <div class="forums-container">
                <div class="header-cont">
                    <h2>NEW THREAD POST</h2>
                </div>
                <sl-form class="inner-cont" @sl-submit=${this.postSubmitHandler}>
                    <div class="input-cont">
                        <sl-input name="title" type="text" class="inputs" placeholder="Title" required></sl-input>
                        <sl-textarea name="bodyContent" type="text" rows="18" resize="auto" class="inputs" placeholder="Body text" required></sl-textarea>
                    </div>
                    <div class="post-btns">
                        <sl-button class="cancel" @click=${()=> gotoRoute('/forums')}>Cancel</sl-button>
                        <sl-button class="post" submit>Post</sl-button>
                    </div>
                </sl-form>
            </div>
            
        </div>      
        `
        render(template, App.rootEl)
        }
    }
    
    export default new newPostView()