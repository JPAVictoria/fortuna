import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, targetAmount, icon, color, deadline } = body;

    const data = await prisma.savingsGoal.update({
      where: { id: params.id, deleted: false },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(targetAmount !== undefined && { targetAmount: parseFloat(targetAmount) }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
    });

    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to update savings goal' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    // Soft-delete the goal; deposits cascade via their own deleted flag
    await prisma.$transaction([
      prisma.savingsGoal.update({
        where: { id: params.id },
        data: { deleted: true },
      }),
      prisma.savingsDeposit.updateMany({
        where: { goalId: params.id },
        data: { deleted: true },
      }),
    ]);
    return Response.json({ data: { id: params.id } });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to delete savings goal' }, { status: 500 });
  }
}
