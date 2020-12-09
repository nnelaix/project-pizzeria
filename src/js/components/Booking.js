import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(bookingWrapper) {
    const thisBooking = this;
  
    thisBooking.render(bookingWrapper);
    thisBooking.initWidgets();

  }
  render(bookingWrapper) {
    const thisBooking = this;

    /* generate HTML based on template */ 
    const generatedHTML = templates.bookingWidget();

    /* empty object */
    thisBooking.dom = {};

    thisBooking.dom.wrapper = bookingWrapper;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

  }
}

export default Booking;