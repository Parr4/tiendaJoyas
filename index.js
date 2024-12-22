const express = require('express')
const fs = require('fs');
const app = express();
const cors = require('cors');
const pg =  require('pg')
const db = require("./db");

app.use(cors());

app.use(express.json());




const { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS } = require("./consultas");
const { format } = require('path');

app.get('/joyas', async (req, res) => {
  try {
  const queryStrings = req.query
  const joyas = await obtenerJoyas(queryStrings)
  const HATEOAS = await prepararHATEOAS(joyas)
  res.json(HATEOAS);
  // res.json(joyas)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get('/joyas/filtros', async (req, res) => {
  try {
  const queryStrings = req.query
  const joyas = await obtenerJoyasPorFiltros(queryStrings)
  const HATEOAS = await prepararHATEOAS(joyas)
  res.json(HATEOAS);
  // res.json(joyas)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get("*", (req, res) => {
  res.status(404).send("Ruta incorrecta!")
  })
  

app.listen(3000, console.log("server on"))
// module.exports = {pool}