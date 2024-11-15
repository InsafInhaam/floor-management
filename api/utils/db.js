const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://insafinhaamtest:uaPL7D38rqZzvWnt@cluster0.qm20z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
};

module.exports = connectDB;
