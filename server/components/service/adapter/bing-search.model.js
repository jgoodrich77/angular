'use strict';

var
mongoose = require('mongoose'),
Schema = mongoose.Schema;

var
ServiceGoogleBingSearchSchema = new Schema({
  keyword: {
    type: String,
    required: true,
    unique: true
  },
  checks: [{
    results: [{
      website: String,
      url: String,
      title: String,
      snippet: String,
      metatags: String
    }],
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

mongoose.model('ServiceBingSearch', ServiceGoogleBingSearchSchema);
