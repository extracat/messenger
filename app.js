const os = require("os");
const fs = require("fs");

var hostname = os.hostname();
var portNum = 80;
if(hostname == "snezhi-home.local" || hostname == "MBP-Sabina.Dlink") portNum = 8080



const Koa = require('koa'); // ядро
const Router = require('koa-router'); // маршрутизация
const bodyParser = require('koa-bodyparser'); // парсер для POST запросов
const serve = require('koa-static'); // модуль, который отдает статические файлы типа index.html из заданной директории
const logger = require('koa-logger'); // опциональный модуль для логов сетевых запросов. Полезен при разработке.

const app = new Koa();
const router = new Router();
app.use(serve('public'));
app.use(logger());
app.use(bodyParser());


const passport = require('koa-passport'); //реализация passport для Koa
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

app.use(passport.initialize()); // сначала passport
app.use(router.routes()); // потом маршруты
const server = app.listen(portNum);// запускаем сервер на порту portNum




const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const socketioJwt = require('socketio-jwt'); // аутентификация по JWT для socket.io

const socketIO = require('socket.io');


const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.