
function deleteThisVendor(Vid) {
    $.post('DVend',{id:Vid},(data)=>{
        console.log(data)
        refreshList()
    })
}

function refreshList(){
    $.get('/list',(data)=>{
        $('#list').empty()
        for(let vendor of data){
            $('#list').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <i>${vendor.name}</i>
                    <button class="btn btn-primary" onclick="deleteThisVendor(${vendor.id})">Delete</button>
                </li>
            `)  
        }
    })
}
$(function(){
        refreshList()
        $('#Add').click(()=>{
            Vendor = $('#AddVendor')
            value = $('#AddVendor').val()

            if(value!=""){
                $.post('/hel', {
                    vendorName : value
                },function(Data){
                    console.log(Data);
                    $('#AddVendor').val("")
                    refreshList()
                });
            }
            else{
                alert("Enter Vendor Name First!!")
            }
        })

    $('#Products').click(()=>{
        window.location="products.html"
    })

    
    $('#Login').click(()=>{
        window.location="user.html"
    })
})
