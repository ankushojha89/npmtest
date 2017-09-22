var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload=multer({dest:'./public/profileimages'});
var csv = require('fast-csv');
var csvupload=multer({dest:'./public/bulkuploads'});
const _=require('lodash');

// database local files
var {mongoose}=require('./../models/dbconfig');
var {Employee}=require('./../models/employee');
var {BulkFileDetail}=require('./../models/bulkfileuploads');

var {csvUploads}=require('./uploads');

// local variables
const {ObjectID}=require('mongodb');

// // csv file variables
// var vaildArray = [];
// var errorArray = [];
// var fileHeaders= ['name', 'email', 'designation','short_desc','desc'];

/* GET home page. */
router.get('/', function(req, res, next) {            
        res.render('admin/index', { title: 'Welcome to Admin Area' });   
});

//********************************************/
// Views call for fronthand
//********************************************/

router.get('/add', function(req, res, next) {
  res.render('admin/add', { title: 'Add Employee' });
});


router.get('/bulkupload', function(req, res, next) {
  res.render('admin/bulkupload', { title: 'Add Employee' });
});



//********************************************/
// restful api for single update
//********************************************/
router.get('/rest',(req,res)=>{        
        Employee.find().then((employees)=>{
        if(employees.length<1){  
                return  res.status(404).send({error:'No employees exist in record'});
                }        
         res.send({employees});
       },(e)=>{
            res.status(400).send(e);
    });
});

router.get('/rest/:id',(req,res)=>{        
        var id=req.params.id;
        if(!ObjectID.isValid(id)){        
                 return  res.status(404).send({error:'Not a valid id'});
        }    
        Employee.findById(id).then((employee)=>{
                if(!employee){  
                return  res.status(404).send({error:'No employee found'});
                }             
                res.send({employee});
        }).catch((e)=>{ 
                res.status(400).send(e);
        });
});

router.post('/rest', upload.single('profileimage') ,function(req, res, next) {

    //varibales 
    var name =req.body.name;
    var email =req.body.email;
    var designation =req.body.designation;
    var short_desc =req.body.short_desc;
    var desc =req.body.desc;
    
    if(req.file){
        console.log("Locading..."+req.file.filename);
        var profileimage=req.file.filename;
    }else{
        var profileimage='noimage.jpg';
    }    
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Valid email field is required').isEmail();
    req.checkBody('designation','Designation field is required').notEmpty();
    req.checkBody('short_desc','Short Description field is required').notEmpty();
    req.checkBody('desc','Description field is required').notEmpty();
        
    var errors=req.validationErrors();
    
    if(errors){              
        return  res.status(404).send({ message: 'Bummer! Error Add Employee',
        errors});        
    }else{            
        //insert  
        var employee=new Employee({
                name,designation,short_desc,
                desc, email, profileimage
            });
            employee.save().then((doc)=>{
                return  res.send(doc);
            },(e)=>{
                return  res.status(400).send(e);
            });
    }       
});

router.delete('/rest/:id',(req,res)=>{        
            var id=req.params.id;
            if(!ObjectID.isValid(id)){        
                return  res.status(404).send({error:'Not a valid id'});
            }    
            Employee.findByIdAndRemove(id).then((employee)=>{              
                    if(!employee){                
                        return  res.status(404).send({error:'No employee found'});
                    }               
                    res.send({employee});
                }).catch((e)=>{ 
                    res.status(400).send(e);
                });
 }); 

 router.patch('/rest/:id',upload.single('profileimage'),(req,res)=>{
 
        var id=req.params.id;
        var body=_.pick(req.body,['name','email','designation','short_desc','desc']);
        
       
        
        if(!ObjectID.isValid(id)){        
            return  res.status(404).send({error:'Not a valid id'});
        } 
       
        body.updatedAt=new Date().getTime();          
        
        if(req.file){
                console.log("Locading..."+req.file.filename);
                profileimage=req.file.filename;
        } 

        Employee.findByIdAndUpdate(id,{$set:body},{new :true}).then((employee)=>{
            if(!employee){
                return  res.status(404).send({error:'No employee found'}); 
            }
            res.send({employee});
        }).catch((e)=>{ 
            res.status(400).send(e);
        });
    
    });



//********************************************/
// restful api for Bulk Uploads
//********************************************/ 


router.post('/rest/bulkuploads', csvupload.single('csvUpload') ,function(req, res, next) {
   
    if(req.file){

        console.log("CSV File Locading..."+req.file.filename); 
        var fileId=new ObjectID();
        
       processCsvFile(req.file.filename,fileId);
       console.log("CSV File Uploaded..."+req.file.filename);
       return  res.status(200).send({message:req.file.filename+' file uploaded successfully. Please check status after some time.'}); 
    }else{
        return  res.status(404).send({message:'No File Found'}); 
    }     
});

function processCsvFile(filename,fileId){ 

    console.log("CSV File processing..."+filename);

    var bulkFileDetail=new BulkFileDetail({ _id:fileId,filename});

    bulkFileDetail.save().then((doc)=>{
      
        csvUploads(filename,doc._id);
        
    },(e)=>{
        console.log("CSV File Not Processed..."+filename);
    });

   
      
}



//********************************************/
// restful api for bulk list
//********************************************/
router.get('/rest/bulkupload/list',(req,res)=>{        
    BulkFileDetail.find().sort([['uploadedAt', 'descending']]).then((bulkuploadlist)=>{
    if(bulkuploadlist.length<1){  
            return  res.status(404).send({error:'No records exist.'});
            }        
     res.send({bulkuploadlist});
   },(e)=>{
        res.status(400).send(e);
});
});

 module.exports = router;