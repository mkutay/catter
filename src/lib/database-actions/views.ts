import { ResultAsync } from 'neverthrow';

import { sql } from '@/lib/postgres';
import { ViewCount } from '@/config/types';
import { siteConfig } from '@/config/site';
import { getAuth } from '@/lib/database-queries/auth';
import { getViewCount } from '@/lib/database-queries/views';

export const incrementViews = ({ slug }: { slug: string }) => 
  getAuth()
    .andThen((session) =>
      process.env.NODE_ENV === 'development' || (session && session.user && siteConfig.admins.includes(session.user.email as string))
        ? getViewCount({ slug })
        : insertIntoViews(slug).map((view) => view[0].count)
    );

const insertIntoViews = (slug: string) => ResultAsync
  .fromPromise(
    sql<ViewCount[]>`
      INSERT INTO views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = views.count + 1
      WHERE views.slug = ${slug}
      RETURNING *;
    `,
    () => ({
      message: 'Failed to increment views. Database error.',
      code: 'DATABASE_ERROR' as const,
    })
  );