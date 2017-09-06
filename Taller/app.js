//importar los modulos a usar
const express= require('express');
const bodyParser= require('body-parser');
const request= require('request');
const config= require('./config');

var app=express();

app.use(bodyParser.json());

app.listen('3000',function(){

console.log('El servidor inicio en el puerto 3000');

});

app.get('/', function(req,res){

	res.send('Bienvenidos al taller del ITGAM');

});

app.get('/webhook',function(req,res){


if(req.query['hub.verify_token']===config.FACEBOOK_TOKEN){

			res.send(req.query['hub.challenge']);					

}else{

			res.send('Acceso no autorizado');
}

});

app.post('/webhook',function(req,res){

	var data= req.body;

	if(data.object=='page'){

		data.entry.forEach(function(dataEntry){

			dataEntry.messaging.forEach(function(messageEvent){

				if(messageEvent.message){

					recivedMessage(messageEvent);
				}

			});

		});
		res.sendStatus(200);
	}

});

function recivedMessage(event){

	var sender= event.sender.id;
	var text=event.message.text;

	evaluateMessage(sender,text);

}

function evaluateMessage(recipientId,message){
	var finalMessage="";

	if (isContain(message,'Hola') ||isContain(message,'hola')  ){

		finalMessage='Hola, en que puedo ayudarte';

	}else if(isContain(message, 'Adios')){
		finalMessage="Que tengas un buen día"
	}else if(isContain(message,'Precio')){

		finalMessage="Los precios que manejo son: $300 $400 y $500"
	}
	else if(isContain(message,'playeras')){

		shirts(recipientId);

	}
	else{

		finalMessage="Lo siento, no entendi lo que quieres decir";
	}

	sendMessage(recipientId,finalMessage);



}

function isContain(sentece,word){

	return sentece.indexOf(word) > -1 

}

function sendMessage(recipientId,message){

	var MessageData={

			recipient:{
				id:recipientId
			},
			message:{
				text:message
			}


	}

	sendCallAPI(MessageData);
}

function sendCallAPI(MessageData){

	request({

		uri:config.URI,
		qs:{access_token:config.APP_TOKEN },
		method:'POST',
		json:MessageData

	},function(error,response,data){

		if(error){
			console.log("Error al enviar el mensaje");

		}else{

			console.log("Envio exitoso");

		}

	});
}


function shirts(recipientId){

	var messageData = {

		recipient:{

			id:recipientId
		},

		message:{

			attachment:{
				type: 'template',
				payload:{
					template_type:"generic",
					elements: [

						{
							title:'Playera Negra (XG-G-M-CH)',
							subtitle: '$350',
							image_url: 'https://http2.mlstatic.com/playeras-yazbek-manga-corta-D_NQ_NP_937676-MLM25661129097_062017-O.jpg',
							buttons: [buttonsPlayeras()]

						},{

							title:'Playera Blanca (XG-G-M-CH)',
							subtitle: '$350',
							image_url: 'https://http2.mlstatic.com/playeras-para-sublimar-D_NQ_NP_524315-MLM25220809019_122016-F.jpg',
							buttons: [buttonsPlayerasBlancas()]
						}]
				}
			}

		}

	};

	sendCallAPI(messageData);
}


function buttonsPlayeras(){

	return{

		type: "web_url",
		url:'https://articulo.mercadolibre.com.mx/MLM-581459559-playeras-yazbek-todos-los-colores-unisex-manga-corta-_JM?attribute=11000-11000-Negro',
		title: 'Comprar'
	}
}

function buttonsPlayerasBlancas(){

	return{

		type: "web_url",
		url:'https://articulo.mercadolibre.com.mx/MLM-553202754-playeras-para-sublimar-_JM',
		title: 'Comprar'
	}
}


