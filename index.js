const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//create a todo
app.post("/todo", async (req, res) => {
  try {
    const { description } = req.body;
    const newToDo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newToDo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//get all todo
app.get("/todo", async (req, res) => {
  try {
    const getToDo = await pool.query("SELECT * FROM todo");
    res.json(getToDo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo
app.get("/todo/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const getById = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [
      id,
    ]);

    res.json(getById.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update a todo
app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateToDo = await pool.query(
      "UPDATE todo SET description=$1 WHERE todo_id=$2",
      [description, id]
    );
    res.json("Record updated!");
  } catch (err) {
    console.error(err.message);
  }
});
//delete a todo

app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const delToDo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [id]);
    res.json("Record deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

//post order item
app.post("/order/add", async (req, res) => {
  console.log(req.body);
  try {
    const {
      phonenumber,
      product_name,
      price,
      img,
      description,
      title,
      quantity,
      total_price,
      customer_id,
    } = req.body;

    const request_body = req.body;
    const created_at = new Date();
    console.log(request_body);

    const response = await pool.query(
      "INSERT INTO order_items(phonenumber,product_name,price,img,description,title,quantity,total_price,order_request,customer_id,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)  RETURNING *",
      [
        phonenumber,
        product_name,
        price,
        img,
        description,
        title,
        quantity,
        total_price,
        request_body,
        customer_id,
        created_at,
      ]
    );
    res.json(response.rows[0]);
    console.log(response.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/getorders/:phonenumber", async (req, res) => {
  try {
    const { phonenumber } = req.params;
    const getorders = await pool.query(
      "SELECT * FROM order_items WHERE phonenumber=$1",
      [phonenumber]
    );
    res.json(getorders.rows);
    console.log(getorders);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
