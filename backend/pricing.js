const ADDONS = {
  porter: { price: 15000, type: 'flat' },
  room: { price: 8000, type: 'per_person' },
  acclimatization: { price: 10000, type: 'flat' },
  gear: { price: 5000, type: 'per_person' },
};

export function calculateBookingPrice({ trekPrice, travelers, addons, paymentMethod = 'deposit' }) {
  const people = Number(travelers);
  const price = Number(trekPrice);
  if (!Number.isInteger(price) || price < 0) throw new Error('Selected trek is unavailable.');
  if (!Number.isInteger(people) || people < 1 || people > 20) throw new Error('Traveler count is invalid.');
  if (!Array.isArray(addons) || addons.some((addon) => !Object.hasOwn(ADDONS, addon))) throw new Error('Selected add-ons are invalid.');
  if (!['deposit', 'full'].includes(paymentMethod)) throw new Error('Payment selection is invalid.');

  const uniqueAddons = [...new Set(addons)];
  const base = price * people;
  const discountPercent = people >= 6 ? 10 : people >= 3 ? 5 : 0;
  const discountedBase = base - Math.round(base * discountPercent / 100);
  const addonsTotal = uniqueAddons.reduce((sum, key) => {
    const addon = ADDONS[key];
    return sum + addon.price * (addon.type === 'per_person' ? people : 1);
  }, 0);
  const grandTotal = discountedBase + addonsTotal;

  return {
    grand_total: grandTotal,
    deposit_amount: Math.round(grandTotal * 0.2),
  };
}
