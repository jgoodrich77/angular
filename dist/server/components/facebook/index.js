'use strict';

var
path = require('path'),
Q = require('q'),
FBGraph = require('./lib/graph'),
config = require('../../config/environment');

var
cli = new FBGraph(config.facebookSdk);

module.exports = {
  createProof: function(accessToken) {
    return cli.createAppSecretProof(accessToken, config.facebookSdk.appSecret);
  },
  appInfo: function(accessToken) {
    return cli.get('/app', {
      access_token: accessToken,
      fields: ['id','name','namespace','link'].join(',')
    });
  },
  tokenInfo: function(token, accessToken) {
    return cli.get('/debug_token', {
      input_token: token,
      access_token: accessToken
    });
  },
  userInfo: function(userId, accessToken) {
    return cli.get(userId, {
      access_token: accessToken
    });
  },
  userObjects: function(accessToken) {
    return cli.getRecursive('/me/accounts', {
      access_token: accessToken,
      limit: 10,
      fields: ['id','access_token','category','name'].join(',')
    });
  },
  pageInfo: function(pageId, accessToken) {
    return cli.get(pageId, {
      access_token: accessToken
    });
  },
  pageLikes: function(pageId, accessToken) {
    return cli.get(pageId, {
      access_token: accessToken,
      fields: ['id','name','likes','new_like_count','talking_about_count','were_here_count'].join(',')
    });
  },
  pagePosts: function(pageId, accessToken, maxItems) {
    return cli.get(pageId + '/feed', {
      access_token: accessToken,
      limit: maxItems || 5
    });
  },
  postTotalLikes: function(objectId, accessToken) {
    return cli.get(objectId + '/likes', {
      access_token: accessToken,
      summary: true
    }).then(function (result) {
      if(!result || !result.summary) {
        return 0;
      }
      return result.summary.total_count || 0;
    });
  },
  postTotalComments: function(objectId, accessToken) {
    return cli.get(objectId + '/comments', {
      access_token: accessToken,
      summary: true
    }).then(function (result) {
      if(!result || !result.summary) {
        return 0;
      }
      return result.summary.total_count || 0;
    });
  },
  postTotalShares: function(objectId, accessToken) {
    return cli.get(objectId + '/sharedposts', {
      access_token: accessToken,
      summary: true
    }).then(function (result) {
      if(!result || !result.summary) {
        return 0;
      }
      return result.summary.total_count || 0;
    });
  },
  basicPageInfo: function(pageId, accessToken) {
    return cli.get(pageId, {
      access_token: accessToken,
      fields: ['id','name','likes','new_like_count','link','website','about','description'].join(',')
    });
  },

  postFeed: function(objectId, objectAccessToken, payload) {
    return cli.post(path.join('/',objectId,'feed'), {
      access_token: objectAccessToken
    }, payload);
  },

  publishPhoto: function(objectId, objectAccessToken, photoUrl, message, doNotPublish) {
    var payload = { url: photoUrl };

    if(!!message) {
      payload.message = message;
    }

    if(doNotPublish) {
      payload.no_story  = true;
      payload.published = false;
    }

    return cli.post(path.join('/',objectId,'photos'), {
      access_token: objectAccessToken
    }, payload);
  },

  postMessage: function(objectId, objectAccessToken, message, link, caption, name, description) {
    var payload = {};

    if(!!message) {
      payload.message = message;
    }
    if(!!link) {
      payload.link = link;
    }
    if(!!caption) {
      payload.caption = caption;
    }
    if(!!name) {
      payload.name = name;
    }
    if(!!description) {
      payload.description = description;
    }

    return this.postFeed(objectId, objectAccessToken, payload);
  },

  extendToken: function(token) {
    return cli.extendToken(token);
  }
};