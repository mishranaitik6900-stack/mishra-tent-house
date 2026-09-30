const express=require("express"),fs=require("fs"),path=require("path");
const app=express(),PORT=process.env.PORT||3000,DB=path.join(__dirname,"bookings.json");
if(!fs.existsSync(DB))fs.writeFileSync(DB,"[]");
app.use(express.json());app.use(express.static(path.join(__dirname,"public")));
const read=()=>JSON.parse(fs.readFileSync(DB));const write=x=>fs.writeFileSync(DB,JSON.stringify(x,null,2));
app.get("/api/bookings",(req,res)=>res.json(read()));
app.post("/api/bookings",(req,res)=>{
 const b=req.body;if(!b.name||!b.phone||!b.date||!b.floor)return res.status(400).json({error:"Missing required fields"});
 let a=read();if(a.some(x=>x.date===b.date&&x.floor===b.floor&&x.status!=="Cancelled"))return res.status(409).json({error:"That floor is already booked for this date"});
 b.id=Date.now();b.status="Pending";a.push(b);write(a);res.json(b);
});
app.patch("/api/bookings/:id",(req,res)=>{let a=read(),i=a.findIndex(x=>x.id==req.params.id);if(i<0)return res.sendStatus(404);a[i].status=req.body.status||a[i].status;write(a);res.json(a[i])});
app.delete("/api/bookings/:id",(req,res)=>{write(read().filter(x=>x.id!=req.params.id));res.sendStatus(204)});
app.listen(PORT,()=>console.log(`Mishra Tent House running on ${PORT}`));