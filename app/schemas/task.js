var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var TaskSchema = new Schema({
	testId: {type: ObjectId, ref: 'Test'},
	configId: {type: ObjectId, ref: 'Config'},
	commitId: {type: ObjectId, ref:'User'},
	status: {
		type: Number,
		default:1
	},
	log: String,
	pId: Number,
	logFile: {
		type:Boolean,
		default: false
	},
	retry: {type: Number, default:0},
	meta: {
		startAt: {
			type:Date,
			default: null
			},
		recordAt: {
			type: Date,
			default: Date.now()
		},
		endAt: {
			type: Date,
			default: null
		}
	}
})

//Method of model(tabel)

TaskSchema.statics={
	fetch: function(cb){
		return this.find({}).sort('meta.recordAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}

//task document pre save check

TaskSchema.pre('save',function(next){
	if (this.isNew){
		this.meta.recordAt = this.meta.updateAt = Date.now();
	}
	next()
})

module.exports = TaskSchema
