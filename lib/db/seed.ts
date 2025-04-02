import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers, subscriptionPlans } from './schema';
import { hashPassword } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  const basePrice = await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 14,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  const plusPrice = await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 14,
    },
  });

  console.log('Stripe products and prices created successfully.');
  return { basePrice, plusPrice };
}

async function createSubscriptionPlans() {
  console.log('Creating subscription plans...');

  // Prima creiamo i prodotti e i prezzi in Stripe
  const { basePrice, plusPrice } = await createStripeProducts();

  const basePlan = await db.insert(subscriptionPlans).values({
    plan_code: 'base',
    plan_name: 'Base',
    plan_description: 'Perfect for small teams and startups',
    price: '8.00',
    billing_interval: 'month',
    trial_days: 14,
    message_quota: 1000,
    features: ['Unlimited Usage', 'Unlimited Workspace Members', 'Email Support'],
    is_displayed: true,
    display_order: 1,
    is_default: true,
    stripe_price_id: basePrice.id
  }).returning();

  const plusPlan = await db.insert(subscriptionPlans).values({
    plan_code: 'plus',
    plan_name: 'Plus',
    plan_description: 'For growing teams that need more',
    price: '12.00',
    billing_interval: 'month',
    trial_days: 14,
    message_quota: 5000,
    features: [
      'Everything in Base, and:',
      'Early Access to New Features',
      '24/7 Support + Slack Access'
    ],
    is_displayed: true,
    display_order: 2,
    is_default: false,
    stripe_price_id: plusPrice.id
  }).returning();

  console.log('Subscription plans created successfully.');
}

async function createInitialUser() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: "owner",
      },
    ])
    .returning();

  console.log('Initial user created.');

  const [team] = await db
    .insert(teams)
    .values({
      name: 'Test Team',
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  console.log('Initial team created and user added as owner.');
}

async function seed() {
  try {
    console.log('🌱 Starting seed process...');

    // Verifica se l'utente esiste già
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, 'test@test.com'))
      .limit(1);

    if (existingUser.length === 0) {
      await createInitialUser();
    } else {
      console.log('Test user already exists, skipping user creation...');
    }

    // Forza la ricreazione dei piani
    console.log('Deleting existing subscription plans...');
    await db.delete(subscriptionPlans);
    await createSubscriptionPlans();

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('Seed process failed:', error);
    process.exit(1);
  }
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
