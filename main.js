const express = require('express')
const bodyParser = require('body-parser')

const app = express()

let metrics = {
    perSecond: 0,
    perMinute: 0,
    per5Minutes: 0,
    per15Minutes: 0,
    totalRequests: 0
}

let processingTime = 0

app.use(bodyParser.json())

app.get("/metrics", (req, res) => {
    res.json(metrics)
})

app.get("/metrics/reset", (req, res) => {
    metrics = {
        perSecond: 0,
        perMinute: 0,
        per5Minutes: 0,
        per15Minutes: 0,
        averagePerSecond: 0,
        totalRequests: metrics.totalRequests
    }
    res.json(metrics)
})

app.get("/processingTime/:value", (req, res) => {
    processingTime = parseInt(req.params['value'])
    res.end(`Processing Time set to ${processingTime}`)
})

app.get('/processingTime', (req, res) => {
    res.end(`Processing Time is ${processingTime}`)
})

app.get('/test', (req, res) => {
    const tag = req.query.tag
    metrics.perSecond += 1
    metrics.perMinute += 1
    metrics.per5Minutes += 1
    metrics.per15Minutes += 1
    metrics.totalRequests += 1

    setTimeout(() => {
        res.json({
            random: 'something',
            tag: tag
        })
    }, processingTime)  
})

// setInterval(() => {
//     metrics.perSecond = 0
// }, 1000)

setInterval(() => {
    metrics.averagePerSecond = Math.floor(metrics.perSecond / 60)
    metrics.perSecond = 0
    metrics.perMinute = 0
}, 60 * 1000)

setInterval(() => {
    metrics.per5Minutes = 0
}, 5 * 60 * 1000)

setInterval(() => {
    metrics.per15Minutes = 0
}, 15 * 60 * 1000)

app.listen(process.env.PORT || 8080, () => {
    console.log('App Listening')
})