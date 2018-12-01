// IMPORTS
const mongoose = require('mongoose');

// USER MODEL

const UserSchema = new mongoose.Schema({
	account: {
		username: String,
		email: String,
		biography: String,
		phoneNumber: Number,
		avatar: String,
		interests: Array
	},
	organizer: {
		type: String /* Association, Particulier, Institution... */
	},
	security: {
		token: String,
		hash: String,
		salt: String,
		pepper: String,
		smsCode: String
	},
	challenges: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Challenge'
			},
			status: String
		}
	],
	location: {
		adressLine1: String,
		adressLine2: String,
		city: String,
		zipCode: Number,
		latitude: Number,
		longitude: Number
	},
	badges: Array,

	// STP Farid comment on peut assigner à une categorie un nombre dans la base de donnée, merci.

	// [{
	//     type: mongoose.Schema.Types.ObjectId,
	//     ref: "Category"
	// }],
	rpgCharacter: {
		class: String,
		experience: Number
	}
});

module.exports = mongoose.model('User', UserSchema, 'users');
