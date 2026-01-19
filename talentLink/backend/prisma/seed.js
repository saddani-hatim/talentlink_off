import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create a Candidate User
  const user = await prisma.user.upsert({
    where: { email: 'candidate@example.com' },
    update: {},
    create: {
      email: 'candidate@example.com',
      password: hashedPassword,
      role: 'CANDIDATE',
    },
  });

  // 2. Create Candidate Profile
  const profile = await prisma.candidateProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      firstName: 'Jean',
      lastName: 'Dupont',
      title: 'Développeur Fullstack React/Node.js',
      bio: 'Passionné par le développement web et les nouvelles technologies.',
      location: 'Paris, France',
      technicalScore: 85,
      matchRate: 92,
    },
  });

  console.log('Profile created:', profile.id);

  // 3. Add Experiences
  await prisma.experience.createMany({
    data: [
      {
        candidateId: profile.id,
        company: 'Tech Solutions',
        position: 'Développeur Frontend',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2023-12-31'),
        description: 'Développement de dashboards avec React et Tailwind CSS.',
      },
      {
        candidateId: profile.id,
        company: 'Innovate AI',
        position: 'Stagiaire Backend',
        startDate: new Date('2021-06-01'),
        endDate: new Date('2021-12-31'),
        description: 'Maintenance d\'APIs Node.js et intégration de modèles IA.',
      },
    ],
  });

  // 4. Add Projects
  await prisma.project.createMany({
    data: [
      {
        candidateId: profile.id,
        title: 'Portfolio Interactif',
        description: 'Un portfolio moderne utilisant Framer Motion et Lucide Icons.',
        technologies: 'React, Tailwind, Framer Motion',
        projectUrl: 'https://portfolio-jean.example.com',
      },
      {
        candidateId: profile.id,
        title: 'Application E-commerce',
        description: 'Une plateforme complète avec panier et gestion de stock.',
        technologies: 'Node.js, Express, MongoDB',
        repoUrl: 'https://github.com/jeandupont/shop-app',
      },
    ],
  });

  // 5. Add Roadmap
  const roadmap = await prisma.roadmap.create({
    data: {
      candidateId: profile.id,
      title: 'Devenir Senior Fullstack Architect',
      description: 'Un parcours stratégique pour maîtriser les architectures complexes.',
      steps: {
        create: [
          {
            title: 'Maîtrise de Prisma et SQL',
            description: 'Approfondir la gestion de base de données performante.',
            order: 1,
            isCompleted: true,
          },
          {
            title: 'Architecture Microservices',
            description: 'Apprendre Docker et la communication entre services.',
            order: 2,
            isCompleted: false,
          },
          {
            title: 'Optimisation Frontend',
            description: 'Performance Next.js et Web Vitals.',
            order: 3,
            isCompleted: false,
          },
        ],
      },
    },
  });

  // 6. Add Skills
  const skills = await Promise.all([
    prisma.skill.upsert({ where: { name: 'React' }, update: {}, create: { name: 'React', category: 'Frontend' } }),
    prisma.skill.upsert({ where: { name: 'Node.js' }, update: {}, create: { name: 'Node.js', category: 'Backend' } }),
    prisma.skill.upsert({ where: { name: 'TypeScript' }, update: {}, create: { name: 'TypeScript', category: 'Language' } }),
  ]);

  for (const skill of skills) {
    await prisma.candidateSkill.create({
      data: {
        candidateId: profile.id,
        skillId: skill.id,
        level: 80,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
