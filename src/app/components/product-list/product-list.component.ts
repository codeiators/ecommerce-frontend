import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[]; 
  currentCategoryId:number=1;
  previousCategoryId:number=1;
  searchMode:boolean=false;

  //new properties for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;
  previousKeyword:string=null;
  constructor(private productService: ProductService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
    {
    this.listProducts();
    });
  }
   
  listProducts()
  {
    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode)
    {
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const theKeyword:string = this.route.snapshot.paramMap.get('keyword');
    //check if we have a different keyword then previous
    //Note;Angular will reuse a component if it previously being used
    if(this.previousKeyword!=theKeyword)
    {
      this.thePageNumber=1;
    }
    console.log(`theKeyword=${theKeyword}`);

    this.previousKeyword=theKeyword;
    
    this.productService.searchProductsPaginate(this.thePageNumber - 1,this.thePageSize,theKeyword).subscribe(
     
      this.processResult()

    );
  }

  handleListProducts()
  {
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId)
    {
      this.currentCategoryId = + this.route.snapshot.paramMap.get('id');
    }
    else{
      this.currentCategoryId=1;
    }

    //check if we have a different category then previous
    //Note;Angular will reuse a component if it previously being used

    //if we have a different categoryId then previous then 
    //set thePageNumber back to 1

    if(this.previousCategoryId!=this.currentCategoryId)
    {
      this.thePageNumber=1;
    }
    this.previousCategoryId=this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}`)
  /*   this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {this.products = data;
             console.log(this.products);
      }
      
    ); */

    this.productService.getProductListPaginate(this.thePageNumber - 1,this.thePageSize,this.currentCategoryId).subscribe(
      this.processResult()

    );
  }
  processResult() {
    return data => {
      this.products=data._embedded.products;
      this.thePageNumber=data.page.number + 1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
    }
  }

updatePageSize(pageSize:number)
{
  this.thePageSize=pageSize;
  this.thePageNumber=1;
  this.listProducts();
}
}
