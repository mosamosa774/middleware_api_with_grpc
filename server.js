let PROTO_PATH = __dirname + '/middleware.proto';
let grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
let middleware = protoDescriptor.middleware;

let article_list = [];

function PutArticle(call,callback) {
    let article = call.request;
    let response_message;
    let msg = "";
    let article_is_exist = 0;
    for(let i in article_list){
        if(article.name === article_list[i].name){
            article_is_exist = 1;
            break;
        }
    };
    if(article_is_exist == 1){
        msg = "Name Tag ("+article.name+") is already exist";
    }
    else{
        article_list.push(article);
        msg = "Name Tag ("+article.name+") is recorded";
    }
    response_message = {
        msg: msg
    };
    callback(null, response_message);
}
/*function GetExistedArticle(call,callback) {

}*/
function GetArticle(call,callback) {
    let article = call.request;
    let name = article.name;
    let value = "";
    
    for(let i in article_list){
        if(name === article_list[i].name){
            value = article_list[i].value;
        }
    }
    let response_article = {
        name: name,
        value: value
    };
    callback(null, response_article);
}
function getServer() {
    var server = new grpc.Server();
    server.addProtoService(middleware.Middleware.service, {
        PutArticle: PutArticle,
        GetArticle: GetArticle
    });
    return server;
  }

var routeServer = getServer();
routeServer.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
routeServer.start();