const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { fakerDE } = require('@faker-js/faker');


async function dateneingabe(string name, float preis, float zoll, string farbe){
    const prisma = new PrismaClient()

    // run inside `async` function
    await prisma.$connect()
    
}
