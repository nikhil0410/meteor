import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
  // code to run on server at startup
  Resolution = new Mongo.Collection('resolutions');
});

Meteor.publish("resolutions",function(){
	return Resolution.find({
		$or: [
			{ private: {$ne: true}	},
			{ owner: this.userId}
		]
	});
});

Meteor.methods({
	addResolution: function(title) {
		Resolution.insert({
			title: title,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user()
		});
	},
	deleteResolution: function(id) {
		var res= Resolution.findOne(id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-autorised');
		}
		Resolution.remove(id);
	},
	updateResolution: function(id,checked){

			var res= Resolution.findOne(id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-autorised');
		}

		Resolution.update(id, {$set: {checked: checked}});
	},
	setPrivate: function(id,private){
		var res= Resolution.findOne(id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-autorised');
		}

			Resolution.update(id, {$set: {private: private}})
		
	}
});