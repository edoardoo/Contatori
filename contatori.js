var Contatori, Gestori, Letture;

Contatori = new Meteor.Collection('contatori');

Letture = new Meteor.Collection('letture');

Gestori = new Meteor.Collection('gestori');

if (Meteor.isClient) {
  Accounts.config({
    forbidClientAccountCreation: true
  });
  Router.map(function() {
    this.route("main", {
      path: "/",
      template: "main",
      layoutTemplate: "mainLayout"
    });
    this.route("values", {
      path: "/values",
      template: "values",
      layoutTemplate: "mainLayout"
    });
  });
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });
  window.Contatori = Contatori;
  window.Letture = Letture;
  Template.values.gestori = function() {
    return Gestori.find();
  };
  Template.inserimento.contatori = function() {
    return Contatori.find();
  };
  Template.visualizzazione.letture = function() {
    var c, cont, contatori, date, el, lett, letture_res, n, tabellaLetture, tmpLetture, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
    cont = Contatori.find().fetch();
    contatori = [];
    for (_i = 0, _len = cont.length; _i < _len; _i++) {
      c = cont[_i];
      contatori.push(c.name);
    }
    letture_res = Letture.find().fetch();
    tabellaLetture = [];
    for (_j = 0, _len1 = letture_res.length; _j < _len1; _j++) {
      lett = letture_res[_j];
      tmpLetture = {};
      tmpLetture['id'] = lett._id;
      date = new Date(lett.data);
      tmpLetture['datePerformed'] = date.getDay() + ' ' + date.toLocaleString('it', {
        month: "long"
      }) + ' ' + date.getFullYear();
      date.setMonth(date.getMonth() - 1);
      tmpLetture['date'] = date.toLocaleString('it', {
        month: "long"
      }) + ' ' + date.getFullYear();
      tmpLetture['array'] = [];
      for (_k = 0, _len2 = contatori.length; _k < _len2; _k++) {
        c = contatori[_k];
        tmpLetture['array'].push({
          tipo: c,
          valore: '--'
        });
      }
      _ref = lett.valori;
      for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
        n = _ref[_l];
        _ref1 = tmpLetture['array'];
        for (_m = 0, _len4 = _ref1.length; _m < _len4; _m++) {
          el = _ref1[_m];
          if (el.tipo === n.name) {
            el.valore = n.value;
          }
        }
      }
      tabellaLetture.push(tmpLetture);
    }
    return tabellaLetture;
  };
  Template.inserimento.events({
    'click #insert': function() {
      var elem, lettura, lettureInput, _i, _len;
      lettureInput = $("input.lettura");
      lettura = {
        data: Date.now(),
        valori: []
      };
      for (_i = 0, _len = lettureInput.length; _i < _len; _i++) {
        elem = lettureInput[_i];
        lettura.valori.push({
          name: elem.name,
          value: elem.value
        });
        elem.value = "";
      }
      return Letture.insert(lettura);
    }
  });
  Template.visualizzazione.events({
    'click .del': function() {
      return Letture.remove(this.id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    var contatori, gestori, i, _i, _j, _len, _len1, _results;
    if (Contatori.find().count() === 0) {
      contatori = [
        {
          name: 'Enel'
        }, {
          name: 'Enel2'
        }, {
          name: 'Enel3'
        }, {
          name: 'Gas'
        }, {
          name: 'Acqua'
        }
      ];
      for (_i = 0, _len = contatori.length; _i < _len; _i++) {
        i = contatori[_i];
        Contatori.insert(i);
      }
    }
    if (Gestori.find().count() === 0) {
      gestori = [
        {
          "name": "Enel",
          "valori": [
            {
              "name": "bolletta",
              "niceName": "Bolletta Precedente"
            }, {
              "name": "quotaFissa",
              "niceName": "Quota Fissa (2 mesi)"
            }, {
              "name": "scatti",
              "niceName": "Scatti Consumati"
            }, {
              "name": "costoKw",
              "niceName": "Costo Medio Kw/h"
            }
          ]
        }, {
          "name": "Acqua",
          "valori": [
            {
              "name": "costoMc",
              "niceName": "Costo al metro cubo"
            }
          ]
        }, {
          "name": "Gas",
          "valori": [
            {
              "name": "bolletta",
              "niceName": "Bolletta Precedente"
            }, {
              "name": "quotaFissa",
              "niceName": "Quota Fissa (1 mese)"
            }, {
              "name": "scatti",
              "niceName": "Scatti Consumati"
            }, {
              "name": "costoMedio",
              "niceName": "Costo Medio al metro cubo"
            }
          ]
        }, {
          "name": "Telefono",
          "valori": [
            {
              "name": "bolletta",
              "niceName": "Bolletta Precedente"
            }
          ]
        }
      ];
      _results = [];
      for (_j = 0, _len1 = gestori.length; _j < _len1; _j++) {
        i = gestori[_j];
        _results.push(Gestori.insert(i));
      }
      return _results;
    }
  });
}
