const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { fakerDE } = require('@faker-js/faker');

let GEWUENSCHTE_FAHRRÄDER = 15;


async function seed(){
    console.log("seeding Fahrräder");
    for(d=0; d<GEWUENSCHTE_FAHRRÄDER; d++){
        const rad ={
            name: fakerDE.vehicle.bicycle(),
            preis: parseFloat(fakerDE.finance.amount()),
            zoll: fakerDE.number.float({ multipleOf: 0.5, min: 5, max:30 }),
            farbe: fakerDE.vehicle.color()
        }
        await prisma.Fahrrad.create({data: rad});
    }

    console.log("seeding fertig!");
}
seed();