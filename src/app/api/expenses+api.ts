import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.expense.findMany({
      where: { deleted: false },
      include: { category: { where: { deleted: false } } },
      orderBy: { date: 'desc' },
    });
    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, categoryId, date, notes } = body;

    if (!amount || amount <= 0)
      return Response.json({ data: null, error: 'Invalid amount' }, { status: 400 });
    if (!description?.trim())
      return Response.json({ data: null, error: 'Description is required' }, { status: 400 });
    if (!categoryId)
      return Response.json({ data: null, error: 'Category is required' }, { status: 400 });

    const data = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description: description.trim(),
        categoryId,
        date: new Date(date ?? Date.now()),
        notes: notes?.trim() || null,
      },
      include: { category: true },
    });

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to create expense' }, { status: 500 });
  }
}
