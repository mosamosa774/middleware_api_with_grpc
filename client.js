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

let client = new middleware.Middleware('localhost:50051', grpc.credentials.createInsecure());

let my_article = {name: 'example2', value: '2'};
let name_tag = {name: 'example2'};

function PutArticle(my_article){
  client.PutArticle(my_article, function(err, response_message) {
    if (err) {
      // process error
        console.log("error");
    } else {
      // process feature
        console.log(response_message.msg);
        GetArticle(name_tag);
    }
  });
}

function GetArticle(name_tag){
  client.GetArticle(name_tag, function(err, article) {
      if (err) {
        // process error
          console.log("error");
      } else {
        // process feature
          console.log(article.name+","+article.value);
      }
  });
}
PutArticle(my_article);