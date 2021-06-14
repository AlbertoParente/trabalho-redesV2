/*var csvToJson = require('convert-csv-to-json')
let fileInputName = 'traces.csv'
let fileOutputName = 'traces.json'
csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName)
*/
var dados = require("./traces.json")
const list = Object.values(dados)

var U = 0.001998
var valorAnteriorDi = parseFloat(list[0].receiver_timestamp - list[0].sender_timestamp)
var valorAnteriorVi = 0
var countErro = 0, linhaInicialRajada = true, index = 0
var di, diLinha, vi, viLinha, pi

while(index < list.length) {
    var tipo = list[index].type
    var tempoReceiverCalc = parseFloat(list[index].receiver_timestamp)
    var tempoSenderCalc = parseFloat(list[index].sender_timestamp)

    if(tipo !== "!") {
        di = tempoReceiverCalc - tempoSenderCalc
        diLinha = parseFloat(((1 - U) * valorAnteriorDi + U * di).toFixed(6))
        vi = Math.abs(diLinha - di)
        viLinha = parseFloat(((1 - U) * valorAnteriorVi + U * vi).toFixed(6))

        if(linhaInicialRajada) {
            linhaInicialRajada = false
            pi = (4 * viLinha) + tempoSenderCalc + diLinha
        } else pi += 160

        if(pi < tempoReceiverCalc) countErro++

        valorAnteriorDi = diLinha
        valorAnteriorVi = viLinha
    } else linhaInicialRajada = true
    
    index++
}

var percentError = ((countErro / list.length) * 100)
console.log("Quantidades de pacotes perdidos: " + countErro, "\nTaxa de pacotes perdidos: " + percentError.toFixed(2) + "%")
