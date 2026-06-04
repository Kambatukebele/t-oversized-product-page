class StickyAddToCart extends HTMLElement {
  connectedCallback() {
    this.stickyAtcBarContainer = this.querySelector(".sticky-atc-bar");

    this._render();
  }

  _render() {
    this.title = document.querySelector(".product__title").innerText;

    this.featuredImage =
      document.querySelectorAll(".product__media")[0].firstElementChild.srcset;

    this.price = document.querySelector(
      ".price__regular .price-item--regular",
    ).innerHTML;

    /**
     * Default value for the title, price, size when the page load
     *
     */

    this.stickyAtcBarContainer.querySelector(
      ".sticky-atc-bar__title",
    ).innerHTML = this.title;

    this.stickyAtcBarContainer.querySelector(
      ".sticky-atc-bar__price",
    ).innerHTML = this.price;

    this.stickyAtcBarContainer.querySelector(
      ".sticky-atc-bar__thumbnail-image",
    ).srcset = this.featuredImage;

    //default size value
    this.variantSelect = document.querySelector("variant-selects");
    this.fieldSet = this.variantSelect.querySelectorAll(".product-form__input");
    this.inputs = this.fieldSet[0].querySelectorAll(
      ".product-form__input input[type='radio']",
    );

    this.inputs.forEach((item) => {
      if (item.getAttribute("checked") !== null) {
        this.stickyAtcBarContainer.querySelector(
          ".sticky-atc-bar__variant",
        ).innerHTML = item.getAttribute("value");
      }
    });

    // Observing price price
    const priceRegular = document.querySelector(".price__regular");
    const config = {
      childList: true,
      subtree: true,
      attributes: true,
    };

    let observer = new MutationObserver(callbackFunc.bind(this));
    observer.observe(priceRegular, config);

    function callbackFunc(mutations, config) {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          let currentPrice = mutation.target.innerText;
          this.stickyAtcBarContainer.querySelector(
            ".sticky-atc-bar__price",
          ).innerHTML = `$${(currentPrice / 100).toFixed(2)}`;
        }
      }
    }

    const getDataChange = subscribe(PUB_SUB_EVENTS.variantChange, (payload) => {
      const { sectionId, html, variant } = payload.data;
      priceRegular.textContent = variant.price;
      this.stickyAtcBarContainer.querySelector(
        ".sticky-atc-bar__variant",
      ).innerHTML = variant.option1;
    });

    window.addEventListener("scroll", () => {
      this.nativeAtcBtn = document.querySelector(".product-form__buttons"); // main btn on the product

      this.position = this.nativeAtcBtn.getBoundingClientRect();

      if (this.position.bottom < 0) {
        this.stickyAtcBarContainer.classList.add("is-visible");
      } else {
        this.stickyAtcBarContainer.classList.remove("is-visible");
      }
    });
  }
}

customElements.define("sticky-add-to-cart", StickyAddToCart);
