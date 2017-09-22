var csv = require('fast-csv');
const fs = require('fs');

// database local files
var {mongoose}=require('./../models/dbconfig');
var {Employee}=require('./../models/employee');
var {BulkFileDetail}=require('./../models/bulkfileuploads');
// csv file variables

var fileHeaders= ['name', 'email', 'designation','short_desc','desc'];

csvUploads =(efilename,fileDBId)=>{
    var totalCount=0;
    var vaildArray = [];
    var errorArray = [];
    console.log(efilename);
      var filePath=process.env.PROJECT_ROOT+ `/public/bulkuploads/${efilename}`;
csv
.fromPath(filePath, {headers: fileHeaders,ignoreEmpty: true})
.validate((data)=>{

    totalCount++;   
//trim data
data.name=data.name.trim();
data.email=data.email.trim();
data.designation=data.designation.trim();
data.short_desc=data.short_desc.trim();
data.desc=data.desc.trim();
return data.name.length>0 && data.name.length<20;
})
.on("data-invalid", function(data){

var rejectionError="SERVER REJECTED:";

if(!(data.name.length>0 && data.name.length<20)){
rejectionError=rejectionError+" NAME(length<20) Required";
}
data.ERRORS=rejectionError; 
errorArray.push(data);

})
.on('data', function(data) {
vaildArray.push(data);
})
.on('end', function() {
    console.log("oooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
  console.log("CSV Validation Processed..."+efilename);
console.log(vaildArray);
console.log(errorArray);
console.log(totalCount);
//if started
if(vaildArray.length>0){
Employee.insertMany(vaildArray, function(err, result) {
   
    if(err){ 
        console.log("Database Not Updated for CSV..."+efilename);
    };  
    let resultJSON = JSON.stringify(result, null, 2); 
    let errorArrayJSON = JSON.stringify(errorArray, null, 2); 
    fs.writeFileSync(process.env.PROJECT_ROOT+ `/public/bulkuploadsrejected/${efilename}.json`, errorArrayJSON);  
    fs.writeFileSync(process.env.PROJECT_ROOT+ `/public/bulkuploadssuccess/${efilename}.json`, resultJSON);  
    
    var details={
        successrecords:result.length,
        totalrecords:totalCount,
        errorrecords:errorArray.length,
        errorfile:efilename+'.json',
        successfile:efilename+'.json',
        status:'Completed'
    };
    console.log("Database Updated for CSV ..."+efilename);
    BulkFileDetail.findByIdAndUpdate(fileDBId,{$set:details},{new :true}).then((todo)=>{
        console.log("Bulk File Details updated..."+efilename);
    }).catch((e)=>{ 
        console.log("Bulk File Details not updated..."+efilename);
    });
    
  });

}else{
    var details={
        successrecords:vaildArray.length,
        totalrecords:totalCount,
        errorrecords:errorArray.length,
        status:'Completed'
    };
    console.log("Database Updated for CSV ..."+efilename);
    BulkFileDetail.findByIdAndUpdate(fileDBId,{$set:details},{new :true}).then((todo)=>{
        console.log("Bulk File Details updated..."+efilename);
    }).catch((e)=>{ 
        console.log("Bulk File Details not updated..."+efilename);
    });
}
// if else closed

});

     
}
module.exports = {csvUploads};