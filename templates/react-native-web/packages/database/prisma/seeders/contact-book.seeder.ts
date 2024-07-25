import { PrismaClientSeed } from "prisma/client";
import { Seeder } from "prisma/seed";

export class ContactBookSeeder implements Seeder {
    readonly id = 'contact-book-seeder';

    async seed(prisma: PrismaClientSeed): Promise<void> {
        const patients = await prisma.patient.findMany({
            where: {
                patient_id: {
                    not: null,
                },
                doctor_id: {
                    not: null,
                },
            },
            include: {
                doctor: {
                    include: {
                        person: true,
                    }
                },
            }
        });

        await Promise.all(patients.map(async (patient) => {
            const target = await prisma.contactBookItem.findFirst({
                where: {
                    user_id: patient.doctor?.id!,
                    contact_book: {
                        owner_id: patient.patient_id!,
                    }
                }
            });

            console.log('target', target);

            if (target) {
                return;
            }

            await prisma.contactBookItem.create({
                data: {
                    email: patient.doctor?.person.email!,
                    first_name: patient.doctor?.person.first_name!,
                    last_name: patient.doctor?.person.last_name!,
                    user: {
                        connect: {
                            id: patient.doctor?.id!,
                        }
                    },
                    contact_book: {
                        connectOrCreate: {
                            where: {
                                owner_id_type: {
                                    owner_id: patient.patient_id!,
                                    type: 'consumer_doctor',
                                },
                            },
                            create: {
                                type: 'consumer_doctor',
                                owner: {
                                    connect: {
                                        id: patient.patient_id!,
                                    }
                                }
                            }
                        },
                    },
                }
            })
        }))
    }
} 