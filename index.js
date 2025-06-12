const express = require('express');
const tasks = require('./tasks.json')
const fs = require('fs')

const app = express();

const PORT = process.env.PORT || 8000;
// app.use(express.json()); // to parse application/json

//middle ware
app.use(express.urlencoded({ extended: false }))

app.use((req, res,next)=>{
    console.log("hello from middleware 1");
    next()
})



app.get('/', (req, res)=>{
    const html = '<h1> Welcome To The Task Managemet App </h1>';
    res.send(html)
}

// Api endpoint to get tasks in HTML format
app.get("/tasks", (req, res)=>{
    const html = `
    <ul>
        ${tasks.map((tasks) =>
            `<li>${tasks.id}</li>
        <li>${tasks.title}</li>
        <li>${tasks.description}</li>`
        ).join('')}
    </ul>
    `
    res.send(html)
})

// API endpoint to get tasks in JSON format
app.get("/api/tasks", (req, res)=>{
    res.json(tasks);
})

// API endpoint to get a specific task by ID in JSON format
app.route("/api/tasks/:id").get((req, res)=>{
    const id = Number(req.params.id);
    const task =  tasks.find(task => task.id === id);
    return res.json(task)
}).patch((req, res)=>{
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id)
    const {title, description} = req.body;
    task.title = title; 
    task.description = description;
    fs.writeFileSync('tasks.json', JSON.stringify(tasks), (err, data)=>{
        if(err) console.log(err);
        // else console.log(data);
    })
    return res.json({status : "Update successfully"})
    // have to edit task with id
}).delete((req, res)=>{
    // have to delete task with id
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id === id)
    if(index != -1){
        tasks.splice(index, 1); 
        fs.writeFileSync('tasks.json', JSON.stringify(tasks), (err, data)=>
            {
                if(err) console.log(err);
            })
        }
        return res.json({status : "Delete successfully"})
})

// API endpoint to get a specific task by ID in HTML format
app.route("/tasks/:id").get((req, res)=>{
    const id = Number(req.params.id);
    const task =  tasks.find(task => task.id === id);
    // console.log(tasks[1])
    const html = `
    <h1>${task.id}</h1>
    <h3>${task.title}</h3>
    <p>${task.description}</p>`;
    res.send(html)
}).patch((req, res)=>{
    // have to edit task with id
    const body = req.body
    const id = Number(req.params.id);
    const task =  tasks.find(task => task.id === id);
    task.title = body.title
    task.description = body.description
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err, data)=>{
        if(err) console.log(err);
    })
    const html = `<h1>Update Sucessfully</h1>`
    res.send(html)
}).delete((req, res)=>{
    // have to delete task with id
    // const body = req.body
    const id = Number(req.params.id);
    const index  = tasks.findIndex(t => id === t.id) 
    if(index != -1){
        tasks.splice(index, 1)
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err, data)=>{
        if (err) console.log(err)
})
    const html = `<h1>Delete Sucessfully</h1>`
    res.send(html) 
    }
})

app.post("/api/tasks", (req, res)=>{
    const body = req.body;
    tasks.push ({
        id: tasks.length + 1,
        ...body
    })
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err, data)=>{
        console.log("error", err )
    })
    return res.json({status : "Success", id: tasks.length})  
    })

app.post("/tasks", (req, res)=>{
    const body = req.body;
    tasks.push ({
        id: tasks.length + 1,
        ...body
    })
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err, data)=>{
        console.log("error", err )
    })
    const html = `<h1>TasK Added Sucessfully</h1>`
    res.send(html)
    })

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
