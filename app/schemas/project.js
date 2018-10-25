var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId


var ProjectSchema = new Schema({
	owner: {type: ObjectId, ref:'User'},
	name:{
		unique: true,
		type: String
	},
	desc:String,
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
ProjectSchema.pre('save',function(next){
	var user = this;
	if (this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next()
})

//Method of model(table)
ProjectSchema.statics={
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}
module.exports = ProjectSchema

