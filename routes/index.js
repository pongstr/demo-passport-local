// var express = require('express');
// var router = express.Router();
import express from 'express';
const { Router } = express;

const router = new Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

export default router;
