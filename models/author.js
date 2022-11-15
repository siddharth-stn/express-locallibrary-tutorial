const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

//Virtual for author's full Name
AuthorSchema.virtual("name").get(function () {
  /*here we cannot use the arrow function as 
    we want the created object instance bind to "this" keyword.*/

  /*To avoid errors in case where an author 
    does not have either a family name or first name 
    we want to make sure we handle the exception 
    by returning an empty string for that case.*/
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = `${this.first_name} ${this.family_name}`;
  }
  return fullName;
});

//Virtual for author's url
AuthorSchema.virtual("url").get(function () {
  /*here we cannot use the arrow function as 
    we want the created object instance bind to "this" keyword.*/
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
    DateTime.DATE_MED
  );
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toLocaleString(
    DateTime.DATE_MED
  );
});
//Export model
module.exports = mongoose.model("Author", AuthorSchema);
