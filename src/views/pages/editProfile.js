import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import UserAPI from './../../UserAPI'
import Toast from '../../Toast'
import moment from 'moment'

class EditProfileView {
  init(){
    console.log('EditProfileView.init')
    document.title = 'Edit Profile'    
    this.user = null
    this.render()    
    Utils.pageIntroAnim()
    this.getUser()    
  }

  async getUser(){
    try {
      this.user = await UserAPI.getUser(Auth.currentUser._id)   
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  async updateProfileSubmitHandler(e){
    e.preventDefault()
    const formData = e.detail.formData
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')
    try {
      const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, formData)      
      delete updatedUser.password        
      this.user = updatedUser     
      Auth.currentUser = updatedUser
      this.render()
      Toast.show('profile updated')
    }catch(err){      
      Toast.show(err, 'error')
    }
    submitBtn.removeAttribute('loading')
  }

  render(){
    const template = html`

    <style>
    h1 {
      margin-left: 20%;
    }
    
    .user-container {
      background-color: #EDEBEB;
      margin-left: 20%;
      margin-right: 20%;
      border-radius: 15px;
      margin-bottom: 2em;
      display: flex;
      flex-direction: column;
      
    }

    .user-info {
      display: flex;
      justify-content: center;
    }
    
    .page-form {
      margin-top: 2.5em;
      max-width: 1000px
    }
    
    p {
      display: flex;
      justify-content: center;
      margin-top: 25pt;
    }

    .input-bio {
      width: 500px;
      margin-bottom: 1.5em;
    }

    .input-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 25px;
      margin-left: 30px;
    }

    .upload {
      margin-left: 25px;
      height: 1em;
    }

    .upload:hover {
      cursor: pointer;
    }

    .submit-btn {
      display:flex;
      justify-content: center;
      align-items: center;
      width: 130px;
      margin: 0 auto;
      padding: 0 auto;
    }

    .label-on-left {
      --label-width: 6rem;
      --gap-width: 1rem;
    }

    .label-on-left + .label-on-left {
      margin-top: var(--sl-spacing-medium);
    }
  
    .label-on-left::part(form-control) {
      display: grid;
      grid: auto / var(--label-width) 2fr;
      gap: var(--sl-spacing-3x-small) var(--gap-width);
      align-items: center;
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

        .user-info {
          display: flex;
          justify-content: flex-start;
          margin-left: 20px;
        }

        .user-container {
          display: flex;
          
          margin-left: 0;
          margin-right: 0;
          height: auto;
          
        }

        .label-on-left::part(form-control) {
          grid: auto / 1fr;
        }

        .input-group sl-input {
          width: 63%;
        }

        .input-bio sl-textarea {
          width: 63%;
        }

        .input-avatar {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 40%
        }

        .input-avatar sl-avatar {
          margin-bottom: 1em;
        }

        .input-avatar input {
          height: 2em;
          margin-left: 30%;
        }
  }
  

    </style>

      <va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      <div class="page-content">        
        ${(this.user == null) ? html`
          <sl-spinner></sl-spinner>
        `:html`
          <h1>EDIT PROFILE</h1>
          <div class="user-container">
            <div class="user-info">
              <sl-form class="page-form" @sl-submit=${this.updateProfileSubmitHandler.bind(this)}>
                <div class="input-group">
                  <sl-input type="text" class="label-on-left" label="First Name" name="firstName" value="${this.user.firstName}" placeholder="First Name"></sl-input>
                </div>
                <div class="input-group">
                  <sl-input type="text" class="label-on-left" label="Last Name" name="lastName" value="${this.user.lastName}" placeholder="Last Name"></sl-input>
                </div>
                <div class="input-group">
                  <sl-input type="text" class="label-on-left" label="Email" name="email" value="${this.user.email}" placeholder="Email Address"></sl-input>
                </div>
                <div class="input-bio">
                  <sl-textarea resize="auto" type="text" class="label-on-left" label="Bio" name="bio" value="${this.user.bio || ''}" placeholder="Tell us about yourself!"></sl-textarea>
                </div>                   
                <div class="input-avatar">    
                  ${(this.user.avatar) ? html`
                    <sl-avatar style="--size: 80px;" image="${App.apiBase}/images/${this.user.avatar}"></sl-avatar>
                    <input class="upload" type="file" name="avatar" />
                  `: html`
                    <input class="upload" type="file" name="avatar" />
                  `}
                </div>
                <sl-button type="primary" class="submit-btn" submit >Update Profile</sl-button>
              </sl-form>
            </div>  
            <p>Last Updated: ${moment(Auth.currentUser.updatedAt).format('MMMM Do YYYY, @ h:mm a')}</p>
          </div>
        `}
      </div>
    `
    render(template, App.rootEl)
  }
}

export default new EditProfileView()