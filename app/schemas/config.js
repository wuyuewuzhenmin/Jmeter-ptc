var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId


var ConfigSchema = new Schema({
	host: String,
	port: Number,
	users: Number,
	rampup: Number,
	iteration:Number,
	duration: Number,
	commandParam:String,
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date,
			default: Date.now()
		},
	}
})


// execute function before saving data to database
ConfigSchema.pre('save',function(next){
	var user = this;
	if (this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})

//Method of model(table)
ConfigSchema.statics={
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}
module.exports = ConfigSchema

