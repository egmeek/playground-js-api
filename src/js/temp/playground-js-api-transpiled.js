"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require("promise");
var envConfig = require('../../../config');

var qlik_playground = function () {
  var PSubscription = function () {
    function PSubscription() {
      _classCallCheck(this, PSubscription);

      this.callbackList = [];
    }

    _createClass(PSubscription, [{
      key: "subscribe",
      value: function subscribe(fn) {
        this.callbackList.push(fn);
      }
    }, {
      key: "deliver",
      value: function deliver(args) {
        this.callbackList.forEach(function (item, index) {
          item(args);
        });
      }
    }]);

    return PSubscription;
  }();

  function qlik_playground() {
    this.notification = new PSubscription();
  }

  qlik_playground.prototype = Object.create(Object.prototype, {
    notification: {
      writable: true,
      value: null
    },
    authenticate: {
      value: function value(apiKey) {
        return new Promise(function (resolve, reject) {
          get(envConfig.host + "/api/ticket?apikey=" + apiKey).then(function (ticketResponse) {
            var ticket = JSON.parse(ticketResponse);
            if (ticket.err) {
              reject(ticket.err);
            } else {
              resolve(ticket.ticket);
            }
          });
        });
      }
    }
  });

  function get(url, callbackFn) {
    return new Promise(function (resolve, reject) {
      var getReq = new XMLHttpRequest();
      getReq.onreadystatechange = function () {
        if (getReq.readyState == 4 && getReq.status == 200) {
          // callbackFn(null, getReq.responseText);
          resolve(getReq.responseText);
        } else if (getReq.readyState == 4 && getReq.status != 200) {
          // callbackFn(getReq.responseText);
          reject(getReq.responseText);
        }
      };
      getReq.open("GET", url, true);
      getReq.send();
    });
  }

  function post() {}

  return qlik_playground;
}();

window.Playground = new qlik_playground();