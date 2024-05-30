
menu
js-component
name:className,name:elementName
---
class @:name:ClassName:@ extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });

    // Create the template
    const template = document.createElement('template');
    template.innerHTML = `
    <div class="menu">
      <button class="menu-button" aria-expanded="false">
        <slot name="button-text">Menu</slot>
      </button>
      <div class="menu-content" role="menu">
        <slot name="menu-items">Menu Item 1</slot>
      </div>
    <div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.menuButton = this.shadowRoot.querySelector('.menu-button');
    this.menuContent = this.shadowRoot.querySelector('.menu-content');

    // Bind the click event
    this.menuButton.addEventListener('click', () => this.toggle());
    document.addEventListener('click', (e) => !this.contains(e.target) && this.close());
    
    //

    // Apply the stylesheet
    const styleSheet = this.createStyleSheet();
    this.shadowRoot.adoptedStyleSheets = [styleSheet];
  }
  
  /**
   * close
   */
  close() {
    this.menuContent.classList.remove('open');
    this.menuButton.setAttribute('aria-expanded', 'false');
  }

  /**
   * Toggles the menu between open and closed states.
   */
  toggle() {
    const isOpen = this.menuContent.classList.toggle('open');
    this.menuButton.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      this.positionMenu();
    }
  }

/**
 * Positions the menu based on the button's position relative to the screen thirds, considering the containing element's relative position.
 */
positionMenu() {
  const containerRect = this.getBoundingClientRect();
  const buttonRect = this.menuButton.getBoundingClientRect();
  const menuRect = this.menuContent.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (containerRect.left < viewportWidth / 3)
  	this.menuContent.style.left = '100%';
  else
  	this.menuContent.style.right = '0';
    
  if (containerRect.top < viewportHeight / 3)
  	this.menuContent.style.top = '100%';
  else if (containerRect.top > viewportHeight / 3 * 2)
  	this.menuContent.style.bottom = '100%';
  
}

  /**
   * Creates and returns a CSSStyleSheet object with the component's styles.
   * @returns {CSSStyleSheet} The stylesheet.
   */
  createStyleSheet() {
    const styleContent = `
    
    	.menu {
      	position: relative;
      }
    
      .menu-button {
        padding: var(--menu-button-padding, 0.5em 1em);
        cursor: pointer;
        background: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
      }
      .menu-content {
        position: absolute;
        display: none;
        background: var(--menu-background, white);
        box-shadow: var(--menu-box-shadow, 0 2px 5px rgba(0, 0, 0, 0.15));
        border-radius: var(--menu-border-radius, 4px);
        padding: var(--menu-padding, 0.5em);
        z-index: var(--menu-z-index, 1000);
      }
      .menu-content.open {
        display: block;
      }
      
      ::slotted(ul) {
      	display: grid;
        gap: var(--menu-padding, 0.5em);
        padding: var(--menu-padding, 0.5em);
        list-style: none;
        margin: 0;
      }
    `;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styleContent);
    return sheet;
  }
}

// Define the custom element
customElements.define('@:name:elementName:@', @:name:ClassName:@);
