function deleteThisProduct(Pid){
    $.post('DProd',{id:Pid},(data)=>{
        console.log(data)
        refreshList()
    })
}

function refreshList(){
    $.get('/Products',(data)=>{
        $('#productList').empty()
        for (let product of data) {
            $('#productList').append(
              `
              <div class="col-sm-3">
                <div class="card mt-3">
                    <div class="card-body text-center">
                        <h5 class="card-title">Name : ${product.name}</h5>
                        <h6>Vendor : ${product.vendorName}</h6>
                        <h6>Price : Rs.${product.price}</h6>
                        <h6>Quantity : ${product.quantity}</h6>
                        <button class="btn btn-danger" onclick="deleteThisProduct(${product.id})">Delete</button>
                    </div>
                </div> 
            </div>`
            )
          }
    })
}


$(function(){
    refreshList();
    $.get('/list',(data)=>{
        for(let vendor of data){
            $('#listVendors').append(`<option>${vendor.name}</option>`)
        }
    })

    vendors = $('#listVendors')
    PName =  $('#PName')
    PQuantity =  $('#PQuantity')
    PPrice = $('#PPrice') 
    
    $('#PAdd').click(()=>{
        if(PName.val()==""){
            alert("Enter the Name of Product")
        }
        else if(PQuantity.val()==""){
            alert("Enter the Quantity of Product")
        }
        else if(PPrice.val()==""){
            alert("Enter the Price of Product")
        }
        else{
            $.post('\Product',
            {
                PName:PName.val(),
                PPrice:PPrice.val(),
                PQuantity:PQuantity.val(),
                PVendor:vendors.val()
            },(data)=>{
            console.log('Added')
            console.log(data)
                refreshList()
            })
        }
        refreshList()
    })

    $('#Vendor').click(()=>{
        window.location="vendors.html"
    })
    
    $('#Login').click(()=>{
        window.location="user.html"
    })

    $('#Home').click(()=>{
        window.location="index.html"
    })
})