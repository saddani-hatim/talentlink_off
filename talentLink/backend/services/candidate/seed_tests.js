import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const tests = [
  {
    title: 'Optimisation React & Performance',
    description: 'Analysez et optimisez une application React lente. Utilisez useMemo, useCallback et identifiez les re-renders inutiles.',
    category: 'Frontend',
    difficulty: 'Difficile',
    duration: 45,
    points: 1500
  },
  {
    title: 'Sécurisation API Node.js',
    description: 'Identifiez et corrigez les vulnérabilités de sécurité (XSS, Injection SQL, Rate Limiting) dans une API Express.',
    category: 'Backend',
    difficulty: 'Moyen',
    duration: 30,
    points: 1000
  },
  {
    title: 'Analyse de Données Python',
    description: 'Nettoyez un dataset corrompu et extrayez des insights clés en utilisant Pandas et NumPy.',
    category: 'AI / ML',
    difficulty: 'Moyen',
    duration: 40,
    points: 1200
  },
  {
    title: 'Architecture Microservices avec Docker',
    description: 'Créez des Dockerfiles optimisés et un fichier docker-compose pour une architecture multi-services.',
    category: 'DevOps',
    difficulty: 'Moyen',
    duration: 35,
    points: 1100
  },
  {
    title: 'Maîtrise CSS Grid & Flexbox',
    description: 'Reproduisez une maquette complexe en utilisant uniquement CSS Grid et Flexbox, sans framework CSS.',
    category: 'Frontend',
    difficulty: 'Facile',
    duration: 20,
    points: 500
  },
  {
    title: 'Optimisation de Requêtes SQL',
    description: 'Réécrivez des requêtes SQL inefficaces et ajoutez les index appropriés pour améliorer les performances.',
    category: 'Backend',
    difficulty: 'Difficile',
    duration: 50,
    points: 1600
  }
];

async function main() {
  console.log('Start seeding tests...');
  
  // Clean existing tests if needed, or just append. 
  // For safety/idempotency, we could delete first but let's just create.
  // Actually, to avoid duplicates on multiple runs, let's delete all first (optional but cleaner for dev)
  try {
      await prisma.technicaltest.deleteMany({});
      console.log('Deleted existing tests.');
  } catch (e) {
      console.log('No tests to delete or error deleting.');
  }

  for (const test of tests) {
    const createdTest = await prisma.technicaltest.create({
      data: test,
    });
    console.log(`Created test with id: ${createdTest.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
