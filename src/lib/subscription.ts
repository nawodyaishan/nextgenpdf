import { eq } from 'drizzle-orm';
import { userSubscriptionsTable } from '@/lib/db/schema';
import { DatabaseService } from '@/lib/db/services/database-service';
import { auth } from '@clerk/nextjs/server';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const checkSubscription = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }

  const _userSubscriptions = await DatabaseService.getNeonHttpDatabase()
    .select()
    .from(userSubscriptionsTable)
    .where(eq(userSubscriptionsTable.userId, userId));

  if (!_userSubscriptions[0]) {
    return false;
  }

  const userSubscription = _userSubscriptions[0];

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
