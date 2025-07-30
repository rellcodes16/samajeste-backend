const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')

const quotesRouter = require('./routes/quotesRoute');
const eventsRouter = require('./routes/eventsRoute');
const blogsRouter = require('./routes/blogsRoute');
const authorRouter = require('./routes/authorRoute');

const app = express()

app.use(helmet())

app.use(cookieParser())

const corsOptions = {
    origin: ['http://localhost:5173', 'https://samajeste.onrender.com']
}

app.use(cors(corsOptions))

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, 
    message: 'Too many requests from this IP, please try again after an hour',
});


app.use('/api', limiter)

app.use(express.json({limit: '10kb'}))

app.use(mongoSanitize())

app.use(xss())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    console.log(req.requestTime)

    next()
})

app.use((req, res, next) => {
    console.log('Cookies: ', req.cookies)

    next()
})

app.get('/', (req, res) => {
    res.status(200).send('Hello World!!')
})

app.get('/api/v1/test', (req, res) => {
    res.status(200).send('Test route is working');
});


app.use('/api/samajeste/quotes', quotesRouter)
app.use('/api/samajeste/events', eventsRouter)
app.use('/api/samajeste/blogs', blogsRouter)
app.use('/api/samajeste/author', authorRouter)

module.exports = app;