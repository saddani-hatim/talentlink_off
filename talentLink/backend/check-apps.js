import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function check() {
  try {
    const apps = await prisma.application.findMany({
      take: 5,
      orderBy: { appliedAt: 'desc' },
      include: {
        candidateprofile: true,
        job: true
      }
    });
    console.log("Recent Applications:", JSON.stringify(apps, null, 2));
    
    const candidates = await prisma.candidateprofile.findMany({ take: 5 });
    console.log("Recent Candidates:", JSON.stringify(candidates, null, 2));

    const jobs = await prisma.job.findMany({ take: 5 });
    console.log("Recent Jobs:", JSON.stringify(jobs, null, 2));
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
