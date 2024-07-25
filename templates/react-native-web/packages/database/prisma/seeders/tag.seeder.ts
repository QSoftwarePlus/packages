import { Seeder } from 'prisma/seed'
import { PrismaClientSeed } from '../client'
import { Tag } from '@prisma/client'

export class TagSeeder implements Seeder {
  readonly id: string = 'tag-seeder-v1'

  readonly nativeTags: Array<Pick<Tag, 'value' | 'description'>> = [
    {
      value: 'receta',
      description: 'receta medica',
    },
    {
      value: 'orden médica',
      description: 'orden médica',
    },
    {
      value: 'chromatography',
      description: 'resultado de Cromatografía',
    },
    {
      value: 'informe médico',
      description: 'informe médico',
    },
    {
      value: 'análisis laboratorio',
      description: 'análisis de laboratorio',
    },
    {
      value: 'radiografía',
      description: 'radiografía',
    },
    {
      value: 'ecografía',
      description: 'ecografía',
    },
    {
      value: 'videoconsulta',
      description: 'videoconsulta',
    },
    {
      value: 'lesión',
      description: 'foto de lesión',
    },
    {
      value: 'cardiología',
      description: 'especialidad cardiología',
    },
    {
      value: 'dermatología',
      description: 'especialidad Dermatología',
    },
    {
      value: 'neurología',
      description: 'especialidad Neurología',
    },
    {
      value: 'diabetes',
      description: 'diabetes',
    },
    {
      value: 'hipertensión',
      description: 'hipertensión',
    },
    {
      value: 'asma',
      description: 'asma',
    },
    {
      value: 'quimioterapia',
      description: 'quimioterapia',
    },
    {
      value: 'fisioterapia',
      description: 'fisioterapia',
    },
    {
      value: 'psicoterapia',
      description: 'psicoterapia',
    },
    {
      value: 'corazón',
      description: 'corazón',
    },
    {
      value: 'pulmones',
      description: 'pulmones',
    },
    {
      value: 'sistema nervioso',
      description: 'sistema nervioso',
    },
    {
      value: 'rodilla',
      description: 'rodilla',
    },
    {
      value: 'endoscopia',
      description: 'endoscopia',
    },
    {
      value: 'colonoscopia',
      description: 'colonoscopia',
    },
    // TODO: translate this tags to english. Then, add translations to the database and type the enum TagType. 
    {
      description: 'medical history',
      value: 'medical-history',
    }
  ]
  async seed(prisma: PrismaClientSeed): Promise<void> {
    await Promise.all(this.nativeTags.map(async (tag) => {
      return await prisma.tag.upsert({
        where: {
          label_value: {
            label: tag.value.toUpperCase(),
            value: tag.value,
          },
          type: 'native',
        },
        update: {
          description: tag.description,
          label: tag.value.toUpperCase(),
          value: tag.value,
          type: 'native',
        },
        create: {
          label: tag.value.toUpperCase(),
          value: tag.value,
          description: tag.description,
          type: 'native',
        },
      })
    }))
  }
}
