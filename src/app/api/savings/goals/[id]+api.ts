import { prisma } from '@/lib/prisma';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    // Deposits cascade-delete via schema onDelete: Cascade
    await prisma.savingsGoal.delete({ where: { id: params.id } });
    return Response.json({ data: { id: params.id } });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to delete savings goal' }, { status: 500 });
  }
}
