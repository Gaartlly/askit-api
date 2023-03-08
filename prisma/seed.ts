import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    /**
     * Users
     */
    await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            email: 'alice@prisma.io',
            name: 'Alice',
            password: '12345',
            course: 'Ciência da Computação',
            posts: {
                create: {
                    title: 'Prova 1 - 02/2022',
                    description: 'Prova de Discreta',
                    tags: {
                        createMany: ({
                            data:[
                                { category:"Disciplina", key:"Matemática Discreta"},
                                { category:"Professor", key:"David Menotti"},
                            ]
                        })
                    },
                },
            },
        },
    })
    await prisma.user.upsert({
        where: { email: 'jose@prisma.io' },
        update: {},
        create: {
            email: 'jose@prisma.io',
            name: 'Jose',
            password: '12345',
            course: 'Ciência da Computação',
            posts: {
                create: {
                    title: 'Prova 2 - 02/2022',
                    description: 'Prova de Discreta',
                    tags: {
                        createMany: ({
                            data:[
                                { category:"Disciplina", key:"Matemática Discreta"},
                                { category:"Professor", key:"David Menotti"},
                            ]
                        })
                    },
                },
            },
        },
    })

    /**
     * Comments
     */
    await prisma.comment.create({
        data : {
            category: "Resposta",
            text: "Não faço ideia...",
            postId: 1
            aut
        }
    })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })