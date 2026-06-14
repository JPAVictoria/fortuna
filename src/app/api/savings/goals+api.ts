import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.savingsGoal.findMany({
      include: { deposits: { orderBy: { date: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to fetch savings goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, targetAmount, icon, color, deadline } = body;

    if (!name?.trim()) {
      return Response.json({ data: null, error: 'Name is required' }, { status: 400 });
    }
    if (!targetAmount || targetAmount <= 0) {
      return Response.json({ data: null, error: 'Invalid target amount' }, { status: 400 });
    }

    const data = await prisma.savingsGoal.create({
      data: {
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        icon: icon ?? '🏦',
        color: color ?? '#10B981',
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to create savings goal' }, { status: 500 });
  }
}
