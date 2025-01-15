exports.userSchema = 
{
    id: {
        type: Number,
    },
	firstName: {
        type: String, 
    },
	lastName: {
        type: String, 
    },
	email: {
        type: String, 
        required: true,
        unique: true
    },
	role: {
        type: String, 
        required: true
    },
};