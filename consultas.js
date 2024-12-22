const fs = require("fs");
const pg = require("pg");
const db = require("./db");
const format = require("pg-format");

const prepararHATEOAS = (joyas) => {
  const results = joyas.map((j) => {
  return {
  name: j.nombre,
  href: `/inventario/joya/${j.id}`,
  }
  }).slice(0, 4)
  const total = joyas.length
  const HATEOAS = {
  total,
  results
  }
  return HATEOAS
  }
  

const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
  const [campo, direccion] = order_by.split("_");
  const offset = (page - 1) * limits;
  let consulta = format(
    "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limits,
    offset
  );
  const { rows: joyas } = await db.query(consulta);
  return joyas;
};



const obtenerJoyasPorFiltros = async ({ precio_max, stock_min, categoria, metal, page, limits}) => {
    let filtros = []
    const values = []
    if (page === undefined) {page = 1}
    if (limits=== undefined) {limits = 15}
    
    const offset = (page - 1) * limits;
    
    
    const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor)
    const { length } = filtros
    filtros.push(`${campo} ${comparador} $${length + 1}`)
    }
    if (precio_max) agregarFiltro('precio', '<=', 'precio_max');
    if (stock_min) agregarFiltro('stock', '>=', 'stock_min');
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);
    let consulta = "SELECT * FROM inventario"
    if (filtros.length > 0) {
    filtros = filtros.join(" AND ")
    consulta += ` WHERE ${filtros} LIMIT ${limits} OFFSET ${offset}`
    }
    const { rows: joyas } = await db.query(consulta, values)
    return joyas
    }
    



// Funciones Exportadas

module.exports = {prepararHATEOAS, obtenerJoyas, obtenerJoyasPorFiltros };
