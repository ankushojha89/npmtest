var mongoose=require('mongoose');

var Employee=mongoose.model('Employee',{
    name:{
        type:String,
        required: true,
        minlength:3,
        trim:true
    },
    email:{
        type:String,        
        trim:true   ,
        required: true,    
    },    
    designation:{
        type:String,        
        trim:true,
        default:null
    },
    short_desc:{
        type:String,        
        trim:true,
        default:null
    },  
    desc:{
        type:String,        
        trim:true,
        default:null
    },
    profileimage:{
        type:String,        
        trim:true,
        default:'noimage.jpg'
    },       
    createdAt:{
        type: Date, 
        default: Date.now
    },
    updatedAt:{
        type: Date, 
        default: Date.now
    }
});

module.exports={Employee};