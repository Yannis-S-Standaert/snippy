
accordion
js-component
name:className,name:tagName
---
/**
 * Accordion Web Component
 * 
 * A custom web component to create an accessible accordion.
 * Reflects open/closed state using the `open` attribute.
 * Dynamically sets the --_accordion-height custom property for smooth transitions.
 */
class @:name:ClassName:@ extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create the template
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="accordion">
        <div class="accordion-header" tabindex="0" role="button" aria-expanded="false">
          <slot name="header">Default Header</slot>
          <span slot="accordion-indicator" class="indicator">&darr;</span>
        </div>
        <div class="accordion-content" role="region" aria-labelledby="accordion-header">
          <div><slot name="content">Default Content</slot></div>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.header = this.shadowRoot.querySelector('.accordion-header');
    this.content = this.shadowRoot.querySelector('.accordion-content');
    this.indicator = this.shadowRoot.querySelector('.indicator');
    this.contentSlot = this.shadowRoot.querySelector('slot[name="content"]');

    // Bind the click event
    this.header.addEventListener('click', () => this.toggle());
    this.header.addEventListener('keydown', (event) => this.handleKeydown(event));

    // Observe slot content changes
    this.contentSlot.addEventListener('slotchange', () => this.updateContentHeight());

    // Apply the stylesheet
    const styleSheet = this.createStyleSheet();
    this.shadowRoot.adoptedStyleSheets = [styleSheet];
  }
  
  /**
  * trigger when the element is connected to the DOM
  */
  connectedCallback() {
  	    this.updateContentHeight();
  }

  /**
   * Toggles the accordion between open and closed states.
   */
  toggle() {
    const isOpen = this.hasAttribute('open');
    if (isOpen) {
      this.removeAttribute('open');
    } else {
      this.setAttribute('open', '');
    }
  }

  /**
   * Handles keydown events for accessibility.
   * @param {KeyboardEvent} event 
   */
  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  static get observedAttributes() {
    return ['open'];
  }

  /**
   * Called when an observed attribute has been added, removed, updated, or replaced.
   * @param {string} name - The name of the attribute.
   * @param {string|null} oldValue - The previous value of the attribute.
   * @param {string|null} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      const isOpen = this.hasAttribute('open');
      this.content.classList.toggle('open', isOpen);
      this.header.setAttribute('aria-expanded', isOpen);
      if (isOpen)
      	this.indicator.classList.add('open');
      else
      	this.indicator.classList.remove('open');
    }
  }

  /**
   * Updates the --_accordion-height custom property based on the content's height.
   */
  updateContentHeight() {
    const contentHeight = this.content.scrollHeight;
    this.style.setProperty('--_accordion-height', `${contentHeight}px`);
  }

  /**
   * Creates and returns a CSSStyleSheet object with the component's styles.
   * @returns {CSSStyleSheet} The stylesheet.
   */
  createStyleSheet() {
    const styleContent = `
      .accordion {
        border: 1px solid var(--_accordion-border-color, #ccc);
        border-radius: var(--_accordion-border-radius, 5px);
        overflow: hidden;
      }
      .accordion-header {
        background: var(--_accordion-header-bg, #f7f7f7);
        padding: var(--_accordion-header-spacing, 1em);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
      }
      .accordion-header:focus {
        outline: var(--accordion-header-focus-outline, 2px solid transparent);
      }
      
      .indicator {
      	rotate: 0deg;
        transition: 200ms rotate ease-in-out;
      }
      
      .indicator.open {
      	rotate: 180deg;
      }
      
      .accordion-content {
        overflow: hidden;
        height: 0;
        transition: height 0.3s ease-out;
      }
      
       .accordion-content > div {
        padding: var(--_accordion-header-spacing, 1em);
      }
      
      .accordion-content.open {
        height: var(--_accordion-height);
      }
    `;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styleContent);
    return sheet;
  }
}

// Define the custom element
customElements.define('@:name:tagName:@', @:name:ClassName:@);
