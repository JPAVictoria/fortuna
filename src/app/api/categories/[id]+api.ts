import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, icon, color } = body;

    const data = await prisma.category.update({
      where: { id: params.id, deleted: false },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
      },
    });

    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.category.findUnique({ where: { id: params.id } });

    if (!category)
      return Response.json({ data: null, error: 'Category not found' }, { status: 404 });
    if (category.isDefault)
      return Response.json({ data: null, error: 'Default categories cannot be deleted' }, { status: 400 });

    await prisma.category.update({
      where: { id: params.id },
      data: { deleted: true },
    });

    return Response.json({ data: { id: params.id } });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to delete category' }, { status: 500 });
  }
}
