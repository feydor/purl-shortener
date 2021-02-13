var mongoose = require("mongoose");
const { Schema } = mongoose;

// Counter will register number of hits to a url
// the count will be used as the hash
const counterSchema = new Schema({
  _id: { type: String, required: true },
  count: { type: Number, default: 0 },
});

var Counter = mongoose.model("Counter", counterSchema);

// Url will contain the original url
const urlSchema = new Schema({
  _id: { type: Number },
  url: { type: String, default: "" },
  created_at: { type: String, default: "" },
});

// set up pre-hook to increment counter on Url save
urlSchema.pre("save", function (next) {
  console.log("running pre-save");
  var doc = this;
  Counter.findByIdAndUpdate(
    { _id: "url_count" },
    { $inc: { count: 1 } },
    function (err, counter) {
      if (err) return next(err);
      console.log(counter);
      console.log(counter.count);
      doc._id = counter.count;
      doc.created_at = new Date();
      console.log(doc);
      next();
    }
  );
});

var URL = mongoose.model("Url", urlSchema);

// export mongoose models
exports.URL = URL;
exports.Counter = Counter;
