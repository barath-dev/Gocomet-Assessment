import 'dotenv/config'



import { PrismaClient } from '@prisma/client/index'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
})

async function main() {
  console.log('🚀 Starting massive seed...')

  await prisma.$executeRawUnsafe(`
    INSERT INTO users (username)
    SELECT 'user' || generate_series(1, 1000000)
    ON CONFLICT DO NOTHING;
  `)

  await prisma.$executeRawUnsafe(`
    INSERT INTO game_sessions (user_id, score, game_mode, timestamp)
    SELECT 
      floor(random() * 1000000 + 1)::int,
      floor(random() * 1000 + 1)::int,
      CASE WHEN random() > 0.5 THEN 'solo' ELSE 'team' END,
      NOW() - (random() * 365 || ' days')::interval
    FROM generate_series(1, 5000000);
  `)

  await prisma.$executeRawUnsafe(`
    INSERT INTO leaderboard (user_id, total_score, rank)
    SELECT 
      user_id, 
      SUM(score) as total_score,
      RANK() OVER (ORDER BY SUM(score) DESC)
    FROM game_sessions
    GROUP BY user_id
    ON CONFLICT (user_id) DO NOTHING;
  `)

  console.log('✅ Leaderboard populated')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
