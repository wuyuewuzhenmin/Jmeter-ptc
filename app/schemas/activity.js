var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId


var ActivitySchema = new Schema({
	user: {type: ObjectId, ref:'User'},
	action: String,
	target: {type: ObjectId, ref:'Test'},
	config: {type: ObjectId, ref:'Config'},
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		}
	}
})


// execute function before saving data to database
ActivitySchema.pre('save',function(next){
	if (this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	next()
})

//Method of model(table)
ActivitySchema.statics={
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}
module.exports = ActivitySchema

