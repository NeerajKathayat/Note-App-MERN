const express = require("express")
const bcrypt = require("bcrypt")
require("./config/db.js")
const app = express();
const User = require("./models/user.model")
const Note = require("./models/note.model")
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname,'config/.env')});
const jwt = require('jsonwebtoken')
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser()); 

app.use(cors({
    origin: 'https://note-app-mern-frontend-two.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(express.json());

const tokenSecret="abcdef"


app.post("/signup",async (req,res)=>{
      const {name,email,password} = req.body;

      if (!name || !email || !password) {
        return  res.status(400).json({success:false,message:"All fields are required"})
    }

    try{
       
      const existingUser = await User.findOne({email: email});

      if(existingUser){
         return res.status(400).json({success:false,message:"User Already Exist"})
      }

      HashedPassword =  await bcrypt.hash(password,10)

      const user = await User.create({
        name,
        email,
        password:HashedPassword
      })

      await user.save();

      res.status(201).json({
        success:true,
        message:'Sucessfully signed up'
      })
    }catch(err){
        return res.status(500).json({
            success:false, message:"Internal Server Error"
        })
    }

})


app.post("/login",async (req,res)=>{
     const {email,password} = req.body;

     if(!email || !password) {
        return  res.status(400).json({success:false,message:"All fields are required"})
     }
    
    try{

     const user = await User.findOne({email : email}).select("+password")

     if(!user){
        return res.status(401).json({success:false,message:"Invalid Email or Password"})
     }

     const passwordMatch = await bcrypt.compare(password,user.password)

     if (!passwordMatch) {
        return res.status(401).json({success:false,message:"Invalid email or password"});
    }
  
    const accessToken = jwt.sign({id:user._id},tokenSecret,{
        expiresIn:"30m"
    })

    const options = {
        httpOnly : true,
        secure : true,
        sameSite:'None',
        maxAge: 1800000
    }

    user.password = undefined;

    return res.status(200).cookie("token",accessToken,options).json({success:true,user,message:"successfully loged in"})

   }
    catch(err){
        return res.status(500).json({
            success:false, message:"Internal Server Error"
        })
    }


})


app.get("/get-note",verifyToken,async(req,res)=>{
      const userId = req.user.id;

      const notes = await Note.find({userId:userId}).sort({isPinned:-1});

      res.status(200).json({success:true,notes,message:"note successfully retrived"})
})


app.post("/add-note",verifyToken,async(req,res)=>{
    const {title,content,tagList} = req.body;
    const user= req.user.id;

    console.log(title + content + tagList + user)

    if(!title){
        return res.status(400).json({success:false,message:"Title is required"})
    }

    if(!content){
        return res.status(400).json({success:false, message:"Content is requried"})
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tagList || [],
            userId: user
        })

        await note.save();

        return res.status(200).json({success:true,note,message:"Note added successfully"})
    }
    catch(err){
        return res.status(500).json({
            success:false, message:"Internal Server Error"
        })
    }

})



app.put("/edit-note/:noteId",verifyToken,async(req,res)=>{
    const noteId = req.params.noteId;
    const {title,content,tagList,isPinned} = req.body;
    const user= req.user.id;

    console.log(title + content + tagList + user)

    if(!title && !content && !tagList){
        return res.status(400).json({success:false,message:"No changes provided"})
    }



    try{

        const note = await Note.findById(noteId)
        console.log(note)

        if(!note){
            return res.status(404).json({error:true,message:"Note not found"})
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tagList) note.tags = tagList;
        if(isPinned) note.isPinned = isPinned

        console.log(note)

        await note.save();

        return res.status(200).json({success:true,note,message:"Note updated successfully"})
    }
    catch(err){
        return res.status(500).json({
            success:false, message:"Internal Server Error"
        })
    }

})


app.delete("/delete-note/:id",verifyToken,async(req,res)=>{
    const id = req.params.id;

    const note = await Note.deleteOne({_id:id})

    if(!note){
        return res.status(400).json({success:false,message:"Note not found"})
    }

       return res.status(200).json({success:true,message:"Note deleted successfully"})


})



app.put("/updated-note-pinned/:noteId",verifyToken,async(req,res)=>{
       
    const noteId = req.params.noteId;
    const {pinned} = req.body;
    const user= req.user.id;

    console.log("isPinned " + pinned)



    try{

        const note = await Note.findById(noteId)
        console.log(note)

        if(!note){
            return res.status(404).json({error:true,message:"Note not found"})
        }

        note.isPinned = pinned

        console.log(note)

        await note.save();

        return res.status(200).json({success:true,note,message:"Note updated successfully"})
    }
    catch(err){
        return res.status(500).json({
            success:false, message:"Internal Server Error"
        })
    }


    
})


app.post('/logout',(req,res)=>{
    res.clearCookie('token',{
            httpOnly : true,
            secure : true,
            sameSite:'None'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
})

function verifyToken(req,res,next){

    console.warn("token",req.cookies?.token);

    const token = req.cookies?.token;

    if(token){
    //    token=token.split(' ')[1];
       jwt.verify(token,tokenSecret,(err,decoded)=>{
          if(err){
             res.status(401).send('Please provide a valid token')
          }
          else{
             console.log(decoded)
             req.user=decoded;
             console.log(req.user)
             next();
          }
       })
    }
    else{
     res.status(403).send({result:"Please provide a token"});
    }

}

app.listen(process.env.PORT,()=>{
    console.log(`Server started on port ${process.env.PORT}`)
})