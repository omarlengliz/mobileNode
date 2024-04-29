const mongoose =require( "mongoose")

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    } , 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },
    status : {
        type: String,
        default: "not active",
        enum: ["active", "not active"],
    } , 
    verificationCode: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("User", UserSchema);