/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),  
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.initAccordion();
      thisProduct.renderInMenu();

      console.log('new Product:', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;

      /* 8.3 generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* 8.3 create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* 8.3 find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* 8.3 add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    initAccordion() {
      const thisProduct = this;

      /* 8.4 find the clickable trigger (the element that should react to clicking) */
      const trigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      /* 8.4 START: click event listener to trigger */
      trigger.addEventListener('click', function (event) {

        /* 8.4 prevent default action for event */
        event.preventDefault();

        /* 8.4 toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');

        /* 8.4 find all active products */
        const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);

        /* 8.4 START LOOP: for each active product */
        for (let activeProduct of allActiveProducts) {

          /* 8.4 START: if the active product isn't the element of thisProduct */
          if (activeProduct != thisProduct.element) {

            /* 8.4 remove class active for the active product */
            activeProduct.classList.remove('active');
          }
          /* 8.4 END: if the active product isn't the element of thisProduct */
        }
        /* 8.4 END LOOP: for each active product */
      });
      /* 8.4 END: click event listener to trigger */
    }
  }

  const app = {
    initMenu: function () {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();

}
