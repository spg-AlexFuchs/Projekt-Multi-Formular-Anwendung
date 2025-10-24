const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { fakerDE } = require('@faker-js/faker');


async function dateneingabe(string name, float preis, float zoll, string farbe){
    const prisma = new PrismaClient()
    
    const rad ={
        name: name,
        preis: preis,
        zoll: zoll,
        farbe: farbe
        }
    await prisma.Fahrrad.create({data: rad});
        
    console.log("Fahrrad Hinzugefügt");
}

async function Datenloschen(){
    const prisma = new PrismaClient()
    await prisma.Fahrrad.deleteMany()
}


async function Datenanzeige(){
    const prisma = new PrismaClient()

    const Rad = await prisma.Fahrrad.findMany()

    return Rad;
}