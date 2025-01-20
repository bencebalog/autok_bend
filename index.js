import express from "express"
import cors from "cors"
import fs from "fs"




let autok=[]
let nextid=0;
fs.readFile("autok.csv","utf-8",(error,data)=>{
    if(error)console.log(error);
    else{
        console.log(data);
        let sorok = data.split("\r\n");
        for(let sor of sorok){
            let s = sor.split(";");
            autok.push({ id:s[0]*1, tipus:s[1], suly:s[2]*1, loero:s[3]*1})
        }
        for(let a of autok)if(a.id>nextid)nextid=a.id
        console.log("beolvasott autok :"+autok.length+" ( nextID : "+nextid+" )")
    }
})


function postAutok(req,res) {
    if(req.body.tipus&& req.body.suly && req.body.loero){
        const auto = { id:nextid++, tipus:req.body.tipus, suly:req.body.suly*1, loero:req.body.loero*1}
        autok.push(auto)
        res.send(auto)
    }else res.send({error:"Hiányzó paraméterek!!"})
}
function modAutok(req,res) {
    if(req.body.id&&req.body.tips&& req.body.suly && req.body.loero){
        let i = indexOf(req.body.id*1);
        if(i!=-1){
            const auto = { id:req.body.id*1, tipus:req.body.tipus, suly:req.body.suly*1, loero:req.body.loero*1}
            autok.push(auto)
            res.send(auto)
        }else res.send({error:"Hibás azonosító!!"})
    }else res.send({error:"Hiányzó paraméterek!!"})
}


function delAutok(req,res) {
    if(req.body.id){
        let i = indexOf(req.body.id*1);
        if(i!=-1){
            const auto = autok.splice(i,1)
            res.send(auto[0])
        }else res.send({error:"Hibás azonosító!!"})
    }else res.send({error:"Hiányzó paraméterek!!"})
}
function indexOf(id){
    let i = 0;while (i<autok.length&&autok[i].id!=id)i++    
    if(i<autok.length)return i; else return -1;
}
const app = express();

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>res.send("<h1>Autok v1.0.0</h1>"))
app.get("/autok",(req,res)=>res.send(autok))
app.post("/auto",postAutok)
app.put("/auto",modAutok)
app.delete("/auto",delAutok)


app.listen(80,(error)=>{
    if(error)console.log(error);else console.log("Server on 80")
})