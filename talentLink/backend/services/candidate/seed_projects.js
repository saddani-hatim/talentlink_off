import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { role: 'CANDIDATE' },
    include: { candidate: true }
  });

  if (!user || !user.candidate) {
    console.log('Aucun candidat trouvé pour le seeding');
    return;
  }

  const candidateId = user.candidate.id;

  const projects = [
    {
      title: "Optimisation de Performance React",
      description: "Optimisation d'un dashboard complexe avec React.memo, useMemo et virtualisation.",
      technology: "React",
      technologies: "React, Performance, Optimization",
      difficulty: "Hard",
      status: "IN_PROGRESS",
      imageUrl: "http://localhost:2022/uploads/projects/p1.png",
      candidateId
    },
    {
      title: "API Gateway Microservices",
      description: "Mise en place d'une passerelle API robuste avec Node.js et Express.",
      technology: "Node.js",
      technologies: "Node.js, Express, Microservices",
      difficulty: "Medium",
      status: "COMPLETED",
      imageUrl: "http://localhost:2022/uploads/projects/p2.png",
      candidateId
    },
    {
      title: "Analyse Prédictive avec Python",
      description: "Modèle de machine learning pour prédire les tendances du marché.",
      technology: "Python",
      technologies: "Python, ML, Data Science",
      difficulty: "Expert",
      status: "DRAFT",
      imageUrl: "http://localhost:2022/uploads/projects/p3.png",
      candidateId
    }
  ];

  // Delete old seed projects first to avoid duplication
  await prisma.project.deleteMany({ where: { candidateId } });

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log('Seed des projets terminé !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
