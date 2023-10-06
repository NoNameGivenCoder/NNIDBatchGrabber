var net = require('net')
const { serialize, Serializer } = require('v8')

var server = net.createServer()

server.on('connection', (socket) => {
    console.log('connection')
})

server.listen(9000, () => {
    console.log('Listening!')
})