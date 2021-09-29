const express = require("express");
const app = express();
const bodyparser=require('body-parser');
const ejs=require('ejs');
const _=require("lodash");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://akash3213:akash3213@cluster0.fjak1.mongodb.net/dataDB",{useNewUrlParser:true});

// arrays of cities, states ,.. decalred with 6 elements each and random element is picked while creating mock data
//kindly note some cities does not belong to its state (acc to map) in the data as its random( like clg 1 in mumbai,kerala)
const cities=["Hyderabad","Chennai","Mumbai","Pune","Delhi","Kolkata"];
const states=["A.P","Tamil Nadu","Kerala","Telangana","Karnataka","Punjab"];
const courses=["CSE","Mechanical","Civil","Electrical","Aerospace","Chemical"];
const skills=["C","C++","Python","JS","HTML","Java"];
const batches=[2016,2017,2018,2019,2020,2021];

//creating studentSchema
const studentSchema=new mongoose.Schema({
  student_id:String,
  name:String,
  batch:Number,
  skill:String,
  clg_id:Number,
});
const Student=mongoose.model("Student",studentSchema);

//creating collegeSchema
const collegeSchema=new mongoose.Schema({
  clg_id:Number,
  name:String,
  year_founded:Number,
  city:String,
  state:String,
  country:String,
  no_of_students:Number,
  course:String,
  student_det:Array,
  course:String
});
const College=mongoose.model("College",collegeSchema);
var i=1;

// create a fake mock data of 100 clgs with 100 students each
College.find({},function(err,found){
  if(found.length===0){
    for(i=1;i<=100;i++){
      const a=new College({
        clg_id:i,
        name:"College_"+i,
        year_founded:1900+i,
        city:cities[Math.floor(Math.random() * 6)],
        state:states[Math.floor(Math.random() * 6)],
        country:"India",
        no_of_students:100,
        course:courses[Math.floor(Math.random() * 6)]
      }); 
    a.save();
    }
    var i=1;
    var j=1;
    
    while(i<=100){
      var j=1;
      while(j<=100){
        const b=new Student({
          student_id:"id_"+i+"_"+j,
          name:"Student_"+i+"_"+j,
          batch:batches[Math.floor(Math.random() * 6)],
          skill:skills[Math.floor(Math.random() * 6)],
          clg_id:i 
        });
        b.save();
        j++;
      } 
      i++;
    }
  }
});

// to get the number of colleges in various branches
var arr=[];
College.find({course:"Mechanical"},function(err,found){  
  arr.push(found.length);  
});
College.find({course:"CSE"},function(err,found){
  arr.push(found.length);
});
College.find({course:"Civil"},function(err,found){
  arr.push(found.length);
});
College.find({course:"Electrical"},function(err,found){
  arr.push(found.length);
});
College.find({course:"Aerospace"},function(err,found){
  arr.push(found.length);
});
College.find({course:"Chemical"},function(err,found){
  arr.push(found.length);
});

// to get the number of colleges in various states
var arr2=[];
College.find({state:"A.P"},function(err,found){  
  arr2.push(found.length);
});
College.find({state:"Tamil Nadu"},function(err,found){
  arr2.push(found.length);
});
College.find({state:"Kerala"},function(err,found){
  arr2.push(found.length);
});
College.find({state:"Karnataka"},function(err,found){
  arr2.push(found.length);
});
College.find({state:"Punjab"},function(err,found){
  arr2.push(found.length);
});
College.find({state:"Telangana"},function(err,found){
   arr2.push(found.length);
});

// get default page of the website
  app.get("/", function(req, res) {   
    res.sendFile(__dirname+"/index.html");
  });
//get courses page
  app.post("/courses", function(req, res){
    res.render('course',{mech:arr[0],cse:arr[1],civil:arr[2],elec:arr[3],chem:arr[5],aero:arr[4]});
  });
  //get states page
  app.post("/states", function(req, res) {
    res.render('states',{ap:arr2[0],tn:arr2[1],ker:arr2[2],kar:arr2[3],pun:arr2[4],tel:arr2[5]});
  });
  //get clgs offering specific course
  app.get("/courses/:branch",function(req,res){
    const branch=req.params.branch;
    const linkurl="/courses/"+branch+"/";
      College.find({course:branch},function(err,found){
        res.render("list_c",{items:found,branch:branch,linkurl:linkurl});
      });
  });
  //get clgs in various states
  app.get("/states/:state",function(req,res){
    const state=req.params.state;
    const linkurl="/states/"+state+"/";
    console.log(state,linkurl);
      College.find({state:state},function(err,found){
        res.render("list_cs",{items:found,branch:state,linkurl:linkurl});
      });
  });

  //get all students in clg offering specific course 
  app.get("/courses/Mechanical/+:college",function(req,res){

    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/courses/CSE/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/courses/Civil/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/courses/Electrical/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/courses/Chemical/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/courses/Aerospace/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });

  //get all students in clg in specific state 
  app.get("/states/A.P/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/states/Tamil Nadu/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/states/Kerala/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/states/Karnataka/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/states/Punjab/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
  app.get("/states/Telangana/+:college",function(req,res){
    Student.find({clg_id:req.params.college.slice(9)},function(err,found){
     res.render("list_s",{items:found,numb:req.params.college.slice(9)});
    });
  });
// search college by name when the button is clicked
  app.post("/getclg",function(req,res){
    const college_name=req.body.college_name;
    College.find({name:college_name},function(err,found){
      res.render("clg",{item:found[0]});
    });
  });
//search similar colleges (offering similar course and in similar locality) when the button is clicked
  app.post("/getsimilarclg",function(req,res){
    const similar_college_name=req.body.similar_college_name;
    College.find({name:similar_college_name},function(err,found){
      College.find({city:found[0].city,course:found[0].course},function(err,founded){
        if(founded.length>1){
          res.render("sim_clg",{items:founded,clg_name:similar_college_name,course:found[0].course});
        }
        else{
          res.render("sim_clg_empty");
        } 
      });
    });
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Success");
});