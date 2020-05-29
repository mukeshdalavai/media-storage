const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/data',{useNewUrlParser : true, useUnifiedTopology : true},(err) =>{
    if(!err){
        console.log('Connected to mongoDB');
        Folder.find().then(docs => {
            if(docs.length == 0){
                const folder = new Folder({
                    name : "base",
                    folders : [],
                    files : [],
                    creationDate : Date.now(),
                    type : "folder",
                    size : 0
                })
                folder.save({new : true}).then((doc) => console.log(doc));        
            }
        }).catch((err) => console.log(err));
        
    }else{
        console.log('Error in Connection -> ' + err);
    }
})

const FileSchema = new mongoose.Schema({
    name : String,
    alias : String,
    path : String,
    creationDate : Date,
    type : String,
    size : Number
})

const FolderSchema = new mongoose.Schema();
FolderSchema.add({
    name : String,
    folders : [FolderSchema],
    files : [FileSchema],
    creationDate : Date,
    type : String,
    size : Number
})

// console.log(FolderSchema);


const Folder = mongoose.model('folder',FolderSchema);
const File = mongoose.model('file',FileSchema);


exports.File = File;
exports.Folder = Folder;
exports.FileSchema = FileSchema;