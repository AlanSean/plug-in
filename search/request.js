const async = require('async');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const puppeteer = require('puppeteer');
const fs = require('fs');
var html = require('./index.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    let num = 0;
    let arr = [];
    app.get('/search', async ( req,res) => {
        let param = req.query.text;
        var li = '';
        var page = '';
        var text  = await html(browser,param);
        text.list.forEach(item => {
            li += `<li><a href="${item.href}">${item.title}</a><div>${item.abstract}</div></li>`;

        });
        text.page.forEach( item => {
            page += `<a href="${item.href}">${item.text}</a>`
        })
        res.write(`<head><meta charset='utf-8'><head><body><ul>${li}<ul><div class="page">${page}</div></body>`);
        res.end();
    })
    app.listen(8080, () => {
      console.log('\033[42;37m DONE \033[40;33m localhost:8080 服务已启动\033[0m')
    })
})();
