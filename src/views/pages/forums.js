import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'


class ForumView {
    init(){
      console.log('ForumView.init')
      document.title = 'Forums'    
      this.render()    
      Utils.pageIntroAnim()
      this.postGetHandler()
    }

    postGetHandler(){
        fetch('https://asmoel-blueabroad-backend.onrender.com/post')
            .then(response => response.json())
            .then(posts => {
                const innerContainer = document.querySelector('.inner-cont');
    
                // Check if forumsContainer exists
                if (innerContainer) {
                    posts.forEach((post, index) => {
                        const postDiv = document.createElement('div');
                        postDiv.style.display = 'flex';
                        postDiv.style.justifyContent = 'space-between';
                        postDiv.style.alignItems = 'center';
                        postDiv.style.cursor = 'pointer';

                        // Adjust the font size based on screen width
                        if (window.innerWidth <= 390) {
                            postDiv.style.fontSize = '12px'; // adjust size as needed
                        } else {
                            postDiv.style.fontSize = '16px'; // reset to default
                        }
                        
                        // Add a click event listener to the postDiv
                        postDiv.addEventListener('click', () => {
                            
                            // Store the post data in the local storage
                            localStorage.setItem('postId', post._id);

                            // Redirect to the forumPost page
                            window.location.href = `/forumPost`;
                        });

    
                        // create the svg speech bubble element from heroicons //
                        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svg.setAttribute('fill', 'none');
                        svg.setAttribute('viewBox', '0 0 24 24');
                        svg.setAttribute('strokeWidth', '1.5');
                        svg.setAttribute('stroke', 'currentColor');
                        

                        // Adjust the size based on screen width
                        if (window.innerWidth <= 390) {
                            svg.setAttribute('width', '150'); // adjust size as needed
                            svg.setAttribute('height', '20'); // adjust size as needed
                        } else {
                            svg.setAttribute('width', '28'); // adjust size as needed
                            svg.setAttribute('height', '28'); // adjust size as needed
                        }

                        svg.style.marginRight = '10px';
    
                        // create the path element from heroicons. More info at https://github.com/tailwindlabs/heroicons //
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('strokeLinecap', 'round');
                        path.setAttribute('strokeLinejoin', 'round');
                        path.setAttribute('d', 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z');
    
                        // Append the path element to the svg element //
                        svg.appendChild(path);
                        postDiv.appendChild(svg);
    
                        // Create a new div for the text content
                        const textDiv = document.createElement('div');
                        textDiv.textContent = post.title;
                        textDiv.style.display = 'flex';
                        textDiv.style.justifyContent = 'left';
                        textDiv.style.alignItems = 'center';
                        textDiv.style.width = '500px';
                        postDiv.appendChild(textDiv);

    
                        const dateDiv = document.createElement('div');
                        
                        // Create the labelSpan element
                        const labelSpan = document.createElement('span');
                        labelSpan.innerHTML = "Date Created:<br>";

                        // Adjust the visibility based on screen width
                        if (window.innerWidth <= 390) {
                            labelSpan.style.display = 'none'; // hide the labelSpan
                        } else {
                            labelSpan.style.display = 'block'; // show the labelSpan
                        }

                        dateDiv.appendChild(labelSpan);
    
                        const dateSpan = document.createElement('span');
                        dateSpan.textContent = new Date(post.createdAt).toLocaleDateString();
                        dateDiv.appendChild(dateSpan);
    
                        postDiv.appendChild(dateDiv);
    
                        // Create a new div for the SVG chevron
                        const chevronDiv = document.createElement('div');
                        chevronDiv.style.marginRight = '25px';
    
                        // Create the SVG chevron element
                        const svgChevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgChevron.setAttribute('fill', 'none');
                        svgChevron.setAttribute('viewBox', '0 0 24 24');
                        svgChevron.setAttribute('strokeWidth', '1.5');
                        svgChevron.setAttribute('stroke', 'currentColor');
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
    
                        // Append the postDiv to the innerContainer
                        innerContainer.appendChild(postDiv);

                    // Add a line after each post, except the last one
                    if (index < posts.length - 1) {
                        const lineDiv = document.createElement('div');
                        lineDiv.style.height = '1px';
                        lineDiv.style.backgroundColor = '#F0F0F0';
                        lineDiv.style.width = '100%';
                        innerContainer.appendChild(lineDiv);
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
            min-height: 80vh;
        }
            
        .new-post {
            margin-top: .5em;
            margin-left: auto;
            margin-right: 20px;
        }

        .inner-cont {
            background-color: #222633;
            margin-top: 1em;
            display: flex;
            flex-direction: column;
            gap: 30px;
            height: 90%;
            border-radius: 15px;
            margin-left: 20px;
            margin-right: 20px;
            margin-bottom: 20px;
            flex-grow: 1;
        }

        .inner-cont div {
            color: #F0F0F0;
            padding-left: 20px;
        }

        .inner-cont div:first-child {
            margin-top: 25px;
        }

        .header-cont {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
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
        }


        
        </style>

        <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
        <div class="page-content">        
            <h1>DISCUSSIONS</h1>
            <div class="forums-container">
                <div class="header-cont">
                    <h2>JOIN IN ON THE CONVERSATION</h2>
                    <sl-tooltip content="New Post">
                        <sl-icon-button class="new-post" name="plus-circle" label="New Post" style="font-size: 1.8rem;" @click=${()=> gotoRoute('/newPost')}></sl-icon-button>
                    </sl-tooltip>
                </div>
                <div class="inner-cont">
                    
                </div>
            </div>
            
        </div>      
        `
        render(template, App.rootEl)
    }
}

export default new ForumView()
