import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { amount, description, categoryId, date, notes } = body;

    const data = await prisma.expense.update({
      where: { id: params.id, deleted: false },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(description !== undefined && { description: description.trim() }),
        ...(categoryId !== undefined && { categoryId }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
      include: { category: true },
    });

    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.expense.update({
      where: { id: params.id },
      data: { deleted: true },
    });
    return Response.json({ data: { id: params.id } });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to delete expense' }, { status: 500 });
  }
}
