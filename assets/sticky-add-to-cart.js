class StickyAddToCart extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  disconnectedCallback() {
    this.unsubscribeVariant?.();
    window.removeEventListener("scroll", this._scrollHandler);
  }

  _render() {
    this.stickyAtcBarContainer = this.querySelector(".sticky-atc-bar");
    /**
     * Define variable that will target the product element itself
     */
    // product title
    this.productTitle = document.querySelector(".product__title").textContent;

    // product image
    this.productFeaturedImage =
      document.querySelectorAll(".product__media")[0].firstElementChild.srcset;
    //product price
    this.productPrice = document.querySelector(
      ".price__regular .price-item--regular",
    ).textContent;
    // product main add to cart
    this.mainProductAtc = document.querySelector(".product-form__submit");

    /**
     * Define Sticky-add-to-cart variable
     */

    this.stickyAtcBarContainer.querySelector(
      ".sticky-atc-bar__title",
    ).textContent = this.productTitle;

    this.stickyAtcBarContainer.querySelector(
      ".sticky-atc-bar__price",
    ).textContent = `${this.productPrice}`;

    this.stickyAtcBarContainer.querySelector(
      ".sticky-atc-bar__thumbnail-image",
    ).srcset = this.productFeaturedImage;

    //default size and color value
    this.variantSelect = document.querySelector("variant-selects");

    this.colorSizeSATC = this.stickyAtcBarContainer.querySelectorAll(
      ".sticky-atc-bar__variant-color-size",
    );

    const fieldsets = this.variantSelect.querySelectorAll("fieldset");
    fieldsets.forEach((fieldset, index) => {
      const checked = fieldset.querySelector('input[type="radio"]:checked');
      if (checked && this.colorSizeSATC[index]) {
        this.colorSizeSATC[index].textContent = checked.value;
      }
    });

    // Update price, size, color based on the pubsub
    this.unsubscribeVariant = subscribe(
      PUB_SUB_EVENTS.variantChange,
      (payload) => {
        const { variant } = payload.data;

        this.stickyAtcBarContainer.querySelector(
          ".sticky-atc-bar__price",
        ).textContent = `$${(variant.price / 100).toFixed(2)}`;

        variant.options.forEach((colorSize, index) => {
          this.colorSizeSATC[index].textContent = colorSize;
        });
      },
    );

    this.btnAtc = this.stickyAtcBarContainer.querySelector("#sticky-atc-btn");

    this.btnAtc.addEventListener("click", () => {
      // Simulate a click to the main product with the element.click()
      this.mainProductAtc.click();
    });

    let ticking = false;
    this.nativeAtcBtn = document.querySelector(".product-form__buttons"); // main btn on the product
    this._scrollHandler = () => {
      if (!ticking) {
        // handling scroll -> throttle with the requestAnimationFrame
        requestAnimationFrame(() => {
          const position = this.nativeAtcBtn.getBoundingClientRect();

          if (position.bottom < 0) {
            this.stickyAtcBarContainer.classList.add("is-visible");
          } else {
            this.stickyAtcBarContainer.classList.remove("is-visible");
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", this._scrollHandler);
  }
}

customElements.define("sticky-add-to-cart", StickyAddToCart);
