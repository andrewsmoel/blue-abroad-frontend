import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute } from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'

class HomeView {
  init(){    
    console.log('HomeView.init')
    console.log('Auth.currentUser in HomeView.init:', Auth.currentUser);
    document.title = 'Home'    
    this.render()    
    Utils.pageIntroAnim()  
    this.postGetHandler()  
  }

  postGetHandler(){
    fetch('https://asmoel-blueabroad-backend.onrender.com/post')
      .then(response => response.json())
      .then(posts => {
        console.log('posts:', posts); // Log the posts
        console.log('Auth.currentUser._id:', Auth.currentUser._id); // Log the current user's ID

        if (!posts.every(post => post.hasOwnProperty('author'))) {
          console.error('Some posts do not have an author property');
          return;
        }
        const forumsContainer = document.querySelector('.forums');

              if (forumsContainer) {
                // Filter the posts by the authorId of the current user
                const userPosts = posts.filter(post => {
                  console.log('post.author:', post.author); // Log the author of each post
                  return post.author === Auth.currentUser._id;
                });
                console.log('userPosts:', userPosts); // Log the user's posts


                userPosts.forEach((post, index) => {
                  const postDiv = document.createElement('div');
                  postDiv.style.display = 'flex';
                  postDiv.style.alignItems = 'center';
                  postDiv.style.backgroundColor = '#222633';
                  postDiv.style.borderRadius = '15px';
                  postDiv.style.width = '90%';
                  postDiv.style.marginBottom = '15px';
                  postDiv.style.cursor = 'pointer';

                  // Add a click event listener to the postDiv
                  postDiv.addEventListener('click', () => {
                            
                    // Store the post data in the local storage
                    localStorage.setItem('postId', post._id);

                    // Redirect to the forumPost page
                    gotoRoute(`/forumPost`);
                });
                  

                  

                  // Create the avatar div
                  const avatarDiv = document.createElement('div');
                  avatarDiv.className = 'avatar';
                  avatarDiv.style.marginLeft = '20px'

                  // Create the sl-avatar element
                  const slAvatar = document.createElement('sl-avatar');
                  slAvatar.style = '--size: 50px; padding-top: 1.5em; margin-bottom: 1em;';

                  // If the current user has an avatar, set the image property of the sl-avatar element
                  if (post.author) {
                    const token = localStorage.getItem('token'); // Replace 'token' with the key you use to store the token
                    fetch(`${App.apiBase}/user/${post.author}`, {
                      headers: {
                        'Authorization': "Bearer " + localStorage.getItem('accessToken')
                      }
                    })
                      .then(response => response.json())
                      .then(author => {
                        if (author && author.avatar) {
                          const avatarUrl = `${App.apiBase}/images/${author.avatar}`;
                          console.log(avatarUrl); // Log the avatar URL
                          slAvatar.setAttribute('image', avatarUrl);
                        }
                      })
                      .catch(err => console.error(err)); // Handle any errors
                  }

                  // Append the sl-avatar element to the avatar div
                  avatarDiv.appendChild(slAvatar);

                  // Append the avatar div to the postDiv
                  postDiv.appendChild(avatarDiv);

                  // Create a new div for the text content
                  const textDiv = document.createElement('div');
                  textDiv.textContent = post.title;
                  textDiv.style.display = 'flex';
                  textDiv.style.justifyContent = 'left';
                  textDiv.style.alignItems = 'center';
                  textDiv.style.width = '75%';
                  textDiv.style.color = 'var(--heading-color)';
                  textDiv.style.marginLeft = '20px';

                  postDiv.appendChild(textDiv);
                  

                  // Append the postDiv to the forumsContainer
                  forumsContainer.appendChild(postDiv);

                  // Create a new div for the SVG chevron
                  const chevronDiv = document.createElement('div');
                  chevronDiv.style.marginRight = '25px';

                  // Create the SVG chevron element
                  const svgChevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                  svgChevron.setAttribute('fill', 'none');
                  svgChevron.setAttribute('viewBox', '0 0 24 24');
                  svgChevron.setAttribute('strokeWidth', '1.5');
                  svgChevron.setAttribute('stroke', 'var(--heading-color)');
                  svgChevron.setAttribute('width', '24'); // adjust size as needed
                  svgChevron.setAttribute('height', '24'); // adjust size as needed
                  svgChevron.classList.add('w-6', 'h-6');

                  // Create the path element for the SVG chevron
                  const pathChevron = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  pathChevron.setAttribute('strokeLinecap', 'round');
                  pathChevron.setAttribute('strokeLinejoin', 'round');
                  pathChevron.setAttribute('d', 'm8.25 4.5 7.5 7.5-7.5 7.5');

                  // Append the path element to the SVG chevron element
                  svgChevron.appendChild(pathChevron);

                  // Append the SVG chevron to the chevronDiv
                  chevronDiv.appendChild(svgChevron);

                  // Append the chevronDiv to the postDiv
                  postDiv.appendChild(chevronDiv);

                // Add a line after each post, except the last one
                if (index < posts.length - 1) {
                  const lineDiv = document.createElement('div');
                  lineDiv.style.height = '1px';
                  lineDiv.style.backgroundColor = '#F0F0F0';
                  lineDiv.style.width = '100%';
                  forumsContainer.appendChild(lineDiv);
              }
              // If this is the last post, add a bottom margin
              if (index === posts.length - 1) {
                  postDiv.style.marginBottom = '30px'; // Adjust as needed
              }
          });
      } else {
          console.error('inner-cont not found');
      }
  })
  .catch(err => console.log('error', err));
}

  render(){
    const template = html`
    <style>
    
    .page-content {
      padding-left: 20%;
      padding-right: 20%;
    }
    
    .bento {
      display: flex;
      justify-content: space-between;
    }

    .news {
      background-color: #EDEBEB;
      width: 46%;
      height: 82.5vh;
      border-radius: 15px;
    }

    .latest-news {
      color: #383855;
      padding-left: 15px;
      padding-top: 15px;
      font-size: 1.5em;
      font-weight: 600;
    }

    .forums {
      background-color: #EDEBEB;
      height: 50vh;
      border-radius: 15px;
      margin-top: 30px;
      max-width: 540px;
      display: flex;
      align-items: center;
      flex-direction: column;
      overflow: auto;
      scrollbar-width: none;
    }

    .forums::-webkit-scrollbar {
      display: none; /* For Chrome, Safari and Opera */
    }

    .forums h3 {
      align-self: flex-start;
      padding-left: 25px;
    }

    .news {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
      scrollbar-width: none;
    }

    .news::-webkit-scrollbar {
      display: none; /* For Chrome, Safari and Opera */
    }

    .news h3 {
      align-self: flex-start;
      padding-left: 25px;
    }

    .story1, .story2, .story3 {
      width: 90%;
      background-color: #222633;
      margin-bottom: 15px;
      border-radius: 15px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    p, a {
      color: var(--body-bg);
      width: 85%;
    }

    a {
      text-decoration: underline;
      text-align: right;
      margin-bottom: 15px;
    }

    a span:hover {
      cursor: pointer;
    }

    img {
      margin-top: 15px;
      border-radius: 15px;
    }

    @media screen and (max-width: 390px) {
      body {
        overflow-x: hidden;
      }
      
      .anim-in, .bento {
          display: block;
          width: 350px;
      }
  
      iframe {
        width: 350px;
        height: 196.875px;
      }

      .page-content {
        padding-left: 5%;
        width: 390px;
        overflow-x: hidden;
      }

      .news {
        width: 350px;
        margin-bottom: 15px;
      }

      .forums {
        margin-top: 15px;
      }
    }
    
    </style>

      <va-app-header subtitle="BLUEABROAD" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      
      <div class="page-content">
        <h1 class="anim-in">Hi ${Auth.currentUser.firstName}</h1>
          <div class="bento">
            <div class="news">
              <h3 class="latest-news">LATEST NEWS</h3>
              <div class="story1">
                <img style="width: 90%;" src= /images/LEARN.png>
                <p>What did we learn? March 2024</p>
                <a><span>Read More</span></a>
              </div>
              <div class="story2">
                <img style="width: 90%; " src= /images/JC.png>
                <p>2024 Opening Round - What did we learn? </p>
                <a><span>Read More</span></a>
              </div>
              <div class="story3">
                <img style="width: 90%;" src= /images/APRIL.png>
                <p>What did we learn? April 2024</p>
                <a><span>Read More</span></a>
              </div>
            </div>
            <div class="column-right">
              <div class="media">
              <iframe style="border-radius: 15px;" width="540" height="303.75" src="https://www.youtube.com/embed?listType=playlist&list=UUBeepdpDMJD8ALSIiIxM6yg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
              <div class="forums">
                <h3 class="latest-news">FORUMS</h3>
              </div>
            </div>
          </div>
      </div>
     
    `
    render(template, App.rootEl);

    
  }
}

export default new HomeView()