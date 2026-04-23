-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" TEXT DEFAULT 'free',
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT DEFAULT 'free';
