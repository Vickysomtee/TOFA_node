const {Schema,  model} = require('mongoose');

const photoSchema =  new Schema({
  albumId:  {
    type: String
  },
  id:  {
    type: String
  },
  title:  {
    type: String
  },
  url:  {
    type: String
  },
  thumbnailUrl:  {
    type: String
  },
})

module.exports = model("Photo", photoSchema)
