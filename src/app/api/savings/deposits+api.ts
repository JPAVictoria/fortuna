import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goalId, amount, notes } = body;

    if (!goalId) {
      return Response.json({ data: null, error: 'Goal ID is required' }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return Response.json({ data: null, error: 'Invalid amount' }, { status: 400 });
    }

    // Create deposit and update goal's currentAmount in a transaction
    const [deposit] = await prisma.$transaction([
      prisma.savingsDeposit.create({
        data: {
          goalId,
          amount: parseFloat(amount),
          date: new Date(),
          notes: notes?.trim() || null,
        },
      }),
      prisma.savingsGoal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: parseFloat(amount) } },
      }),
    ]);

    return Response.json({ data: deposit }, { status: 201 });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to add deposit' }, { status: 500 });
  }
}
