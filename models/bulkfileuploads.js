var mongoose=require('mongoose');

var BulkFileDetail=mongoose.model('BulkFileDetail',{
    filename:{
        type:String,
        required: true            
    },
    status:{
        type:String,        
        default:'Processing file'    
    },    
    errorfile:{
        type:String,        
        trim:true,
        default:null
    },
    successfile:{
        type:String,        
        trim:true,
        default:null
    },  
    totalrecords:{
        type:Number,     
        default:0
    },
    successrecords:{
        type:Number,     
        default:0
    },
    errorrecords:{
        type:Number,     
        default:0
    },       
    uploadedAt:{
        type: Date, 
        default: Date.now
    }
});

module.exports={BulkFileDetail};