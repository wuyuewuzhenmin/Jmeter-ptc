var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId


var TestSchema = new Schema({
	testName:{uniqe: true,type: String},
	//type:{type: ObjectId, ref:'testType', default:1},
	owner: {type: ObjectId, ref:'User'},	
	project: {type: ObjectId, ref:'Project'},
	configId: {type: ObjectId, ref:'Config'},
	caseName:String,
	caseOriginName: String,
	caseSize: Number,
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date
		}
	}
})

//method of document
TestSchema.methods={}

// execute function before saving data to database
TestSchema.pre('save',function(next){
	var user = this;
	if (this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})

//Method of model(table)
TestSchema.statics={
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}
module.exports = TestSchema

