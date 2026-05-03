import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  if (users.length > 0) {
    try {
      const entry = await prisma.emotionEntry.create({
        data: {
          userId: users[0].id,
          dominantEmotion: 'happy',
          happyScore: 1, sadScore: 0, angryScore: 0, fearfulScore: 0, disgustedScore: 0, surprisedScore: 0, neutralScore: 0
        }
      });
      console.log('Created:', entry);
    } catch(e) {
      console.error('Error:', e);
    }
  }
}
main().finally(() => prisma.$disconnect());
