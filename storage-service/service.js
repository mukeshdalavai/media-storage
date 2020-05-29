const router = require('express').Router();
const multer = require('multer');
const db = require('./db');

const upload = multer({dest : '/uploads'});
db.Folder.find().then(docs => {
    if(docs.size == 0){
        const folder = new db.Folder({
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

router.get('/',(req, res) => {
    db.Folder.find().then(docs => res.status(200).send(docs))
            .catch((err) => res.status(400).send(err));
});

router.get('/folder', (req, res) =>{
    db.Folder.findOne({name : 'base'}).then((doc) => {
        let locs = (req.query.path).split('/');
        let data = doc;
        for (let loc of locs){
            if (loc == '') { continue;}
            data = data.folders.filter((fol) => {return fol.name == loc})[0];
        }
        res.status(200).send(data);
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);});
})


router.get('/file' , (req, res) =>{
    res.status(200).sendFile(`/uploads/${req.query.filename}`);
})


router.post('/file', upload.single('file'), async (req, res) =>{
    let base = await db.Folder.findOne({name : 'base'});
    let data = base;
    const locs = (req.query.path).split('/');
    console.log(locs);
    for(let loc of locs){
        if (loc == '') {continue;}
        // console.log(data.folders);
        data.size += req.file.size;
        data = data.folders.filter(folder => {return folder.name == loc})[0];
    }
    const file = new db.File({
        name : req.file.originalname,
        alias : req.file.filename,
        creationDate : Date.now(),
        path : req.file.path,
        type : req.file.mimetype,
        size : req.file.size
    })
    data.files.push(file);
    data.size += req.file.size;
    base.save().then((doc) => { res.status(200).send(doc)}).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })

})


router.post('/folder', async (req, res) =>{
    const folder = new db.Folder({
        name : req.body.name,
        folders : [],
        files : [],
        creationDate : Date.now(),
        type : req.body.type,
        size : 0
    })
    let base = await db.Folder.findOne({name : 'base'});
    let data = base;
    console.log(`Path for creating folder = ${req.query.path}`)
    const locs = (req.query.path).split('/');
    console.log(locs);
    for(let loc of locs){
        if (loc == '') {continue;}
        data = data.folders.filter(folder => {return folder.name == loc})[0];
    }
    data.folders.push(folder);
    base.save().then((doc) => {res.status(200).send(doc)}).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
})

router.post('/base',(req, res) =>{
    const folder = new db.Folder({
        name : req.body.name,
        folders : [],
        files : [],
        creationDate : Date.now(),
        type : req.body.type,
        size : 0
    })
    folder.save({new : true}).then((doc) => res.status(200).send(doc));
})

router.post('/remove/:type', (req, res) =>{
    db.Folder.findOne({name : 'base'}).then((base) =>{
        let data = base;
        let locs = (req.query.path).split('/');
        let size = 0;
        for(let loc of locs){
            if(loc == '') {continue;}
            data.size -= req.body.size;
            data = data.folders.filter(folder => {return folder.name == loc})[0];
        }
        data.size -= req.body.size;

        if(req.params.type == 'file'){
            data.files = data.files.filter((file) => {return file.name != req.body.name});
        }else if(req.params.type == 'folder'){
            data.folders = data.folders.filter((fol) => {return fol.name != req.body.name});
        }
        base.save().then((doc) => res.status(200).send(doc)).catch((err) => {console.log(err);res.status(400).send(err)});
    })
})

exports.router = router;