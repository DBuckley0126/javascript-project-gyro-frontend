var http = require('http'),
fs = require('fs')
var port = process.env.PORT || 5000
http.createServer(function(req, res) {
var url = './src/app/dist/' + (req.url == '/' ? 'app.html' : req.url)
// var url = './src/dist/app.html'
fs.readFile(url, function(err, html) {
    if (err) {
        var message404 = "There is no such page! <a href='/'>Back to home page</a>"
        res.writeHead(404, {'Content-Type': 'text/html', 'Content-Length': message404.length})
        res.write(message404)
    } else {
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': html.length})
        res.write(html)
    }
    res.end()
})
}).listen(port)

