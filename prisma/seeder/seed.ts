import { PrismaClient } from '@prisma/client';
// import { MODULE_NAME, ORGANIZATION_ROLE_TYPE, ROLE_TYPE } from '../../src/utils/constants';
import { Crypt } from '../../src/config/crypt';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  const userRole = await prisma.role.upsert({
    where: {
      title: 'user',
    },
    create: {
      title: 'user',
    },
    update: {
      title: 'user',
    },
  });

  await prisma.role.upsert({
    where: {
      title: 'admin',
    },
    create: {
      title: 'admin',
    },
    update: {
      title: 'admin',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Collectables',
    },
    create: {
      title: 'Collectables',
    },
    update: {
      title: 'Collectables',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Trading Cards',
    },
    create: {
      title: 'Trading Cards',
    },
    update: {
      title: 'Trading Cards',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Sports',
    },
    create: {
      title: 'Sports',
    },
    update: {
      title: 'Sports',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Music',
    },
    create: {
      title: 'Music',
    },
    update: {
      title: 'Music',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Art',
    },
    create: {
      title: 'Art',
    },
    update: {
      title: 'Art',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Photography',
    },
    create: {
      title: 'Photography',
    },
    update: {
      title: 'Photography',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Utility',
    },
    create: {
      title: 'Utility',
    },
    update: {
      title: 'Utility',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Virtual Worlds',
    },
    create: {
      title: 'Virtual Worlds',
    },
    update: {
      title: 'Virtual Worlds',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Games',
    },
    create: {
      title: 'Games',
    },
    update: {
      title: 'Games',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Memes',
    },
    create: {
      title: 'Memes',
    },
    update: {
      title: 'Memes',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Punks',
    },
    create: {
      title: 'Punks',
    },
    update: {
      title: 'Punks',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Games',
    },
    create: {
      title: 'Games',
    },
    update: {
      title: 'Games',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Metaverses',
    },
    create: {
      title: 'Metaverses',
    },
    update: {
      title: 'Metaverses',
    },
  });

  await prisma.interests.upsert({
    where: {
      title: 'Domains',
    },
    create: {
      title: 'Domains',
    },
    update: {
      title: 'Domains',
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: 'admin@superrare.com',
    },
    create: {
      email: 'admin@superrare.com',
      password: await Crypt.hashString('Superrare123'),
      userName: 'super-rare',
      isVerified: true,
      roleId: userRole.id,
    },
    update: {
      email: 'admin@superrare.com',
      password: await Crypt.hashString('Superrare123'),
      userName: 'super-rare',
      isVerified: true,
      roleId: userRole.id,
    },
  });

  const superRareProfileCheck = await prisma.profile.findFirst({
    where: {
      user: {
        email: 'admin@superrare.com',
        deleted: false,
      },
      deleted: false,
    },
  });

  const superRareWalletCheck = await prisma.wallet.findFirst({
    where: {
      user: {
        email: 'admin@superrare.com',
        deleted: false,
      },
      deleted: false,
    },
  });

  if (!superRareWalletCheck) {
    await prisma.wallet.create({
      data: {
        userId: user.id,
        address: '0xba5BDe662c17e2aDFF1075610382B9B691296350',
      },
    });
  }

  if (!superRareProfileCheck) {
    await prisma.profile.create({
      data: {
        userId: user.id,
        banner: 'https://techcrunch.com/wp-content/uploads/2021/03/1_pxZDGl7qvLTwFPe75TRZXA.jpeg',
        profilePicture: 'https://research.binance.com/static/images/projects/superrare/logo.png',
        address: 'Newark, Delaware, United States',
        bio: `SuperRare is an online marketplace and community for digital art, specifically for rare and unique digital artworks created using blockchain technology. These digital artworks are often referred to as "non-fungible tokens" (NFTs) and are stored on a blockchain, which allows for the creation of one-of-a-kind, unique digital items that cannot be replicated or counterfeited.`,
        gender: 'MALE',
        dateOfBirth: new Date('2018-04-18T04:11:54Z'),
        name: 'SuperRare',
        interests: ['Art', 'Music', 'Photography'],
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
