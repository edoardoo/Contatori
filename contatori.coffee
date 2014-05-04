Contatori = new Meteor.Collection 'contatori'
Letture = new Meteor.Collection 'letture'
Gestori = new Meteor.Collection 'gestori'

if Meteor.isClient
	#if there are no users, this lets you create one
	Meteor.subscribe "usersList", ->
		
		if Meteor.users.find().count() != 0
			Accounts.config forbidClientAccountCreation: true
		return

	

	Router.map ->
		@route "main",
			path: "/",
			template: "main"
			layoutTemplate: "mainLayout"

		@route "values",
			path: "/values"
			template: "values"
			layoutTemplate: "mainLayout"


		return

	

	Accounts.ui.config passwordSignupFields: 'USERNAME_ONLY'
	

	window.Contatori = Contatori
	window.Letture = Letture
	Template.values.gestori = ->
		Gestori.find()
	Template.inserimento.contatori = ->
		Contatori.find()

	Template.visualizzazione.letture = ->
		cont = Contatori.find().fetch()
		contatori = []
		for c in cont
			contatori.push c.name		

		letture_res = Letture.find().fetch()


		tabellaLetture = []

		for lett in letture_res			
			tmpLetture = {}
			tmpLetture['id'] = lett._id
			date = (new Date lett.data)
			tmpLetture['datePerformed'] = date.getDay()+' '+date.toLocaleString('it',{month:"long"})+' '+date.getFullYear()

			date.setMonth(date.getMonth()-1)
			tmpLetture['date'] = date.toLocaleString('it',{month:"long"})+' '+date.getFullYear()

			tmpLetture['array'] = []
			for c in contatori
				tmpLetture['array'].push tipo:c,valore:'--'
			for n in lett.valori				
				for el in tmpLetture['array']
					if el.tipo == n.name
						el.valore = n.value
			tabellaLetture.push tmpLetture		

		return tabellaLetture

	Template.inserimento.events
		'click #insert': ->
			lettureInput = $("input.lettura")
			lettura =
				data: Date.now()

				valori: []

			for elem in lettureInput
				lettura.valori.push name: elem.name , value: elem.value
				elem.value = ""
			Letture.insert lettura

	Template.visualizzazione.events
		'click .del': ->
			Letture.remove this.id


	


if Meteor.isServer
	
	Meteor.publish "usersList", ->
		Meteor.users.find()

	

	Meteor.startup ->
		if Contatori.find().count() is 0
			contatori = [
				{ name: 'Enel' }
				{ name: 'Enel2' }
				{ name: 'Enel3' }
				{ name: 'Gas'}
				{ name: 'Acqua'}
			]
			Contatori.insert i for i in contatori

		if Gestori.find().count() is 0
			gestori = [
						{
						"name" : "Enel",
						"valori" : [ 
							{
								"name" : "bolletta",
								"niceName" : "Bolletta Precedente"
							}, 
							{
								"name" : "quotaFissa",
								"niceName" : "Quota Fissa (2 mesi)"
							}, 
							{
								"name" : "scatti",
								"niceName" : "Scatti Consumati"
							}, 
							{
								"name" : "costoKw",
								"niceName" : "Costo Medio Kw/h"
							}
						]
						}
						{
						"name" : "Acqua",
						"valori" : [ 
							{
								"name" : "costoMc",
								"niceName" : "Costo al metro cubo"
							}
						]
						}
						{
						"name" : "Gas",
						"valori" : [ 
							{
								"name" : "bolletta",
								"niceName" : "Bolletta Precedente"
							}, 
							{
								"name" : "quotaFissa",
								"niceName" : "Quota Fissa (1 mese)"
							}, 
							{
								"name" : "scatti",
								"niceName" : "Scatti Consumati"
							}, 
							{
								"name" : "costoMedio",
								"niceName" : "Costo Medio al metro cubo"
							}
						]
						}
						{
						"name" : "Telefono",
						"valori" : [ 
							{
								"name" : "bolletta",
								"niceName" : "Bolletta Precedente"
							}
						]
						}			]
			Gestori.insert i for i in gestori
	

	  

		
 
