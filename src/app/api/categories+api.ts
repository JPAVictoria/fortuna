import { prisma } from '@/lib/prisma';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

export async function GET() {
  try {
    let data = await prisma.category.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'asc' },
    });

    if (data.length === 0) {
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map(({ id, name, icon, color, isDefault }) => ({
          id, name, icon, color, isDefault,
        })),
        skipDuplicates: true,
      });
      data = await prisma.category.findMany({
        where: { deleted: false },
        orderBy: { createdAt: 'asc' },
      });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, color } = body;

    if (!name?.trim())
      return Response.json({ data: null, error: 'Name is required' }, { status: 400 });

    const data = await prisma.category.create({
      data: { name: name.trim(), icon: icon ?? '📦', color: color ?? '#6B7280', isDefault: false },
    });

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to create category' }, { status: 500 });
  }
}
