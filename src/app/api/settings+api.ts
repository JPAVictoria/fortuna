import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let data = await prisma.appSettings.findFirst();

    if (!data) {
      data = await prisma.appSettings.create({
        data: { userName: 'You' },
      });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userName, monthlyBudget } = body;

    let settings = await prisma.appSettings.findFirst();

    const data = settings
      ? await prisma.appSettings.update({
          where: { id: settings.id },
          data: {
            ...(userName !== undefined && { userName }),
            ...(monthlyBudget !== undefined && { monthlyBudget }),
          },
        })
      : await prisma.appSettings.create({
          data: {
            userName: userName ?? 'You',
            monthlyBudget: monthlyBudget ?? null,
          },
        });

    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to update settings' }, { status: 500 });
  }
}
