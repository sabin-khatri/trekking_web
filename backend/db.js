import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import { treks as defaultTreks } from '../frontend/src/data/treks.js';

const { Schema } = mongoose;

const paymentAttemptSchema = new Schema({
  provider: { type: String, enum: ['esewa'], required: true },
  transaction_uuid: { type: String, required: true },
  token_hash: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  payment_method: { type: String, enum: ['deposit', 'full'], default: 'deposit' },
  status: { type: String, enum: ['pending', 'complete', 'failed'], default: 'pending' },
  reference_id: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  completed_at: { type: Date, default: null },
}, { _id: false });

const adminSchema = new Schema({
  full_name: { type: String, default: 'Admin User', trim: true, minlength: 2, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 320 },
  password_hash: { type: String, required: true },
  notification_preferences: {
    newBooking: { type: Boolean, default: true },
    cancellation: { type: Boolean, default: true },
    paymentReceived: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: false },
  },
  weekly_report_sent_week: { type: String, default: '' },
}, { timestamps: { createdAt: 'created_at', updatedAt: false }, toJSON: { virtuals: true } });

const customerSchema = new Schema({
  full_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 320 },
  password_hash: { type: String, required: true },
  phone: { type: String, default: '', trim: true, maxlength: 40 },
  email_verified_at: { type: Date, default: null },
  email_verification_token_hash: { type: String, default: '' },
  email_verification_expires_at: { type: Date, default: null },
  password_reset_token_hash: { type: String, default: '' },
  password_reset_expires_at: { type: Date, default: null },
  token_version: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false });

const bookingSchema = new Schema({
  booking_reference: { type: String, unique: true, sparse: true, default: () => randomBytes(9).toString('hex').toUpperCase() },
  trek_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  start_date: { type: String, required: true },
  travelers: { type: Number, required: true, min: 1, max: 20, validate: Number.isInteger },
  addons: { type: [String], default: [] },
  customer_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  customer_email: { type: String, required: true, trim: true, lowercase: true, minlength: 3, maxlength: 320 },
  customer_phone: { type: String, required: true, trim: true, minlength: 5, maxlength: 40 },
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
  prep_completed_tasks: { type: [String], default: [] },
  message: { type: String, default: '', maxlength: 3000 },
  grand_total: { type: Number, required: true, min: 0, validate: Number.isInteger },
  payment_method: { type: String, enum: ['deposit', 'full'], default: 'deposit' },
  deposit_amount: { type: Number, required: true, min: 0, validate: Number.isInteger },
  payment_status: { type: String, enum: ['unpaid', 'pending', 'partially_paid', 'paid', 'failed'], default: 'unpaid' },
  paid_amount: { type: Number, min: 0, default: 0 },
  payment_reference_id: { type: String, default: '' },
  payment_attempts: { type: [paymentAttemptSchema], default: [] },
  admin_reminder_sent_at: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false, toJSON: { virtuals: true } });

const itineraryDaySchema = new Schema({
  day: { type: Number, required: true, min: 1 },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: '', maxlength: 1500 },
}, { _id: false });

const trekPackageSchema = new Schema({
  slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  seed_key: { type: String, unique: true, sparse: true, trim: true },
  sort_order: { type: Number, default: 9999 },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  region: { type: String, required: true, trim: true, maxlength: 120 },
  duration: { type: String, required: true, trim: true, maxlength: 60 },
  difficulty: { type: String, required: true, enum: ['Easy', 'Moderate', 'Strenuous'] },
  price: { type: Number, required: true, min: 0, validate: Number.isInteger },
  maxGroupSize: { type: Number, required: true, min: 1, max: 100, validate: Number.isInteger },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  description: { type: String, default: '', maxlength: 3000 },
  image_url: { type: String, default: '', maxlength: 2000 },
  max_altitude: { type: String, default: '', maxlength: 40 },
  featured: { type: Boolean, default: false },
  itinerary: { type: [itineraryDaySchema], default: [] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false, toJSON: { virtuals: true } });

export const Admin = mongoose.model('Admin', adminSchema);
export const Customer = mongoose.model('Customer', customerSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const TrekPackage = mongoose.model('TrekPackage', trekPackageSchema);

const newsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 320 },
  subscribed_at: { type: Date, default: Date.now },
}, { versionKey: false });

export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

const adminActivitySchema = new Schema({
  action: { type: String, required: true, maxlength: 100 },
  booking_reference: { type: String, default: '' },
  booking_id: { type: String, default: '' },
  details: { type: String, default: '', maxlength: 500 },
  created_at: { type: Date, default: Date.now, index: true },
}, { versionKey: false });

export const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);

const reviewSchema = new Schema({
  trek_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  trek_slug: { type: String, default: '', trim: true, lowercase: true },
  reviewer_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  reviewer_email: { type: String, default: '', lowercase: true, trim: true, maxlength: 320 },
  rating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
  comment: { type: String, default: '', maxlength: 1000 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submitter_ip: { type: String, default: '' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false });

reviewSchema.index({ trek_slug: 1, status: 1 });
reviewSchema.index({ status: 1, created_at: -1 });

export const Review = mongoose.model('Review', reviewSchema);

const slugify = (value) => String(value).normalize('NFKD').toLowerCase()
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

async function preparePackageCatalog() {
  await TrekPackage.init();
  const packagesMissingSlug = await TrekPackage.find({ $or: [{ slug: { $exists: false } }, { slug: '' }] }).select('_id name').lean();
  for (const packageRecord of packagesMissingSlug) {
    const base = slugify(packageRecord.name) || 'trek';
    const slug = `${base}-${String(packageRecord._id).slice(-5)}`;
    await TrekPackage.collection.updateOne({ _id: packageRecord._id }, { $set: { slug } });
  }

  const existingPackages = await TrekPackage.find().select('name slug seed_key').lean();
  const existingSlugs = new Set(existingPackages.map(({ slug }) => slug).filter(Boolean));
  let seeded = 0;
  for (const trek of defaultTreks) {
    if (await TrekPackage.exists({ seed_key: trek.id })) continue;
    const existingByName = await TrekPackage.findOne({ name: new RegExp(`^${trek.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (existingByName) {
      existingByName.seed_key = trek.id;
      await existingByName.save();
      continue;
    }
    const difficulty = trek.category === 'easy' ? 'Easy' : trek.category === 'moderate' ? 'Moderate' : 'Strenuous';
    await TrekPackage.create({
      seed_key: trek.id,
      slug: existingSlugs.has(trek.id) ? `${trek.id}-${Date.now().toString(36)}` : trek.id,
      sort_order: defaultTreks.indexOf(trek),
      name: trek.name,
      region: trek.location,
      duration: `${trek.duration} days`,
      difficulty,
      price: trek.price,
      maxGroupSize: 12,
      status: 'active',
      description: trek.description,
      image_url: trek.image,
      max_altitude: trek.maxAltitude || '',
      featured: Boolean(trek.featured),
      itinerary: trek.itinerary || [],
    });
    existingSlugs.add(trek.id);
    seeded += 1;
  }
  if (seeded) console.log(`Added ${seeded} default trek package(s) to MongoDB`);
}

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI must be configured.');
  await mongoose.connect(uri);
  const legacyBookings = await Booking.find({ booking_reference: { $exists: false } }).select('_id').lean();
  await Promise.all(legacyBookings.map(({ _id }) => Booking.collection.updateOne(
    { _id, booking_reference: { $exists: false } },
    { $set: { booking_reference: randomBytes(9).toString('hex').toUpperCase() } },
  )));
  if (legacyBookings.length) console.log(`Added tracking references to ${legacyBookings.length} existing booking(s)`);
  await preparePackageCatalog();
  console.log('Connected to MongoDB');
}
