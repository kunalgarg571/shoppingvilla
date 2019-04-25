function AddThisProduct(pid){
    var fin = '#qty'+pid
    quantity = $(fin).val()
    
    var uid = localStorage.getItem('userId')
    var userName = localStorage.getItem('userName')


    if(userName!=null){
        if(quantity=="" || quantity<1){
            alert("Enter Valid Quantity!!")
        }
        else{
            
        $.post('/getQuant',{productId:pid,Quantity:quantity,userId:uid},(data)=>{
            $(fin).val("")
            alert(data.message)
        })
        }
    }
    else{
        alert("Login First!!")
    }
}

function refreshList(){
    localStorage.clear()
    $('#enter').attr("disabled",false);
    $('#cart').attr("disabled",true);
    $.get('/products',(data)=>{
        $('#productList').empty()
        for(let product of data){
            console.log(product)
            $('#productList').append(`
            <div class="col-sm-3">
            <div class="card mt-3">
                <div class="card-body text-center">
                    <h5 class="card-title">Name : ${product.name}</h5>
                    <h6>Vendor : ${product.vendorName}</h6>
                    <h6>Price : Rs.${product.price}</h6>
                    <h6>Quantity : ${product.quantity}</h6>
                    <input type="number" min=1 class="form-control" id="qty${product.id}"placeholder="Qty">
                    <button class="btn btn-danger" onclick="AddThisProduct(${product.id})">AddToCart</button>
                </div>
            </div> 
        </div>`)
        }
    })
}

function fun(){
    var user = {}
    var username = $('#user')
    var email = $('#email')

    user.username = username.val()
    user.email = email.val()

    if(user.username==""){
        alert("Username is Mandatory!!")
    }
    else if(user.email==""){
        alert("Email is Mandatory!!")
    }
    else{
        $.post('/AUsr',user,(data)=>{
            if(localStorage.getItem('userName')==null){
                localStorage.setItem('userId',data.use.id)
                localStorage.setItem('userName',data.use.username)
                console.log(data)
                x = $('#Username')
                var la = document.createElement('i')
                la.innerText = data.use.username
                x.append(`<button class="btn btn-outline-primary" id='uuu' type="button"style="margin-left:5%">${data.use.username}</button>`)
                email.val("")
                username.val("")
                $('#enter').attr("disabled",true);
                $('#cart').attr('disabled',false);
                $('#uuu').attr('disabled',true);
            }
        })
    }
}

$(function(){
    refreshList()
    $('#enter').click(()=>{
        fun()
    })

    $("#cart").click(()=>{

        if(localStorage.getItem("userName")!=null){
            window.location="cart.html"
        }
        else{
            alert("Login First")
        }

        
    })

    $('#Vendor').click(()=>{
        window.location="vendors.html"
        
    })

    
    $('#Products').click(()=>{
        window.location="products.html"
    })

    $('#Home').click(()=>{
        window.location="index.html"
    })
})