const express = require("express");
const router = express.Router();

const dbconfig = require("./dbconfig");
const sql = require("mssql");

const odata = require("odata-v4-sql");

router.get('/', async function (req, res) {
  const orderby = req.query.$orderby || 1;
  const skip = req.query.$skip || 0;
  const top = req.query.$top;
  const count = req.query.$count;
  const filter = odata.createFilter(req.query.$filter).asMsSql();
  const select = filter.select;
  const where = filter.where.replace(/LCASE/gi, 'LOWER');

  let paging = '';
  if (top) {
    paging = ` OFFSET ${skip} ROWS FETCH NEXT ${top} ROWS ONLY`;
  }

  const query = `SELECT ${select} FROM LogoStokHareketleri WHERE ${where} ORDER BY ${orderby}${paging}`;
  console.log(query);

  let pool = await new sql.ConnectionPool(dbconfig).connect();

  let rowCount = 0;

  if (count === 'true') {
    const countRequest = pool.request();
    filter.parameters.forEach((value, name) => countRequest.input(name, value));
    const countResult = await countRequest.query(`SELECT COUNT(1) AS count FROM LogoStokHareketleri WHERE ${where}`);
    rowCount = countResult.recordset[0].count;
  }

  let sqlRequest = pool.request();
  filter.parameters.forEach((value, name) => sqlRequest.input(name, value));
  const result = await sqlRequest.query(query);

  res.json({
    '@odata.context': req.protocol + '://' + req.get('host') + '/$metadata#Stocks',
    '@odata.count': rowCount,
    value: result.recordset
  });

});

module.exports = router;
