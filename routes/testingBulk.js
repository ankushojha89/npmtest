// Example of a simple ordered insert/update/upsert/remove ordered collection

var MongoClient = require('mongodb').MongoClient,
test = require('assert');
MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
// Get the collection
var col = db.collection('batch_write_unordered_ops_legacy_0');
// Initialize the unordered Batch
var batch = col.initializeUnorderedBulkOp();

// Add some operations to be executed in order
batch.insert({a:1});
batch.find({a:1}).updateOne({$set: {b:1}});
batch.find({a:2}).upsert().updateOne({$set: {b:2}});
batch.insert({a:3});
batch.find({a:3}).remove({a:3});

// Execute the operations
batch.execute(function(err, result) {
    console.log(result);  
  db.close();
});
});