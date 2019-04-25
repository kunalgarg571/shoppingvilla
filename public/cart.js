function deleteThisProductFromCart(productId){
  $.post('/RemCart',{pid:productId},(data)=>{
    console.log(data)
    refreshList()
  })
}


function refreshList() { 
    $.post('/getItems', {userId:localStorage['userId']} ,(data) => {
       $('#productList').empty()
    if(data.success)
    {
      
       for (let product of data.data) {
        
         $.post('/getProduct',{pid:product.productId},(mproduct)=>{
           console.log(mproduct)
          
           $('#productList').append(
             `<tr>
             <td class="col-sm-1 col-md-1 text-center"><strong>${mproduct.name}</strong></td>
             <td class="col-sm-1 col-md-1 text-center"><strong>${mproduct.vendor.name}</strong></td>
             <td class="col-sm-1 col-md-1 text-center"><strong>${product.quantity}</strong></td>
            
             <td class="col-sm-1 col-md-1 text-center"><strong>Rs.${mproduct.price}</strong></td>
             <td class="col-sm-1 col-md-1 text-center"><strong>Rs.${product.quantity*mproduct.price}</strong></td>
             <td class="col-sm-1 col-md-1">
             <button type="button" class="btn btn-danger" onclick=deleteThisProductFromCart(${mproduct.id})>
                             <span class="glyphicon glyphicon-remove "></span> Remove
                         </button></td>
            </tr>`
           )
         })
       }     
    }  
    // else
    // {
    //   alert('something went wrong while fetching products')
    // }   
      console.log(data);
    
     })
   }
   refreshList();
   $(function(){
     $("#Home").click(()=>{
       window.location="index.html"
     })
     
     $("#Products").click(()=>{
      window.location="products.html"
    })
    
    $("#Vendor").click(()=>{
      window.location="vendors.html"
    })

    $("#user").click(()=>{
      window.location="user.html"
    })
   })