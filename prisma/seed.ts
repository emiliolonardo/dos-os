import { PrismaClient, UserMode, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dos.com' },
    update: {},
    create: {
      id: 'demo-admin',
      email: 'admin@dos.com',
      name: 'Admin User',
      password: 'demo123',
      displayName: 'Admin',
      mode: UserMode.DESIGN,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@dos.com' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'user@dos.com',
      name: 'Demo User',
      password: 'demo123',
      displayName: 'Demo',
      mode: UserMode.INNOVATION,
    },
  });

  console.log('Created demo users:', { adminUser, demoUser });

  // Create demo organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      description: 'A demo organization for D.O.S. Collaboration OS',
      plan: SubscriptionPlan.PRO,
    },
  });

  console.log('Created organization:', organization);

  // Add users to organization
  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: adminUser.id,
      role: 'ADMIN',
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: demoUser.id,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: demoUser.id,
      role: 'MEMBER',
    },
  });

  console.log('Added users to organization');

  // Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: 'default',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Default Workspace',
      slug: 'default',
      description: 'The default workspace for the demo organization',
      isDefault: true,
    },
  });

  console.log('Created workspace:', workspace);

  // Add users to workspace
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: adminUser.id,
      role: 'ADMIN',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: demoUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: demoUser.id,
      role: 'MEMBER',
    },
  });

  console.log('Added users to workspace');

  // Create default channels
  const generalChannel = await prisma.channel.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'general',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: 'general',
      slug: 'general',
      description: 'General discussion',
      type: 'PUBLIC',
    },
  });

  const randomChannel = await prisma.channel.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'random',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: 'random',
      slug: 'random',
      description: 'Random chatter',
      type: 'PUBLIC',
    },
  });

  console.log('Created channels:', { generalChannel, randomChannel });

  // Add users to channels
  for (const userId of [adminUser.id, demoUser.id]) {
    for (const channelId of [generalChannel.id, randomChannel.id]) {
      await prisma.channelMember.upsert({
        where: {
          channelId_userId: {
            channelId,
            userId,
          },
        },
        update: {},
        create: {
          channelId,
          userId,
        },
      });
    }
  }

  console.log('Added users to channels');

  // Create a demo project with ABCoDE phases
  const project = await prisma.project.upsert({
    where: { id: 'demo-project-1' },
    update: {},
    create: {
      id: 'demo-project-1',
      workspaceId: workspace.id,
      name: 'Demo Project',
      slug: 'demo-project',
      description: 'A demonstration project showcasing ABCoDE methodology',
      status: 'ACTIVE',
      currentPhase: 'ACQUAINTANCE',
    },
  });

  console.log('Created project:', project);

  // Create ABCoDE phases for the project
  const phases = [
    { phase: 'ACQUAINTANCE', name: 'Acquaintance', status: 'active' },
    { phase: 'BUILD_UP', name: 'Build Up', status: 'pending' },
    { phase: 'CONTINUATION', name: 'Continuation', status: 'pending' },
    { phase: 'DETERIORATION', name: 'Deterioration', status: 'pending' },
    { phase: 'ENDING', name: 'Ending', status: 'pending' },
  ];

  for (const phaseData of phases) {
    await prisma.projectPhase.upsert({
      where: {
        projectId_phase: {
          projectId: project.id,
          phase: phaseData.phase as any,
        },
      },
      update: {},
      create: {
        projectId: project.id,
        phase: phaseData.phase as any,
        name: phaseData.name,
        description: `${phaseData.name} phase of the project`,
        status: phaseData.status,
      },
    });
  }

  console.log('Created ABCoDE phases');

  // Create some demo tasks
  const tasks = [
    { title: 'Define project scope', status: 'done', priority: 'high' },
    { title: 'Gather requirements', status: 'done', priority: 'high' },
    { title: 'Create wireframes', status: 'in_progress', priority: 'medium' },
    { title: 'Design UI components', status: 'todo', priority: 'medium' },
    { title: 'Implement backend API', status: 'todo', priority: 'high' },
    { title: 'Write documentation', status: 'todo', priority: 'low' },
  ];

  for (let i = 0; i < tasks.length; i++) {
    const taskData = tasks[i];
    await prisma.task.upsert({
      where: { id: `demo-task-${i + 1}` },
      update: {},
      create: {
        id: `demo-task-${i + 1}`,
        projectId: project.id,
        title: taskData.title,
        status: taskData.status as any,
        priority: taskData.priority as any,
        order: i + 1,
        assigneeId: i % 2 === 0 ? adminUser.id : demoUser.id,
      },
    });
  }

  console.log('Created demo tasks');

  // Create some demo concepts
  await prisma.concept.upsert({
    where: { id: 'demo-concept-1' },
    update: {},
    create: {
      id: 'demo-concept-1',
      userId: adminUser.id,
      workspaceId: workspace.id,
      title: 'AI-Powered Task Prioritization',
      description: 'An intelligent system that automatically prioritizes tasks based on deadlines, dependencies, and team capacity.',
      category: 'feature',
      status: 'draft',
      content: '## Overview\n\nThis concept explores using machine learning to automatically prioritize tasks...\n\n## Key Features\n\n- Deadline analysis\n- Dependency tracking\n- Team capacity optimization',
    },
  });

  console.log('Created demo concepts');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
