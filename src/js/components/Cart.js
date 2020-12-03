import {select, classNames, settings, templates} from '.././settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';
  
class Cart { 
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
      
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee; 
    thisCart.getElements(element);
    thisCart.initActions();
  

    // console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {}; 

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);

    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      //  console.log('clicked');
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function() {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct) {
    const thisCart = this;
      
    // console.log('adding product', menuProduct);
    // 9.3
    const generatedHTML = templates.cartProduct(menuProduct);
      
    thisCart.element = utils.createDOMFromHTML(generatedHTML);

    // 9.3 
    thisCart.dom.productList.appendChild(thisCart.element);
      
    thisCart.products.push(new CartProduct(menuProduct, thisCart.element));
    //console.log('thisCart.products:', thisCart.products);
    thisCart.update();
  }
  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
      
    for(let product of thisCart.products){
      thisCart.subtotalPrice += product.price; 
      thisCart.totalNumber += product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    //console.log('total: ', totalNumber);
    console.log('subtotal price: ', thisCart.subtotalPrice);
    console.log('total price:' , thisCart.totalPrice);
    console.log('total number: ', thisCart.totalNumber);

    for(let key of thisCart.renderTotalsKeys) {
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct) {
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }
  sendOrder() {
    const thisCart = this; 

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.address.value,
      number: thisCart.dom.phone.value,
      totalPrice: thisCart.dom.totalPrice.value,
      totalNumber: thisCart.dom.totalNumber.value,
      subtotalPrice: thisCart.dom.subtotalPrice.value,
      deliveryFee: thisCart.dom.deliveryFee.value,
      products: [],
    };
    for(let thisCartProduct of thisCart.products){
      payload.products.push(thisCartProduct.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      }).then(function(parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;