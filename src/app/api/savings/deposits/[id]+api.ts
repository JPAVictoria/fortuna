import { prisma } from '@/lib/prisma';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const deposit = await prisma.savingsDeposit.findUnique({
      where: { id: params.id, deleted: false },
    });

    if (!deposit)
      return Response.json({ data: null, error: 'Deposit not found' }, { status: 404 });

    await prisma.$transaction([
      prisma.savingsDeposit.update({
        where: { id: params.id },
        data: { deleted: true },
      }),
      prisma.savingsGoal.update({
        where: { id: deposit.goalId },
        data: { currentAmount: { decrement: deposit.amount } },
      }),
    ]);

    return Response.json({ data: { id: params.id } });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to delete deposit' }, { status: 500 });
  }
}
