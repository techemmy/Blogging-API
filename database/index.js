const { default: mongoose } = require("mongoose")

exports.connectToMongoDb = (DB_URI) => {
    mongoose.connect(DB_URI, (error) => {
        if (error) {
            console.log("Couldn't connect to MongoDB: ", error)
        } else {
            console.log("MongoDB connected successfully")
        }
    })
}