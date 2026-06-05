import { eq, ilike, and, desc, asc, count } from 'drizzle-orm';
import { db } from '../config/db.js';
import { todos } from '../db/schema.js';

export const todoRepository = {
  /**
   * Find all todos with filters, search, pagination, and sorting
   */
  async findAll({ page, limit, search, status, sortBy, order }) {
    const offset = (page - 1) * limit;

    // Build filters
    const conditions = [];

    if (search) {
      conditions.push(ilike(todos.title, `%${search}%`));
    }

    if (status === 'completed') {
      conditions.push(eq(todos.completed, true));
    } else if (status === 'pending') {
      conditions.push(eq(todos.completed, false));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build sorting field map to schema keys
    let sortColumn = todos.createdAt; // Default fallback
    if (sortBy === 'title') {
      sortColumn = todos.title;
    } else if (sortBy === 'completed') {
      sortColumn = todos.completed;
    }

    const orderByClause = order === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // Fetch paginated rows
    const data = await db
      .select()
      .from(todos)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Fetch total matching count
    const totalCountQuery = await db
      .select({ total: count() })
      .from(todos)
      .where(whereClause);

    const total = totalCountQuery[0]?.total || 0;

    return {
      todos: data,
      total,
    };
  },

  /**
   * Find todo by ID
   */
  async findById(id) {
    const result = await db.select().from(todos).where(eq(todos.id, id));
    return result[0] || null;
  },

  /**
   * Find pending todo by title (used to validate duplicates)
   */
  async findPendingByTitle(title) {
    return (
      await db
        .select()
        .from(todos)
        .where(and(eq(todos.title, title), eq(todos.completed, false)))
    )[0] || null;
  },

  /**
   * Create new todo
   */
  async create({ title, description }) {
    const result = await db
      .insert(todos)
      .values({
        title,
        description,
        completed: false,
      })
      .returning();
    return result[0];
  },

  /**
   * Update existing todo properties
   */
  async update(id, updates) {
    const result = await db
      .update(todos)
      .set({
        ...updates,
        updatedAt: new Date(), // Explicitly trigger update timestamp
      })
      .where(eq(todos.id, id))
      .returning();
    return result[0] || null;
  },

  /**
   * Delete todo by ID
   */
  async delete(id) {
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();
    return result.length > 0;
  },
};
