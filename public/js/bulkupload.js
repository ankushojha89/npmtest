$( document ).ready( function() {
    // your code here
    getBulkUploadsList();   
    
    bulkFormSubmitted();
       

} );

function getBulkUploadsList(){
    $.ajax({
        type: 'GET',
        url: '/admin/rest/bulkupload/list',       
        success: function(data) {
           //  console.log(data.bulkuploadlist);

           $('#bulkUploadTable tbody').empty();
                 $.each(data.bulkuploadlist, function(i, item) {
                    var temp=`<tr><th scope="row">${i+1}</th>
                    <td >${item.filename}</td>
                    <td>${item.uploadedAt}</td>
                    <td >${item.totalrecords}</td>
                    <td>${item.successrecords}</td>
                    <td >${item.errorrecords}</td>
                    <td width="10%">${item.status}</td>
                      <td width="25%"><a class="btn btn-info" target="_blank" href="/bulkuploads/${item.filename}">Upload</a>`;
                    if(item.successfile!=null){
                        temp=temp+`<a class="btn btn-success" target="_blank" href="/bulkuploadssuccess/${item.successfile}">Success</a>`;
                        
                    }
                    if(item.errorfile!=null){
                        temp=temp+`<a class="btn btn-danger" target="_blank" href="/bulkuploadsrejected/${item.errorfile}">Rejected</a>`;
                    }
                    temp=temp+`    </td>    </tr>`;
                  $('#bulkUploadTable tbody').append(temp);
                  
                });

        }
    });
}

function bulkFormSubmitted(){
    var frm = $('#bulkuploads');
    
        frm.submit(function (e) {
            e.preventDefault();    
           
          $.ajax({
                type: frm.attr('method'),
                enctype: 'multipart/form-data',
                dataType: 'json',
                url: frm.attr('action'),
                data: new FormData($('form')[0]),
                processData: false,
                contentType: false,
                cache: false,
                success: function (data) {
                    console.log(data);
                    document.getElementById("bulkuploads").reset();
                    getBulkUploadsList(); 
                    console.log('Submission was successful.');
                    document.getElementById("messages").innerHTML = 
                    "<div id='alert' class='alert alert-success alert-dismissible fade show' role='alert'>"+
                    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"+
                     " <span aria-hidden='true'>&times;</span> </button>  "+
                     " <strong>"+data.message+".</strong></div>";                 
                     window.setTimeout(function () { $("#alert").alert('close'); }, 10000); 
                },
                error: function (data) {               
                    console.log('errors : ',data);                    
                  //  console.log(data); 
                  getBulkUploadsList(); 
                    document.getElementById("messages").innerHTML =       "<div id='alert' class='alert alert-danger alert-dismissible fade show' role='alert'>"+
                    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"+
                     " <span aria-hidden='true'>&times;</span> </button>  "+
                     " <strong>"+data.responseJSON.message+"</strong></div>"; 
                     window.setTimeout(function () { $("#alert").alert('close'); }, 10000); 
                },
            });
        });
    
    
       

}