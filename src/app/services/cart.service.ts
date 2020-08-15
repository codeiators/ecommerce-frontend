import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems:CartItem[]=[];
  totalPrice:Subject<number>= new Subject<number>();
  totalQuantity:Subject<number>= new Subject<number>();

  constructor() { }

  addToCart(theCartItem:CartItem)
  {
    let alreadyExistInCart:boolean=false;
    let existingCartItem:CartItem=undefined;
    if(this.cartItems.length > 0)
    {

    }
    for(let tempCartItem of this.cartItems)
    {
      if(tempCartItem.id===theCartItem.id)
      {
        existingCartItem=tempCartItem;
        break;
      }
    }
    alreadyExistInCart = (existingCartItem!=undefined);
    if(alreadyExistInCart)
    {
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }
  }
}
